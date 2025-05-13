const octetos = document.querySelectorAll('.octeto');

// Obtener el formulario y el resultado
octetos.forEach(octeto => {
    octeto.addEventListener('input', () => {
        if (octeto.value <= 255 && octeto.value >= 0) {
            octeto.style.color = "green"; 
        } else {
            octeto.style.color = "red"; 
        }
    });
});

//funcion para almacenar los datos
function almacenarDatos() {
    let primer_octeto = document.getElementById("primer_octeto").value
    let segundo_octeto = document.getElementById("segundo_octeto").value
    let tercer_octeto = document.getElementById("tercer_octeto").value
    let cuarto_octeto = document.getElementById("cuarto_octeto").value
    let ip_completa = document("ip_completa").value = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + "." + cuarto_octeto
    let mascara = document.getElementById("ip_mascara").value;
}

// Obtener los elementos del formulario y el resultado
function mostrarResultado() {
    formulario.style.display = "none"
    resultado.style.display = "block"
    almacenarDatos();

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

    if (primer_octeto >= 1 && primer_octeto <= 126) {
        document.getElementById("ip_clase").innerHTML = "Clase A";
        ip_mascara = "225.000.000.000";
    } else if (primer_octeto >= 128 && primer_octeto <= 191) {
        document.getElementById("ip_clase").innerHTML = "Clase B";
        ip_mascara = "225.225.000.000";
    } else if (primer_octeto >= 192 && primer_octeto <= 223) {
        document.getElementById("ip_clase").innerHTML = "Clase C";
        ip_mascara = "225.225.225.000";
    } else if (primer_octeto >= 224 && primer_octeto <= 239) {
        document.getElementById("ip_clase").innerHTML = "Clase D";
        ip_mascara = "no tiene mascara";
    } else if (primer_octeto >= 240 && primer_octeto <= 255) {
        document.getElementById("ip_clase").innerHTML = "Clase E";
        ip_mascara = "no tiene mascara";
    }

    if (!octetoNoValido) {
        mostrarResultado()
    }

});





