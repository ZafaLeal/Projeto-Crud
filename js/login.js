const email = "admin@admin.com";
const senha = '123456';

let campoEmail = document.querySelector('#email');
let campoSenha = document.querySelector('#password');
let btnEntrar = document.getElementById('login-button');

btnEntrar.addEventListener("click", () => {
   let emailDigitado = campoEmail.value.toLowerCase();
   let senhaDigitada = campoSenha.value;

   autenticar(emailDigitado, senhaDigitada);
});

function autenticar (email, senha){
   const URL = 'http://localhost:3400/login';
   
   fetch(URL, {
      method : 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body   : JSON.stringify({email, senha})
   })

   .then(response => response = response.json())
   .then(response => {
      console.log(response);
     
      if(!!response.mensagem){
         alert(response.mensagem);
         return;
      }

      mostrarLoading();

      salvarToken(response.token);
      salvarUsuario(response.usuario);

      setTimeout(() => {
        window.open('home.html', '_self');
      });
     
   })
     
   .catch(erro => {
      console.log(erro)
  })    
}

function mostrarLoading(){
   const divLoading = document.getElementById('loading');
   divLoading.style.display = "block";

   const divLogin = document.getElementById('container');
   divLogin.style.display = "none";
}

const mode = document.getElementById('mode_icon');

mode.addEventListener('click', () => {
  const form = document.getElementById('login_form');
  const password = document.getElementById('forgot-password');
  const container = document.getElementById('container');
  
  if(mode.classList.contains('fa-moon')) {
     mode.classList.remove('fa-moon');
     mode.classList.add('fa-sun');

     form.classList.add('dark')
     password.classList.add('dark');
     container.classList.add('dark');
     return;
  }

     mode.classList.remove('fa-sun');
     mode.classList.add('fa-moon');
     form.classList.remove('dark');
     password.classList.remove('dark');
     container.classList.remove('dark');
});

