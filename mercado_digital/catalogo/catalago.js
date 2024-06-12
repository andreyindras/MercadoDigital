let figuraCarrinho = document.querySelector('.icon-figura');
let fecharCarrinho = document.querySelector('.fechar');
let body = document.querySelector('body');
let listaProdutosHTML = document.querySelector('.lista-produtos');
let listaCarrinhoHTML = document.querySelector('.lista-carrinho');
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];


figuraCarrinho.addEventListener('click', () => {
    body.classList.toggle('mostrar-carrinho');
});

fecharCarrinho.addEventListener('click', () => {
    body.classList.remove('mostrar-carrinho');
});

const adicionarDadosAoHTML = () => {
    listaProdutosHTML.innerHTML = '';
    if (produtos.length > 0) {
        produtos.forEach(produto => {
            let novoProduto = document.createElement('div');
            novoProduto.dataset.id = produto.id;
            novoProduto.classList.add('item');
            novoProduto.innerHTML = `
                <img src="${produto.imagem}" alt="">
                <h2>${produto.nome}</h2>
                <div class="preco">R$${produto.preco.toFixed(2)}</div>
                <button class="add-carrinho">Adicionar Ao Carrinho</button>`;
            listaProdutosHTML.appendChild(novoProduto);
        });
    }
};

listaProdutosHTML.addEventListener('click', (event) => {
    let posicaoClique = event.target;
    if (posicaoClique.classList.contains('add-carrinho')) {
        let id_produto = posicaoClique.parentElement.dataset.id;
        adicionarAoCarrinho(id_produto);
    }
});

const adicionarAoCarrinho = (id_produto) => {
    let posicaoProdutoNoCarrinho = carrinho.findIndex((valor) => valor.id_produto == id_produto);
    let produtoSelecionado = produtos.find((produto) => produto.id == id_produto);
    if (posicaoProdutoNoCarrinho < 0) {
        carrinho.push({
            id_produto: id_produto,
            quantidade: 1,
            imagem: produtoSelecionado.imagem,
            nome: produtoSelecionado.nome,
            preco: produtoSelecionado.preco
        });
    } else {
        carrinho[posicaoProdutoNoCarrinho].quantidade += 1;
    }
    adicionarCarrinhoAoHTML();
    adicionarCarrinhoAMemoria();
};

const adicionarCarrinhoAMemoria = () => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
};

const calcularTotalCarrinho = () => {
    let total = 0;
    carrinho.forEach(item => {
        let produto = produtos.find((p) => p.id == item.id_produto);
        if (produto) { 
            total += produto.preco * item.quantidade;
        }
    });
    return total;
};

const adicionarCarrinhoAoHTML = () => {
    listaCarrinhoHTML.innerHTML = '';
    let quantidadeTotal = 0;
    if (carrinho.length > 0) {
        carrinho.forEach(item => {
            quantidadeTotal += item.quantidade;
            let novoItem = document.createElement('div');
            novoItem.classList.add('item');
            novoItem.dataset.id = item.id_produto;

            let produto = produtos.find((p) => p.id == item.id_produto);
            if (produto) { 
                novoItem.innerHTML = `
                    <div class="imagem">
                        <img src="${produto.imagem}">
                    </div>
                    <div class="nome">${produto.nome}</div>
                    <div class="preco-total">R$${(produto.preco * item.quantidade).toFixed(2)}</div>
                    <div class="quantidade">
                        <span class="menos">-</span>
                        <span>${item.quantidade}</span>
                        <span class="mais">+</span>
                    </div>`;
                listaCarrinhoHTML.appendChild(novoItem);
            }
        });
    }
    figuraCarrinho.querySelector('span').innerText = quantidadeTotal;
    document.querySelector('#total').innerText = calcularTotalCarrinho().toFixed(2);
};

listaCarrinhoHTML.addEventListener('click', (event) => {
    let posicaoClique = event.target;
    if (posicaoClique.classList.contains('menos') || posicaoClique.classList.contains('mais')) {
        let id_produto = posicaoClique.parentElement.parentElement.dataset.id;
        let tipo = posicaoClique.classList.contains('mais')? 'mais' : 'menos';
        alterarQuantidadeCarrinho(id_produto, tipo);
    }
});

const alterarQuantidadeCarrinho = (id_produto, tipo) => {
    let posicaoItemNoCarrinho = carrinho.findIndex((valor) => valor.id_produto == id_produto);
    if (posicaoItemNoCarrinho >= 0) {
        let item = carrinho[posicaoItemNoCarrinho];
        if (tipo === 'mais') {
            item.quantidade += 1;
        } else {
            item.quantidade -= 1;
            if (item.quantidade <= 0) {
                carrinho.splice(posicaoItemNoCarrinho, 1);
            }
        }
        adicionarCarrinhoAMemoria(); 
    }
    adicionarCarrinhoAoHTML();
};

function verificarCarrinho(){
    if(localStorage.getItem('carrinhoFinalizar')){
        carrinho = JSON.parse(localStorage.getItem('carrinhoFinalizar'));
        localStorage.removeItem('carrinhoFinalizar'); 
    }
}

function finalizarCompra() {
    localStorage.setItem('carrinhoFinalizar', JSON.stringify(carrinho));
    window.location.href = '../finalizar_compra/finalizar.html';
}

const limparCarrinhoInvalido = () => {
    carrinho = carrinho.filter(item => produtos.some(produto => produto.id == item.id_produto));
    adicionarCarrinhoAMemoria();
    adicionarCarrinhoAoHTML();
};

verificarCarrinho();
limparCarrinhoInvalido();
adicionarDadosAoHTML();
adicionarCarrinhoAoHTML();