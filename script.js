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