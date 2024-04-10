class Produto {
    constructor(obj){
        obj = obj || {}// Isso é um tratamento para evitar undefined quando tentar acessar alguma propriedade.
        this.id = obj.id;
        this.nome = obj.nome;
        this.valor = obj.valor;
        this.tamanho = obj.tamanho;
        this.quantidadeEstoque = obj.quantidadeEstoque;
        this.dataCadastro = obj.dataCadastro;
    }

    validar(){
        // return (!this.cpfOuCnpj || !this.email) ? false  : true;  
        return !!(this.nome && this.valor);  
    }
}