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


function ipMascaraClase(primer_octeto) {
    if (primer_octeto >= 0 && primer_octeto <= 127) {
        document.getElementById("ip_clase").innerText = "Clase A";
        document.getElementById("ip_mascara").innerText = "225.0.0.0";
    } if (primer_octeto >= 128 && primer_octeto <= 191) {
        document.getElementById("ip_clase").innerText = "Clase B";
        document.getElementById("ip_mascara").innerText = "225.225.0.0";
    } if (primer_octeto >= 192 && primer_octeto <= 223) {
        document.getElementById("ip_clase").innerText = "Clase C";
        document.getElementById("ip_mascara").innerText = "225.225.225.0";
    } if (primer_octeto >= 224 && primer_octeto <= 239) {
        document.getElementById("ip_clase").innerText = "Clase D";
        document.getElementById("ip_mascara").innerText = "No tiene mascara";
    } if (primer_octeto >= 240 && primer_octeto <= 255) {
        document.getElementById("ip_clase").innerText = "Clase E";
        document.getElementById("ip_mascara").innerText = "No tiene mascara";
    }
}

// Obtener los elementos del formulario y el resultado
function mostrarResultado() {
    const primer_octeto = document.getElementById("primer_octeto").value
    const segundo_octeto = document.getElementById("segundo_octeto").value
    const tercer_octeto = document.getElementById("tercer_octeto").value
    const cuarto_octeto = document.getElementById("cuarto_octeto").value
    formulario.style.display = "none"
    resultado.style.display = "block"
    ipMascaraClase(primer_octeto);
    document.getElementById("ip_completa").innerText = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + "." + cuarto_octeto;

}

// Función para mostrar el resultado
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





