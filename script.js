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

document.getElementById("formulario").addEventListener('submit', function(event) {
    event.preventDefault();
    let octetoNoValido = false; 

    octetos.forEach(octeto => {
        if (octeto.style.color === "red") {
            octetoNoValido = true;
            alert("¡Hay un campo con valor inválido!");
        }
    });

    if (!octetoNoValido) {
        formulario.style.display = "none"
    }

});



