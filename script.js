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
    //const ip_completa = document.getElementById("ip_completa").innerText = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + "." + cuarto_octeto
}

function ipClase() {
    almacenarDatos()
    if (primer_octeto >= 0 && primer_octeto <= 127){
        document.getElementById("ip_clase").innerText = "Clase A"
    }
    if (primer_octeto >= 128 && primer_octeto <= 191){
        document.getElementById("ip_clase").innerText = "Clase A"
    }
    if (primer_octeto >= 192 && primer_octeto <= 223){
        document.getElementById("ip_clase").innerText = "Clase A"
    }
    if (primer_octeto >= 0 && primer_octeto <= 127){
        document.getElementById("ip_clase").innerText = "Clase A"
    }
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



