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

function almacenarDatos() {
    let primer_octeto = document.getElementById("primer_octeto").value
    let segundo_octeto = document.getElementById("segundo_octeto").value
    let tercer_octeto = document.getElementById("tercer_octeto").value
    let cuarto_octeto = document.getElementById("cuarto_octeto").value
    let ip_completa = document("ip_completa").value = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + "." + cuarto_octeto
}

function mostrarResultado() {
    formulario.style.display = "none"
    resultado.style.display = "block"
    almacenarDatos();

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



