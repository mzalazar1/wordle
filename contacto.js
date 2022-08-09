window.onload = function () {
   
    var btnEnviar = document.getElementById("btnEnviar")
    var btnVolver = document.getElementById("btnVolver")
    var btnCodigo = document.getElementById("btnCodigo")
    btnEnviar.addEventListener("click", verifTodo)
    btnVolver.addEventListener("click", volver)
    btnCodigo.addEventListener("click", irACodigo)
    var regOk = 0

   //validacion nombre
var nombre = document.getElementById('name');
var nombreError = document.getElementById('nameError');

nombre.addEventListener('blur', validateNombre);
nombre.addEventListener('focus', clearNombreError);

function clearNombreError(e) {
    nombreError.classList.add('hiddenError');
} 

function validateNombre(e) {
    var x = nombre.value;
    if(x.length < 2) {
        nombreError.classList.remove('hiddenError');
    } else{
       regOk++;
    }
}

//validacion mail
var mail = document.getElementById('mail');
var mailError = document.getElementById('mailError');

mail.addEventListener('blur', validateMail);
mail.addEventListener('focus', clearMailError);

function clearMailError(e) {
    mailError.classList.add('hiddenError');
}


function validateMail(e) {
    var x = mail.value;
    var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i ;
    
    if(!emailRegex.test(x)) {
       mailError.classList.remove('hiddenError');
   } else{
       regOk++;
    }
}
    


//valida comentarios
    var comentarios = document.getElementById('mensaje')
    var comentariosError = document.getElementById('comentariosError');

    comentarios.addEventListener("blur", validateComen)
    comentarios.addEventListener("focus", clearComenError)

    function clearComenError(e) {
        comentariosError.classList.add('hiddenError');
    }

    function validateComen(e) {
        if(comentarios.value.length < 5) {
            comentariosError.classList.remove('hiddenError');
        } else {
            regOk++
        }
    }
    //validar todo    
    function verifTodo () {
        regOk = 0
        validateNombre()
        validateMail()
        validateComen()
        if (regOk == 3) {
            var mensaje = "Hola, mi nombre es " + nombre.value + " y mi dirección de correo electrónico es " + mail.value + ". Quiero enviarles el siguiente mensaje: " + comentarios.value
            window.open('mailto:contacto@finalwordle.com?subject=Contacto desde la web&body=' + mensaje)
        }
    }
    //botones
    function volver() {
        document.location.href = "index.html"
    }

    function irACodigo () {                    //abre la pagina de github con el codigo
        window.open("https://github.com/mzalazar1/wordle", "_blank")
    }
}