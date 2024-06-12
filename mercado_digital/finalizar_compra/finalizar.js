let listaCarrinho = JSON.parse(localStorage.getItem('carrinho'));

function verificarCarrinho() {
    if (localStorage.getItem('carrinhoFinalizar')) {
        listaCarrinho = JSON.parse(localStorage.getItem('carrinhoFinalizar'));
        localStorage.removeItem('carrinhoFinalizar');
    }
}
verificarCarrinho();
adicionarCarrinhoAoHTML();

function adicionarCarrinhoAoHTML() {
    let listaCarrinhoHTML = document.querySelector('.voltar-compra .lista');
    listaCarrinhoHTML.innerHTML = '';

    let totalQuantidadeHTML = document.querySelector('.retorno-compra .quantidade-total');
    let totalPrecoHTML = document.querySelector('.retorno-compra .preco-total');
    let totalQuantidade = 0;
    let totalPreco = 0;

    if (listaCarrinho) {
        listaCarrinho.forEach(produto => {
            if (produto) {
                let novoCarrinho = document.createElement('div');
                novoCarrinho.classList.add('item');
                novoCarrinho.innerHTML =
                    `<img src="${produto.imagem}" alt="">
                    <div class="info">
                        <div class="nome">${produto.nome}</div>
                    </div>
                    <div class="info">
                        <div class="preco">R$${produto.preco.toFixed(2)}</div>
                    </div>
                    <div class="info">
                        <div class="quantidade">${produto.quantidade}</div>
                    </div>`;
                listaCarrinhoHTML.appendChild(novoCarrinho);
                totalQuantidade = totalQuantidade + produto.quantidade;
                totalPreco = totalPreco + (produto.preco * produto.quantidade);
            }
        })
    }
    totalQuantidadeHTML.innerText = totalQuantidade;
    totalPrecoHTML.innerText = 'R$' + totalPreco.toFixed(2);
}


const botaoEnviarPedido = document.querySelector('.enviar-pedido');
botaoEnviarPedido.addEventListener('click', () => {
    localStorage.removeItem('carrinho');

    const popup = document.getElementById('popup');
    popup.style.display = 'block';

    const botaoFecharPopup = document.querySelector('.fechar-popup');
    botaoFecharPopup.addEventListener('click', () => {
        popup.style.display = 'none';
        window.location.href = '../catalogo/index.html';
    });
});

