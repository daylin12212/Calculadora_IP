const ip = document.getElementById("IP");

let clase = ""
let mascara = ""
let wildcard = ""
let direccion_red = ""
let direccion_broadcast = ""
let hosts = ""


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

document.getElementById("IP").addEventListener('input', () => {
    formatoIP(ip);
    personalizarMascara(ip)
});


function personalizarMascara(ip) {
    const octetos = ip.value.split('.');
    const primer_octeto = parseInt(octetos[0]);
    if (primer_octeto >= 0 && primer_octeto <= 127) {
        document.getElementById("mascara_personalizada").value = 8;
    }
    else if (primer_octeto >= 128 && primer_octeto <= 191) {
        document.getElementById("mascara_personalizada").value = 16;
    } else if (primer_octeto >= 192 && primer_octeto <= 223) {
        document.getElementById("mascara_personalizada").value = 24;
    } else {
        document.getElementById("mascara_personalizada").value = "";
    }
};

document.getElementById("menu_principal").addEventListener('click', () => {
    window.location.href = "index.html";
});

/**function calcularNumeroHosts(mascara) {
    let mascaraBits = mascara.split('.').map(octeto => {
        return parseInt(octeto).toString(2).padStart(8, '0');
    }).join('');

    let hostBits = mascaraBits.split('1').pop().length;

    return (Math.pow(2, hostBits) - 2); 
}**/

function caracteristicasIP(primer_octeto, segundo_octeto, tercer_octeto, clase, mascara, wildcard, direccion_red, direccion_broadcast,hosts) {


    if (primer_octeto >= 0 && primer_octeto <= 127) {
        clase = "Clase A";
        mascara = "255.0.0.0";
        wildcard = "0.255.255.255";
        direccion_red = primer_octeto + ".0.0.0";
        direccion_broadcast = primer_octeto + ".255.255.255";


    } else if (primer_octeto >= 128 && primer_octeto <= 191) {
        clase = "Clase B";
        mascara = "255.255.0.0";
        wildcard = "0.0.255.255";
        direccion_red = primer_octeto + "." + segundo_octeto + ".0.0";
        direccion_broadcast = primer_octeto + "." + segundo_octeto + ".255.255";


    } else if (primer_octeto >= 192 && primer_octeto <= 223) {
        clase = "Clase C";
        mascara = "255.255.255.0";
        wildcard = "0.0.0.255";
        direccion_red = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + ".0";
        direccion_broadcast = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + ".255";


    } else if (primer_octeto >= 224 && primer_octeto <= 239) {
        clase = "Clase D";
        mascara = "No tiene máscara";
        wildcard = "No tiene wildcard";
        direccion_red = "No tiene dirección de red";
        direccion_broadcast = "No tiene dirección de broadcast";
        hosts = "No tiene número de hosts";

    } else if (primer_octeto >= 240 && primer_octeto <= 255) {
        clase = "Clase E";
        mascara = "No tiene máscara";
        wildcard = "No tiene wildcard";
        direccion_red = "No tiene dirección de red";
        direccion_broadcast = "No tiene dirección de broadcast";
        hosts = "No tiene número de hosts";
    }

    document.getElementById("clase_red").innerText = clase;
    document.getElementById("mascara_subred").innerText = mascara;
    document.getElementById("Wildcard").innerText = wildcard;
    document.getElementById("direccion_red").innerText = direccion_red;
    document.getElementById("direccion_broadcast").innerText = direccion_broadcast;
    document.getElementById("numero_hosts").innerText = hosts;
}

function tipoRed(primer_octeto) {
    if (primer_octeto == 10 || primer_octeto == 192 || primer_octeto == 172) {
        document.getElementById("tipo_red").innerText = "Red privada";
    } else {
        document.getElementById("tipo_red").innerText = "Red pública";
    }
}

function mostrarResultado(ip) {
    const formulario = document.getElementById("formulario");
    const resultado = document.getElementById("resultado");
    formulario.style.display = "none";
    resultado.style.display = "block";

    const octetos = ip.split('.');
    const primer_octeto = parseInt(octetos[0]);
    const segundo_octeto = parseInt(octetos[1]);
    const tercer_octeto = parseInt(octetos[2]);
    
    caracteristicasIP(primer_octeto, segundo_octeto, tercer_octeto);
    tipoRed(primer_octeto);
    document.getElementById("ip_completa").innerText = ip;
}

document.getElementById("formulario").addEventListener('submit', function(event) {
    event.preventDefault();
    const ip = document.getElementById("IP").value;
    mostrarResultado(ip);
});