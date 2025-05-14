const ip = document.getElementById("IP");

function formatoIP(ip) {
    const pattern = ip.pattern;
    const patron = new RegExp(pattern);  
    const isValid = patron.test(ip.value);

    if (isValid) {
        ip.style.color = "green";
    } else {
        ip.style.color = "red";
    }
}

//Botón que vuelve al menú principal
document.getElementById("menu_principal").addEventListener("click", function() {
    window.location.href = "index.html";
});

//Función que asigna el valor a la clase y la máscara 
function ipMascaraClase(primer_octeto) {
    if (primer_octeto >= 0 && primer_octeto <= 127) {
        document.getElementById("ip_clase").innerText = "Clase A";
        document.getElementById("ip_mascara").innerText = "255.0.0.0";
    } if (primer_octeto >= 128 && primer_octeto <= 191) {
        document.getElementById("ip_clase").innerText = "Clase B";
        document.getElementById("ip_mascara").innerText = "255.255.0.0";
    } if (primer_octeto >= 192 && primer_octeto <= 223) {
        document.getElementById("ip_clase").innerText = "Clase C";
        document.getElementById("ip_mascara").innerText = "255.255.255.0";
    } if (primer_octeto >= 224 && primer_octeto <= 239) {
        document.getElementById("ip_clase").innerText = "Clase D";
        document.getElementById("ip_mascara").innerText = "No tiene mascara";
    } if (primer_octeto >= 240 && primer_octeto <= 255) {
        document.getElementById("ip_clase").innerText = "Clase E";
        document.getElementById("ip_mascara").innerText = "No tiene mascara";
    }
}

//comprobaciones para el valor de la red
function tipoRed(primer_octeto) {
    if (primer_octeto == 10 || primer_octeto == 192 || primer_octeto == 172) {
        document.getElementById("tipo_red").innerText = "Red privada";
    } else {
        document.getElementById("tipo_red").innerText = "Red pública";
    }
}

//Muestra en verde los números en el rango indicado y muestra en rojo los que están fuera de rango
    document.getElementById("IP").addEventListener('input', () => {
        if (IP.value <= 255 && IP.value >= 0) {
            IP.style.color = "green"; 
        } else {
            IP.style.color = "red"; 
        }
        formatoIP(ip) 
    });

    function mostrarResultado(ip) {
        formulario.style.display = "none"
        resultado.style.display = "block"
        ipMascaraClase(primer_octeto);
        tipoRed(primer_octeto);
        document.getElementById("ip_completa").innerText = ip
    }

    document.getElementById("formulario").addEventListener('submit', function(event, ip) {
        event.preventDefault();
        mostrarResultado()
    });