window.onload = function() {
    var colores = [
        [1, 2, 0 ,3 ,0],
        [3, 0, 2, 0, 3],
        [2, 1, 0, 3 ,2],
        [1, 2, 2, 2, 3],
        [3, 1, 3, 0, 1],
        [2, 3, 2, 0, 0],
    ];



for (let fila = 0; fila < colores.length; fila++) {
    const element = colores[fila];
    //console.log(matriz[fila]);
   for (let col = 0; col < colores.length; col++) {
    const element = colores[col];
     // console.log(colores[col]);
    var pos = "r"+fila+"c"+col;
    var posInp = document.getElementById(pos);
    if (colores[fila][col] == 0 ){
    
    } else if (colores[fila][col] == 1 ) {
        posInp.classList.add("posInpGreen")
    } else if (colores[fila][col] == 2 ) {
        posInp.classList.add("posInpYellow")
    } else if (colores[fila][col] == 3 ) {
        posInp.classList.add("posInpGray")
    }
     
    }
    
}

var letras = [
    ["", "", "" ,"" ,""],
    ["", "", "", "", ""],
    ["", "", "", "" ,""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
];
inicio();

function inicio() {
for (let filaLet = 0; filaLet < 6; filaLet++) {
   
   for (let colLet = 0; colLet < 5; colLet++) {
    var id = "r"+filaLet+"c"+colLet;
    var input = document.getElementById(id);
    input.oninput = function() {
        
        letras[filaLet][colLet] = this.value;
        console.log(letras);
    }
    

     }
}
}


}

