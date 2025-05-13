const octetos = document.querySelectorAll('.octeto');

octetos.forEach(octeto => {
    octeto.addEventListener('input', () => {
        if (octeto.value <= 255 && octeto.value >= 0) {
            octeto.style.color = "green"; 
        } else {
            octeto.style.color = "red"; 
        }
    });
});

function mostrarResultado() {
    formulario.style.position = "relative"
    formulario.style.left ="0px"
    resultado.style.position = "relative"
    resultado.style.right = "0px"
}

document.getElementById("formulario").addEventListener('submit', function(event) {
    event.preventDefault();
    let octetoNoValido = false; 

    for (let i = 0; i < octetos.length; i++) {
        if (octetos[i].style.color === "red") {
            octetoNoValido = true;
            alert("¡Hay un campo con valor inválido!");
            break; 
        }
    }

    if (!octetoNoValido) {
        mostrarResultado()
    }
});



