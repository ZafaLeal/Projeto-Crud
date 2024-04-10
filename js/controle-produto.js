const URL = 'http://localhost:3400/produtos'

let listaProdutos = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaProduto = document.querySelector('table>tbody');
let modalProduto = new bootstrap.Modal(document.getElementById('modal-produto'));

let modoEdicao = false;

let formModal = {
    titulo: document.querySelector('h4.modal-title'),
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    valor: document.querySelector("#valor"),
    tamanho: document.querySelector("#tamanho"),
    quantidadeEstoque: document.querySelector("#quantidadeEstoque"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar:document.querySelector("#btn-salvar"),
    btnCancelar:document.querySelector("#btn-cancelar")
}


btnAdicionar.addEventListener('click', () =>{
    modoEdicao = false;

    limparModalProduto();
    modalProduto.show();
});

// Obter os produtos da API
function obterProdutos() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization' : obterToken()
        }
    })
    .then(response => response.json())
    .then(produtos => {
        listaProdutos = produtos;
        popularTabela(produtos);
    })
    .catch((erro) => {});
}

obterProdutos();

function popularTabela(produtos){

    // Limpando a tabela para popular
    tabelaProduto.textContent = '';

    produtos.forEach(produto => { 
        criarLinhaNaTabela(produto);
    });
}

function criarLinhaNaTabela(produto){

    //1° Criando um tr, é uma linha na tabela.
    let tr  = document.createElement('tr');

    //2° Criar as tds dos conteudos da tabela
    let  tdId = document.createElement('td');
    let  tdNome = document.createElement('td');
    let  tdValor = document.createElement('td');
    let  tdQuantidade = document.createElement('td');
    let  tdTamanho = document.createElement('td');
    let  tdDataCadastro = document.createElement('td');
    let  tdAcoes = document.createElement('td');

    // 3° Atualizar as tds com base no produto
    tdId.textContent = produto.id
    tdNome.textContent = produto.nome;
    tdValor.textContent = produto.valor;
    tdQuantidade.textContent = produto.quantidadeEstoque;
    tdTamanho.textContent = produto.tamanho;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Editar
                            </button>
                            <button onclick="excluirProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Excluir
                        </button>`

    // 4° Adicionando as TDs à Tr
    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdQuantidade);
    tr.appendChild(tdTamanho);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    // 5° Adicionar a tr na tabela.
    tabelaProduto.appendChild(tr);
}


formModal.btnSalvar.addEventListener('click', () => {

    // 1° Capturar os dados da tela do modal e transformar em um produto
    let produto = obterProdutoDoModal();

    // 2° Verificar se os campos obrigatorios foram preenchidos

    if(!produto.validar()){
        alert("Nome e valor são obrigatórios.");
        return;
    }

     // 3°Mandar para API - Backend
     if(modoEdicao){
        // Aqui eu atualizo
        atualizarProdutoNoBackend(produto);
    }else{
        // Aqui eu cadastro
        adicionarProdutoNoBackend(produto);
    }

});

function atualizarProdutoNoBackend(produto){

    fetch(`${URL}/${produto.id}`, {
        method: "PUT",
        headers: {
            Authorization: obterToken(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })
    .then(() => {

        // Atualizar Produto na lista.]
        atualizarProdutoTabela(produto);
    }) 

    Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: `Produto atualizado com sucesso!`,
        showConfirmButton: false,
        timer: 6000
    }) 
        // fechar o modal 
        modalProduto.hide();
    
    }

function atualizarProdutoTabela(produto){
    let indice = listaProdutos.findIndex(c => c.id == produto.id);

    listaProdutos.splice(indice, 1, produto);

    popularTabela(listaProdutos);
}


function obterProdutoDoModal(){
    return new Produto({
        id: formModal.id.value,
        valor: formModal.valor.value,
        nome: formModal.nome.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        tamanho: formModal.tamanho.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()
    });
}

function adicionarProdutoNoBackend(produto){

    fetch(URL, {
        method: 'POST',
        headers: {
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(response => {
        let novoProduto = new Produto(response);
        listaProdutos.push(novoProduto);

        popularTabela(listaProdutos);

        // Fechar modal
        
        modalProduto.hide();

        // Mandar mensagem de produto cadastrado com sucesso!
        alert(`Produto ${produto.nome}, foi cadastrado com sucesso!`)
    })
}

function limparModalProduto(){
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.valor.value = '';
    formModal.quantidadeEstoque.value = '';
    formModal.tamanho.value = '';
    formModal.dataCadastro.value = '';

} 

function editarProduto(id){
    modoEdicao = true;
    formModal.titulo.textContent = "Editar Produto";
   
    // Aqui ele encontra dentro do array o cliente pelo seu id.
    let produto = listaProdutos.find(c => c.id == id);

    atualizarModalProduto(produto);

    modalProduto.show();
}

function atualizarModalProduto(produto){
    formModal.id.value = produto.id;
    formModal.nome.value = produto.nome;
    formModal.valor.value = produto.valor;
    formModal.quantidadeEstoque.value = produto.quantidadeEstoque;
    formModal.tamanho.value =  produto.dataCadastro.substring(0,10); // aqui pego só a data e não o timer.
}
function excluirProduto(id){
    let produto = listaProdutos.find(produto => produto.id == id);

    if(confirm("Deseja realmente excluir o produto " + produto.nome)){
        excluirCienteNoBackEnd(id);
    }
}

function excluirCienteNoBackEnd(id){
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: obterToken()
        }
    })
    .then(() => {
        removerProdutoDaLista(id);
        popularTabela(listaProdutos);
    })
}

function removerProdutoDaLista(id){
    let indice = listaProdutos.findIndex(produto => produto.id == id);

    listaProdutos.splice(indice, 1);
}