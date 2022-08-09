window.onload = function() {
   
      //variables 
      var link = "https://wordle.danielfrg.com/words/5.json";
      var letras = [
          ["", "", "", "", ""],
          ["", "", "", "", ""],
          ["", "", "", "", ""],
          ["", "", "", "", ""],
          ["", "", "", "", ""],
          ["", "", "", "", ""]
      ]
      var btnLetra = document.getElementsByClassName("letra")     //busca los botones del teclado
      var numBtns = btnLetra.length
      var letTeclado = "QWERTYUIOPASDFGHJKLÑZXCVBNM"              //para validar letras usadas y pintar el teclado

      var partidasGuardadas = [""]                  //levanta las partidas que se encuentren en localstorage
      var palabra = "DEFEC"                       //palabra a encontrar en el tablero (queda esta en caso de no poder leer el json)
      var nomJug = ""
      var rowActual = 0                          //determina la fila actual (principalmente en el focus)
      var colActual = 0                           //determina la columna actual (principalmente en el focus)
      var palCorrecta = false                     //determina si la palabra en el renglon es la correcta
      var jugar = false                           //determina si el juego finalizo o no
      var importaDatos = false                    //determina si carga datos desde una partida guardada (se usa para validaciones)
      var seg = 0                                 //variables de cronometro
      var min = 0
      var hs = 0
      var id = 0                                  //id partida
  
  
      //Traer Elementos
      var enter = document.getElementById("enter")
      var borrar = document.getElementById("borrar")
      var colNom = document.getElementById("colNom")
      var empJuego = document.getElementById("jugar")
      var nombre = document.getElementById("nombre")
      var partGuard = document.getElementById("partGuard")
      var guardPart = document.getElementById("guardaPart")
      var crono = document.getElementById("cronometro")
      var btnContacto = document.getElementById("btnContactanos")
      var btnCodigo = document.getElementById("btnCodigo")
      var btnReiniciar = document.getElementById("btnReiniciar")
      //eventos
  
      empJuego.addEventListener("click", startJuego)
      enter.addEventListener("click",validaPalabra)
      borrar.addEventListener("click",borraLetra)
      document.addEventListener("keydown",focus)
      partGuard.addEventListener("click",cargaPartida)
      guardPart.addEventListener("click",guardaPartida)
      btnCodigo.addEventListener("click",abreCodigo)
      btnContacto.addEventListener("click",abreContacto)
      btnReiniciar.addEventListener("click",recargaPagina)
      for (var i = 0; i < numBtns; i++) {
          btnLetra[i].addEventListener('click', focus);  
      }

          //LLamadas inicio
  
          desCampos()
          buscaPalabra()
          leePartidas()
  
      //funciones
  
      function desCampos() {          //deshabilita todos los campos para que el usuario no los pueda usar
          for (let iFila = 0; iFila < letras.length; iFila++) {
              for (let iCol = 0; iCol < letras[iFila].length; iCol++) {
                  var id = "r"+iFila+"c"+iCol
                  var celda = document.getElementById(id)
                  celda.disabled = true
              }
          }
      }
  
      function buscaPalabra() {       //elige la palabra aleatoria para resolver
          var sinAcento = /[ÁÉÍÓÚ]/
          var palAnteriores = []
          fetch (link)
          .then(function(respuesta) {
              return respuesta.json()
          })
          .then (function(pal){
              var random = parseInt(Math.random() * pal.length)
              palabra = pal[random].toUpperCase()
              console.log(palabra)
              if (sinAcento.test(palabra)) {
                  buscaPalabra()
              } else {
                  if (localStorage.getItem("Palabra") != null) {           //se fija si hay alguna palabra guardada, repetida y carga en array
                      palAnteriores = JSON.parse(localStorage.getItem("Palabra"))
                      for (var i = 0; i < palAnteriores.length; i ++) {
                          if (palAnteriores[i] == palabra) {
                              buscaPalabra()
                          }
                      }
                  }
                  palAnteriores.push(palabra)
                  localStorage.setItem("Palabra", JSON.stringify(palAnteriores))
              }
          })
      }
  
      function leePartidas () {       //levanta partidas guardadas en localstorage
          partidasGuardadas = JSON.parse(localStorage.getItem("PartidasGuardadas"))
          if (partidasGuardadas != null) {
              id = partidasGuardadas.length + 1
          } else {
              id = 1
              partidasGuardadas = []
          }            
      }
  
      function startJuego () {        //acciones que realiza cuando comienza el juego
          if ((nombre.value != "" && jugar == false) || importaDatos) {
              jugar = true
              colNom.classList.add("oculto")
              nombre.classList.add("oculto")
              crono.classList.remove("oculto")
              guardPart.classList.remove("oculto")
              empJuego.classList.add("oculto")
              partGuard.classList.add("oculto")
              nomJug = nombre.value
              cronometro()
          } else {
              opModFalNom()
          }        
      }
  
      function focus() {              //detecta que sea una letra lo ingresado y en función de eso corre el focus o renglon
          if(jugar == true && colActual < 5 && event.keyCode > 64 && event.keyCode < 91 || event.keyCode == 192) {
              var celda = recCeldas(colActual)
              celda.value = event.key.toUpperCase()
              letras[rowActual][colActual] = celda.value
              if(colActual < 5) {
                  colActual++
              }
          }
          if(jugar == true && event.keyCode == 13) {       //tecla enter
              validaPalabra()
          }
          if(jugar == true && event.keyCode == 8) {        //tecla borrar
              borraLetra()
          }
          if(jugar == true && colActual < 5 && this.value != null) {        //ingresa valores desde el teclado en pantalla
              var celda = recCeldas(colActual)
              celda.value = this.value
              letras[rowActual][colActual] = celda.value
              if(colActual < 5) {
                  colActual++
              }
          }
      }
  
      function validaPalabra() {      //cuando presiona enter, hace las validaciones de la palabra y si esta completo
          if(validaRenglonCompleto()) {
              obtenerPalabra()
              if(rowActual < 5) {
                  rowActual++
              }
              colActual = 0
          } else if (!importaDatos) {
              alert("La palabra no esta completa")
          }
              
      }
  
      function borraLetra () {        //cuando el usuario presiona en la tecla borrar, borra la letra del tablero
          if(colActual > 0) {
              colActual--
          }
          var celdaActual = "r" + rowActual + "c" + colActual
          var celda = document.getElementById(celdaActual)
          celda.value = ""
      }
  
      function validaRenglonCompleto() {          //valida que el renglón este completo
          var filaCompleta = true
          for (let colCelda = 0; colCelda < 5; colCelda++) {
              var celda = recCeldas(colCelda)
              if (celda.value != "") {
                  filaCompleta = filaCompleta * true
              } else {
                  filaCompleta = filaCompleta * false
     0         }
          }
          return filaCompleta
      }
  
      function obtenerPalabra() {                 //procesa la palabra con las validaciones, obtiene la palabra y la pinta
          var newPalabra = palabra
          palCorrecta = true
          //revisa los verdes
          for (let colCelda = 0; colCelda < 5; colCelda++) {
              var celda = recCeldas(colCelda)
              if(palabra.charAt(colCelda) == celda.value) {    //compara las letras de la palabra con el valor de celda
                  celda.classList.add("bg-green")
                  pintaTeclado(celda, "bg-green")
                  newPalabra = newPalabra.replace(celda.value, "*")
                  palCorrecta = palCorrecta * true
              } else {
                  palCorrecta = palCorrecta * false
              }
          }
          //revisa los amarillos - grises
          for (let colCelda = 0; colCelda < 5; colCelda++) {          //revisa que encuentre la letra en la variable que dejo el verde
              var celda = recCeldas(colCelda)                         //y que no sea verde tampoco
              if(newPalabra.match(celda.value) && palabra.charAt(colCelda) != celda.value) {
                  newPalabra = newPalabra.replace(celda.value, "*")       
                  celda.classList.add("bg-yellow")
                  pintaTeclado(celda, "bg-yellow")
              }
              else if(palabra.charAt(colCelda) != celda.value && celda.value != "") {
                  celda.classList.add("bg-gray")
                  pintaTeclado(celda, "bg-gray")
              }
          }
          if (palCorrecta) {
              jugar = false
              ganaJuego()
          } else if (rowActual == 5) {
              jugar = false
              pierdeJuego()
          }
      }
  
      function recCeldas (idCel) {                //recorre las celdas y devuelve el valor rXcX
          var celda = "r" + rowActual + "c" + idCel
          var iCelda = document.getElementById(celda)
          return iCelda
      }
  
      function pintaTeclado (celda, color) {      //pinta el teclado con los colores que determine la funcion obtenerPalabra
          if (letTeclado.match(celda.value)) {
              letTeclado = letTeclado.replace(celda.value, "*")
              var idBtnLet = "let" + celda.value
              var btnLet = document.getElementById(idBtnLet)
              btnLet.classList.add(color)
          }
      }
  
      function ganaJuego () {                     //se dispara cuando se gana el juego
          opModGano()
      }
  
      function pierdeJuego () {                   //se dispara cuando se pierde el juego
          opModPerdio()
      }
  
      function cronometro () {                    //administra el cronometro
          var tiempo = "00:00:00"
          let mensaje = new Promise((resolve, reject)=>{
              setTimeout(function () {
                  resolve("ok")
                  if (jugar) {
                      if (seg < 60) {
                          seg++
                      } else {
                          seg = 0
                          if (min < 60) {
                              min++
                          } else {
                              min = 0
                              hs++
                          }
                      }
                      if (seg.toString().length < 2) {
                          seg = "0" + seg
                      }
                      if (min.toString().length < 2) {
                          min = "0" + min
                      }
                      tiempo = hs + ":" + min + ":" + seg
                      crono.textContent = tiempo
                  }
              }, 1000);
          })
          mensaje.then(m =>{
              cronometro()
              
          }).catch(function () {
              console.log('error');
          })
      }
  
      function guardaPartida () {                 //guarda la partida en curso
          var datosPartidaAct = []
          var fecha = new Date().toLocaleDateString()
          var hora = new Date().toLocaleTimeString();
          var existe = false
          datosPartidaAct = [id, nomJug, fecha, hora, palabra, letras, hs, min, seg]
          for(var x = 0; x < partidasGuardadas.length; x++) {                         //guarda en un array los datos de la partida
              var partida = partidasGuardadas[x]
              if (partida[0] == id) {
                  partidasGuardadas[x] = datosPartidaAct
                  existe = true
              }
          }
          if (!existe) {
              partidasGuardadas.push(datosPartidaAct)                                //verifica si no existe alguna partida anterior con el index
          }        
          console.log(partidasGuardadas)
          localStorage.setItem("PartidasGuardadas", JSON.stringify(partidasGuardadas))
      }
  
      function cargaPartida () {                  //muestra las partidas guardadas en el modal
          opModPartGuard()
          if (partidasGuardadas.length > 0) {
              partidasGuardadas.forEach(dato => {
                  var trNew = document.createElement("tr")
                  var btnNuevo = document.createElement("button")
                  var td1 = document.createElement("td")
                  var td2 = document.createElement("td")
                  var td3 = document.createElement("td")
                  var td4 = document.createElement("td")
                  var td5 = document.createElement("td")
                  btnNuevo.type = "button"
                  btnNuevo.innerText = "Seleccionar"
                  btnNuevo.className = "btnPartida"
                  btnNuevo.value = dato[0]
                  td1.innerText = dato[0]
                  td2.innerText = dato[2]
                  td3.innerText = dato[3]
                  td4.innerText = dato[1]
                  td5.innerText = dato[6] + ":" + dato[7] + ":" + dato[8]
                  trNew.appendChild(td1)
                  trNew.appendChild(td2)
                  trNew.appendChild(td3)
                  trNew.appendChild(td4)
                  trNew.appendChild(td5)
                  trNew.appendChild(btnNuevo)
                  document.getElementById("tblPartGuardadas").appendChild(trNew)
                  btnNuevo.addEventListener("click",cargaPartidaTablero)
              })
          }
      }
  
      function cargaPartidaTablero () {           //carga los datos en el tablero y la matriz de letras
          var registro = partidasGuardadas[this.value - 1]
          var letrasPartida = registro[5]
          id = registro[0]
          palabra = registro[4]
          hs = registro[6]
          min = registro[7]
          seg = registro[8]
          console.log(palabra)
          jugar = true
          importaDatos = true
          modalPartGuard.classList.remove("block")
          modalPartGuard.classList.add("oculto")
          rowActual = 0
          for (let iiFila = 0; iiFila < 6; iiFila++) {
              for (let iiCol = 0; iiCol < 5; iiCol++) {
                  var celda = recCeldas(iiCol)
                  celda.value = letrasPartida[iiFila][iiCol].toLocaleUpperCase()
                  letras[iiFila][iiCol] = letrasPartida[iiFila][iiCol]
              }
              validaPalabra()
          }
          startJuego()
          nomJug = registro[1]
          importaDatos = false
      }
  
      function abreCodigo () {                    //abre la pagina de github con el codigo
          window.open("https://github.com/mzalazar1/wordle", "_blank")
      }
  
      function abreContacto () {                  //abre la pagina con el contacto
          document.location.href = "contacto.html"
      }
  
      function recargaPagina () {                 //recarga la pagina
          location.reload()
      }
  
      // ---------- modales ---------- //
  
      //DOM
      var modalGano = document.getElementById("modalGano")
      var modalPerdio = document.getElementById("modalPerdio")
      var modalNombre = document.getElementById("modalFaltaNombre")
      var modalPartGuard = document.getElementById("modalPartGuard")
      var closePartGuard = document.getElementsByClassName("closePartGuard")[0]
      var closeNombre = document.getElementsByClassName("closeNombre")[0]
      var closeGano = document.getElementsByClassName("closeGano")[0]
      var closePerdio = document.getElementsByClassName("closePerdio")[0]
  
      //cierra modales
      closeGano.onclick = function() {
          modalGano.classList.remove("block")
          modalGano.classList.add("oculto")
      }
      closePerdio.onclick = function() {
          modalPerdio.classList.remove("block")
          modalPerdio.classList.add("oculto")
      }
      closeNombre.onclick = function() {
          modalNombre.classList.remove("block")
          modalNombre.classList.add("oculto")
      }
      closePartGuard.onclick = function() {
          modalPartGuard.classList.remove("block")
          modalPartGuard.classList.add("oculto")
      }
      window.onclick = function(event) {
          if (event.target == modalGano) {
              modalGano.classList.remove("block")
              modalGano.classList.add("oculto")
          }
          if (event.target == modalPerdio) {
              modalPerdio.classList.remove("block")
              modalPerdio.classList.add("oculto")
          }
          if (event.target == modalNombre) {
              modalNombre.classList.remove("block")
              modalNombre.classList.add("oculto")
          }
          if (event.target == modalPartGuard) {
              modalPartGuard.classList.remove("block")
              modalPartGuard.classList.add("oculto")
          }
      }
  
      //abre modales
      function opModGano () {
          modalGano.classList.remove("oculto")
          modalGano.classList.add("block")
      }
      function opModPerdio () {
          modalPerdio.classList.remove("oculto")
          modalPerdio.classList.add("block")
      }
      function opModFalNom () {
          modalNombre.classList.remove("oculto")
          modalNombre.classList.add("block")
      }
      function opModPartGuard () {
          modalPartGuard.classList.remove("oculto")
          modalPartGuard.classList.add("block")
      }

}


