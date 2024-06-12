let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

const formulario = document.getElementById('formulario-produto');

formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const imagem = document.getElementById('imagem').files[0];

    const reader = new FileReader();
    reader.onload = () => {
        const novoProduto = {
            id: new Date().getTime(),
            nome,
            preco,
            imagem: reader.result
        };

        produtos.push(novoProduto);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        displayProdutosEditar();
        adicionarDadosAoHTML();
    };
    reader.readAsDataURL(imagem);
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('editar')) {
        const id = event.target.parentElement.dataset.id;
        const produto = produtos.find((p) => p.id === parseInt(id));
        const editarForm = document.createElement('form');
        editarForm.id = 'editar-formulario';
        editarForm.innerHTML = `
            <label for="nome">Nome do Produto:</label>
            <input type="text" id="nome" value="${produto.nome}"><br><br>
            <label for="preco">Preço:</label>
            <input type="number" id="preco" value="${produto.preco}"><br><br>
            <label for="imagem">Imagem:</label>
            <input type="file" id="imagem"><br><br>
            <button type="submit">Salvar Alterações</button>
        `;
        event.target.parentElement.appendChild(editarForm);

        editarForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const nome = editarForm.nome.value;
            const preco = parseFloat(editarForm.preco.value);
            const imagem = editarForm.imagem.files[0];


            produto.nome = nome;
            produto.preco = preco;

            if (imagem) {
                const reader = new FileReader();
                reader.onload = () => {
                    produto.imagem = reader.result;
                    localStorage.setItem('produtos', JSON.stringify(produtos));
                    editarForm.remove();
                    displayProdutosEditar();
                };
                reader.readAsDataURL(imagem);
            } else {
                localStorage.setItem('produtos', JSON.stringify(produtos));
                editarForm.remove();
                displayProdutosEditar();
            }
        });
    }
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remover')) {
        const id = event.target.parentElement.dataset.id;
        const index = produtos.findIndex((p) => p.id === parseInt(id));
        if (index >= 0) {
            produtos.splice(index, 1);
            localStorage.setItem('produtos', JSON.stringify(produtos));
            displayProdutosEditar();

            const itemIndex = carrinho.findIndex((item) => item.id_produto === parseInt(id));
            if (itemIndex >= 0) {
                carrinho.splice(itemIndex, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                adicionarCarrinhoAoHTML();
            }
        }
    }
});

const displayProdutosEditar = () => {
    const listaProdutosEditar = document.getElementById('lista-produtos-editar');
    listaProdutosEditar.innerHTML = '';
    produtos.forEach((produto) => {
        const li = document.createElement('li');
        li.dataset.id = produto.id;
        li.innerHTML = `
            <span>${produto.nome}</span>
            <button class="editar">Editar</button>
            <button class="remover">Remover</button>
        `;
        listaProdutosEditar.appendChild(li);
    });
};

displayProdutosEditar();