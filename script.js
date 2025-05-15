const ip = document.getElementById("IP");
let mascara_personalizada = document.getElementById("mascara_personalizada");

let clase = "";
let mascara = "";
let wildcard = "";
let direccion_red = "";
let direccion_broadcast = "";
let hosts = "";
let n = "";


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

function caracteristicasIP(primer_octeto, segundo_octeto, tercer_octeto, clase, mascara, wildcard, direccion_red, direccion_broadcast,hosts) {
let mascara_personalizada = document.getElementById("mascara_personalizada");

    let bistHosts = 32 - mascara_personalizada.value;

    if (primer_octeto >= 0 && primer_octeto <= 127) {
        clase = "Clase A";
        mascara = "255.0.0.0";
        wildcard = "0.255.255.255";
        direccion_red = primer_octeto + ".0.0.0";
        direccion_broadcast = primer_octeto + ".255.255.255";
        hosts = Math.pow(2, bistHosts) - 2;


    } else if (primer_octeto >= 128 && primer_octeto <= 191) {
        clase = "Clase B";
        mascara = "255.255.0.0";
        wildcard = "0.0.255.255";
        direccion_red = primer_octeto + "." + segundo_octeto + ".0.0";
        direccion_broadcast = primer_octeto + "." + segundo_octeto + ".255.255";
        hosts = Math.pow(2, bistHosts) - 2;


    } else if (primer_octeto >= 192 && primer_octeto <= 223) {
        clase = "Clase C";
        mascara = "255.255.255.0";
        wildcard = "0.0.0.255";
        direccion_red = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + ".0";
        direccion_broadcast = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + ".255";
        hosts = Math.pow(2,bistHosts) - 2;


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

// Alternar entre decimal y binario
document.getElementById("toggle_binario").addEventListener('click', function() {
    const ipCompleta = document.getElementById("ip_completa");
    const ipBinario = document.getElementById("ip_binario");
    const mascaraDec = document.getElementById("mascara_subred");
    const mascaraBin = document.getElementById("mascara_supred_binario");
    const wildcardDec = document.getElementById("Wildcard");
    const wildcardBin = document.getElementById("Wildcard_binario");
    const redDec = document.getElementById("direccion_red");
    const redBin = document.getElementById("direccion_red_binario");
    const broadDec = document.getElementById("direccion_broadcast");
    const broadBin = document.getElementById("direccion_broadcast_binario");

    // Selecciona los th por id
    const thRed = document.getElementById('th_red');
    const thSubred = document.getElementById('th_subred');
    const thHost = document.getElementById('th_host');

    if (ipCompleta.style.display !== "none") {
        ipCompleta.style.display = "none";
        ipBinario.style.display = "";
        mascaraDec.style.display = "none";
        mascaraBin.style.display = "";
        wildcardDec.style.display = "none";
        wildcardBin.style.display = "";
        redDec.style.display = "none";
        redBin.style.display = "";
        broadDec.style.display = "none";
        broadBin.style.display = "";
        this.innerText = "Ver en decimal";
        if (thRed) thRed.classList.add('th-red');
        if (thSubred) thSubred.classList.add('th-subred');
        if (thHost) thHost.classList.add('th-host');
    } else {
        ipCompleta.style.display = "";
        ipBinario.style.display = "none";
        mascaraDec.style.display = "";
        mascaraBin.style.display = "none";
        wildcardDec.style.display = "";
        wildcardBin.style.display = "none";
        redDec.style.display = "";
        redBin.style.display = "none";
        broadDec.style.display = "";
        broadBin.style.display = "none";
        this.innerText = "Ver en binario";
        if (thRed) thRed.classList.remove('th-red');
        if (thSubred) thSubred.classList.remove('th-subred');
        if (thHost) thHost.classList.remove('th-host');
    }
});

function toBin(ip) {
    return ip.split('.')
        .map(o => ("00000000" + parseInt(o, 10).toString(2)).slice(-8))
        .join('.');
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
    const cuarto_octeto = parseInt(octetos[3]);

    caracteristicasIP(primer_octeto, segundo_octeto, tercer_octeto);
    tipoRed(primer_octeto);

    // Mostrar IP normal (sin colores)
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
    } else if (primer_octeto >= 192 && primer_octeto <= 223) { // Clase C
        ipBinColoreada =
            `<span class="ip-red">${binarios[0]}</span>.` +
            `<span class="ip-red">${binarios[1]}</span>.` +
            `<span class="ip-red">${binarios[2]}</span>.` +
            `<span class="ip-host">${binarios[3]}</span>`;
    } else {
        // Clase D o E: todo inactivo
        ipBinColoreada = binarios.map(b => `<span class="ip-inactivo">${b}</span>`).join('.');
    }
    document.getElementById("ip_binario").innerHTML = ipBinColoreada;

    // Mostrar IP en hexadecimal
    const ipHex = octetos
        .map(octeto => {
            let hex = parseInt(octeto).toString(16).toUpperCase();
            return hex.length === 1 ? "0" + hex : hex;
        })
        .join('.');
    document.getElementById("ip_hexadecimal").innerText = ipHex;

    // Máscara, wildcard, red y broadcast en binario
    const mascara = document.getElementById("mascara_subred").innerText;
    const wildcard = document.getElementById("Wildcard").innerText;
    const red = document.getElementById("direccion_red").innerText;
    const broadcast = document.getElementById("direccion_broadcast").innerText;

    document.getElementById("mascara_supred_binario").innerText = mascara.match(/^\d+\.\d+\.\d+\.\d+$/) ? toBin(mascara) : "";
    document.getElementById("Wildcard_binario").innerText = wildcard.match(/^\d+\.\d+\.\d+\.\d+$/) ? toBin(wildcard) : "";
    document.getElementById("direccion_red_binario").innerText = red.match(/^\d+\.\d+\.\d+\.\d+$/) ? toBin(red) : "";
    document.getElementById("direccion_broadcast_binario").innerText = broadcast.match(/^\d+\.\d+\.\d+\.\d+$/) ? toBin(broadcast) : "";


    // Calcular host mínimo y máximo
    const mascaraBits = parseInt(document.getElementById("mascara_personalizada").value);
    if (mascaraBits >= 8 && mascaraBits <= 30) {
        const ipNum = octetos.reduce((acc, val) => (acc << 8) + parseInt(val), 0);
        const mask = (0xFFFFFFFF << (32 - mascaraBits)) >>> 0;
        const red = ipNum & mask;
        const broadcast = red | (~mask >>> 0);

        // Host mínimo: dirección de red + 1
        const hostMin = red + 1;
        // Host máximo: dirección de broadcast - 1
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