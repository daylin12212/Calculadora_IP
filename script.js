const ip = document.getElementById("IP");

let clase = "";
let mascara = "";
let wildcard = "";
let direccion_red = "";
let direccion_broadcast = "";
let hosts = "";
let numero_subredes = "";


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

function caracteristicasIP(primer_octeto, segundo_octeto, tercer_octeto, clase, mascara, wildcard, direccion_red, direccion_broadcast, hosts) {
    let mascara_personalizada = document.getElementById("mascara_personalizada");


    let bistHosts = 32 - mascara_personalizada.value;
    let numero_subredes;

    let bits_predeterminados;

    if (primer_octeto >= 0 && primer_octeto <= 127) {
        clase = "Clase A";
        bits_predeterminados = 8; 
        mascara = "255.0.0.0";
        wildcard = "0.255.255.255";
        direccion_red = primer_octeto + ".0.0.0";
        direccion_broadcast = primer_octeto + ".255.255.255";

        let bist_prestadosA = mascara_personalizada.value - bits_predeterminados;
        numero_subredes = Math.pow(2, bist_prestadosA);
        
    } else if (primer_octeto >= 128 && primer_octeto <= 191) {
        clase = "Clase B";
        bits_predeterminados = 16; 
        mascara = "255.255.0.0";
        wildcard = "0.0.255.255";
        direccion_red = primer_octeto + "." + segundo_octeto + ".0.0";
        direccion_broadcast = primer_octeto + "." + segundo_octeto + ".255.255";
        
        let bist_prestadosB = mascara_personalizada.value - bits_predeterminados;
        numero_subredes = Math.pow(2, bist_prestadosB);
        
    } else if (primer_octeto >= 192 && primer_octeto <= 223) {
        clase = "Clase C";
        bits_predeterminados = 24; 
        mascara = "255.255.255.0";
        wildcard = "0.0.0.255";
        direccion_red = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + ".0";
        direccion_broadcast = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + ".255";
        
        let bist_prestadosC = mascara_personalizada.value - bits_predeterminados;
        numero_subredes = Math.pow(2, bist_prestadosC);
        
    } else if (primer_octeto >= 224 && primer_octeto <= 239) {
        clase = "Clase D";
        mascara = "No tiene máscara";
        wildcard = "No tiene wildcard";
        direccion_red = "No tiene dirección de red";
        direccion_broadcast = "No tiene dirección de broadcast";
        hosts = "No tiene número de hosts";
        numero_subredes = "No tiene número subredes";

    } else if (primer_octeto >= 240 && primer_octeto <= 255) {
        clase = "Clase E";
        mascara = "No tiene máscara";
        wildcard = "No tiene wildcard";
        direccion_red = "No tiene dirección de red";
        direccion_broadcast = "No tiene dirección de broadcast";
        hosts = "No tiene número de hosts";
        numero_subredes = "No tiene número subredes";
    }

    hosts = Math.pow(2, bistHosts) - 2;

    document.getElementById("clase_red").innerText = clase;
    document.getElementById("mascara_subred").innerText = mascara;
    document.getElementById("Wildcard").innerText = wildcard;
    document.getElementById("direccion_red").innerText = direccion_red;
    document.getElementById("direccion_broadcast").innerText = direccion_broadcast;
    document.getElementById("numero_hosts").innerText = hosts;
    document.getElementById("numero_subredes").innerText = numero_subredes;
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
    document.getElementById("ip_completa").style.display = "";
    document.getElementById("ip_binario").style.display = "none";
    document.getElementById("toggle_binario").innerText = "Ver en binario";

    // Mostrar IP en binario con colores según clase
    let binarios = octetos.map(o => ("00000000" + parseInt(o).toString(2)).slice(-8));
    let ipBinColoreada = "";
    if (primer_octeto >= 0 && primer_octeto <= 127) { // Clase A
        ipBinColoreada =
            `<span class="ip-red">${binarios[0]}</span>.` +
            `<span class="ip-subred">${binarios[1]}</span>.` +
            `<span class="ip-subred">${binarios[2]}</span>.` +
            `<span class="ip-host">${binarios[3]}</span>`;
    } else if (primer_octeto >= 128 && primer_octeto <= 191) { // Clase B
        ipBinColoreada =
            `<span class="ip-red">${binarios[0]}</span>.` +
            `<span class="ip-red">${binarios[1]}</span>.` +
            `<span class="ip-subred">${binarios[2]}</span>.` +
            `<span class="ip-host">${binarios[3]}</span>`;
    } else if (primer_octeto >= 192 && primer_octeto <= 223) { 
        ipBinColoreada =
            `<span class="ip-red">${binarios[0]}</span>.` +
            `<span class="ip-red">${binarios[1]}</span>.` +
            `<span class="ip-red">${binarios[2]}</span>.` +
            `<span class="ip-host">${binarios[3]}</span>`;
    } else {
        ipBinColoreada = binarios.map(b => `<span class="ip-inactivo">${b}</span>`).join('.');
    }
    document.getElementById("ip_binario").innerHTML = ipBinColoreada;

    const ipHex = octetos
        .map(octeto => {
            let hex = parseInt(octeto).toString(16).toUpperCase();
            return hex.length === 1 ? "0" + hex : hex;
        })
        .join('.');
    document.getElementById("ip_hexadecimal").innerText = ipHex;

    const mascaraBits = parseInt(document.getElementById("mascara_personalizada").value);
    if (mascaraBits >= 8 && mascaraBits <= 30) {
        const ipNum = octetos.reduce((acc, val) => (acc << 8) + parseInt(val), 0);
        const mask = (0xFFFFFFFF << (32 - mascaraBits)) >>> 0;
        const red = ipNum & mask;
        const broadcast = red | (~mask >>> 0);

        const hostMin = red + 1;

        const hostMax = broadcast - 1;

        function numToIp(num) {
            return [
                (num >>> 24) & 0xFF,
                (num >>> 16) & 0xFF,
                (num >>> 8) & 0xFF,
                num & 0xFF
            ].join('.');
        }

        document.getElementById("host_minimo").innerText = numToIp(hostMin);
        document.getElementById("host_maximo").innerText = numToIp(hostMax);
    } else {
        document.getElementById("host_minimo").innerText = "N/A";
        document.getElementById("host_maximo").innerText = "N/A";
    }
}

document.getElementById("formulario").addEventListener('submit', function(event) {
    event.preventDefault();
    const ip = document.getElementById("IP").value;
    mostrarResultado(ip);
});