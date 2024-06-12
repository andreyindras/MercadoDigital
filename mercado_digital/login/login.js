function login() {
    const username = document.getElementById('nome-entrar').value;
    const password = document.getElementById('senha-entrar').value;

    if (username === 'admin' && password === 'admin123') { 
       window.location.href = '../administrativo/admin.html'; 
    } else {
        window.location.href = '../catalogo/index.html'; 
    }
}
