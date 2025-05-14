//Variable que almacena el valor de la IP
const ip = document.getElementById("IP");

//Funcion que valida que la IP introducida sea acorde al formato indicado
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

//Muestra en verde los números en el rango indicado y muestra en rojo los que están fuera de rango
document.getElementById("IP").addEventListener('input', () => {
    formatoIP(ip) 
});

// Convierte un número a binario de 8 bits
function toBin(ip) {
    return Number(ip).toString(2).padStart(8, '0');
}

// Calcula la wildcard a partir de la máscara
function calcularWildcard(mascara) {
    return mascara.split('.').map(o => 255 - Number(o)).join('.');
}

// Calcula la dirección de red
function calcularRed(ip, mascara) {
    const ipArr = ip.split('.').map(Number);
    const maskArr = mascara.split('.').map(Number);
    return ipArr.map((oct, i) => oct & maskArr[i]).join('.');
}

// Calcula la dirección de broadcast
function calcularBroadcast(ip, mascara) {
    const ipArr = ip.split('.').map(Number);
    const maskArr = mascara.split('.').map(Number);
    return ipArr.map((oct, i) => (oct & maskArr[i]) | (255 - maskArr[i])).join('.');
}

// Calcula el número de hosts posibles
function calcularHosts(mascara) {
    const bits = mascara.split('.').map(Number).map(o => o.toString(2).padStart(8, '0')).join('');
    const ceros = bits.split('0').length - 1;
    return ceros > 0 ? Math.pow(2, ceros) - 2 : 0;
}

// Determina la clase de red y la máscara por defecto
function obtenerClaseMascara(primer_octeto) {
    let clase = '', mascara = '';
    if (primer_octeto >= 0 && primer_octeto <= 127) {
        clase = 'A';
        mascara = '255.0.0.0';
    } else if (primer_octeto >= 128 && primer_octeto <= 191) {
        clase = 'B';
        mascara = '255.255.0.0';
    } else if (primer_octeto >= 192 && primer_octeto <= 223) {
        clase = 'C';
        mascara = '255.255.255.0';
    } else if (primer_octeto >= 224 && primer_octeto <= 239) {
        clase = 'D';
        mascara = 'No tiene';
    } else if (primer_octeto >= 240 && primer_octeto <= 255) {
        clase = 'E';
        mascara = 'No tiene';
    }
    return { clase, mascara };
}

// Determina si la IP es privada o pública
function obtenerTipoRed(ipArr) {
    const [a, b] = ipArr;
    if (a === 10) return 'Privada';
    if (a === 172 && b >= 16 && b <= 31) return 'Privada';
    if (a === 192 && b === 168) return 'Privada';
    return 'Pública';
}

// Validación de IP
function validarIP(ip) {
    const partes = ip.split('.');
    if (partes.length !== 4) return false;
    for (let parte of partes) {
        if (!/^\d+$/.test(parte)) return false;
        const num = Number(parte);
        if (num < 0 || num > 255) return false;
    }
    return true;
}

// Mostrar todos los datos en la tabla
function mostrarResultado() {
    const ip = document.getElementById("IP").value.trim();
    if (!validarIP(ip)) {
        alert("IP no válida");
        return;
    }
    const ipArr = ip.split('.').map(Number);
    const { clase, mascara } = obtenerClaseMascara(ipArr[0]);

    // Dirección IP con colores y negrita según clase
    let ipHtml = "";
    if (clase === 'A') {
        ipHtml = `<span class="clase-azul">${ipArr[0]}</span><span class="clase-naranja">.${ipArr[1]}.${ipArr[2]}.${ipArr[3]}</span>`;
    } else if (clase === 'B') {
        ipHtml = `<span class="clase-azul">${ipArr[0]}.${ipArr[1]}</span><span class="clase-naranja">.${ipArr[2]}.${ipArr[3]}</span>`;
    } else if (clase === 'C') {
        ipHtml = `<span class="clase-azul">${ipArr[0]}.${ipArr[1]}.${ipArr[2]}</span><span class="clase-naranja">.${ipArr[3]}</span>`;
    } else {
        ipHtml = ipArr.join('.');
    }
    document.getElementById("ip_completa").innerHTML = ipHtml;


    // Dirección IP en binario con colores y negrita según clase
    let ipBinHtml = "";
    const ipBinArr = ipArr.map(toBin);
    if (clase === 'A') {
        ipBinHtml = `<span class="clase-azul">${ipBinArr[0]}</span><span class="clase-naranja">.${ipBinArr[1]}.${ipBinArr[2]}.${ipBinArr[3]}</span>`;
    } else if (clase === 'B') {
        ipBinHtml = `<span class="clase-azul">${ipBinArr[0]}.${ipBinArr[1]}</span><span class="clase-naranja">.${ipBinArr[2]}.${ipBinArr[3]}</span>`;
    } else if (clase === 'C') {
        ipBinHtml = `<span class="clase-azul">${ipBinArr[0]}.${ipBinArr[1]}.${ipBinArr[2]}</span><span class="clase-naranja">.${ipBinArr[3]}</span>`;
    } else {
        ipBinHtml = ipBinArr.join('.');
    }
    if (document.getElementById("ip_binario"))
        document.getElementById("ip_binario").innerHTML = ipBinHtml;


    // Máscara de subred
    if (document.getElementById("mascara_subred"))
        document.getElementById("mascara_subred").innerText = mascara;
   

     // Máscara en binario (solo texto normal, sin colores)
    let mascaraBinHtml = "-";
    if (mascara !== 'No tiene') {
        const mascaraArr = mascara.split('.');
        const mascaraBinArr = mascaraArr.map(toBin);
        mascaraBinHtml = mascaraBinArr.join('.');
    }
    if (document.getElementById("mascara_supred_binario"))
        document.getElementById("mascara_supred_binario").innerText = mascaraBinHtml;



    // Wildcard
    let wildcard = '-';
    if (mascara !== 'No tiene') wildcard = calcularWildcard(mascara);
    if (document.getElementById("Wildcard"))
        document.getElementById("Wildcard").innerText = wildcard;
    // Wildcard en binario si existe el campo
    if (document.getElementById("Wildcard_binario") && wildcard !== '-')
        document.getElementById("Wildcard_binario").innerText = wildcard.split('.').map(toBin).join('.');
    else if (document.getElementById("Wildcard_binario"))
        document.getElementById("Wildcard_binario").innerText = '-';

    // Dirección de red
    let red = '-';
    if (mascara !== 'No tiene') red = calcularRed(ip, mascara);
    if (document.getElementById("direccion_red"))
        document.getElementById("direccion_red").innerText = red;
    // Dirección de red en binario si existe el campo
    if (document.getElementById("direccion_red_binario") && red !== '-')
        document.getElementById("direccion_red_binario").innerText = red.split('.').map(toBin).join('.');
    else if (document.getElementById("direccion_red_binario"))
        document.getElementById("direccion_red_binario").innerText = '-';

    // Dirección de broadcast
    let broadcast = '-';
    if (mascara !== 'No tiene') broadcast = calcularBroadcast(ip, mascara);
    if (document.getElementById("direccion_broadcast"))
        document.getElementById("direccion_broadcast").innerText = broadcast;
    // Dirección de broadcast en binario si existe el campo
    if (document.getElementById("direccion_broadcast_binario") && broadcast !== '-')
        document.getElementById("direccion_broadcast_binario").innerText = broadcast.split('.').map(toBin).join('.');
    else if (document.getElementById("direccion_broadcast_binario"))
        document.getElementById("direccion_broadcast_binario").innerText = '-';

    // Número de hosts
    if (document.getElementById("numero_hosts"))
        document.getElementById("numero_hosts").innerText = mascara !== 'No tiene' ? calcularHosts(mascara) : '-';

    // Clase de red (A, B, C en naranja y negrita, D y E en negro normal)
    if (document.getElementById("clase_red")) {
        if (clase === 'A' || clase === 'B' || clase === 'C') {
            document.getElementById("clase_red").innerHTML = `<span class="clase-letra-azul">${clase}</span>`;
        } else {
            document.getElementById("clase_red").innerText = clase;
        }
    }

    // Tipo de red
    if (document.getElementById("tipo_red"))
        document.getElementById("tipo_red").innerText = obtenerTipoRed(ipArr);

    formulario.style.display = "none";
    resultado.style.display = "block";
}

// Botón para alternar decimal/binario
document.getElementById("toggle_binario").addEventListener("click", function() {
    const mostrarBinario = document.getElementById("ip_binario").style.display === "none";
    // IP
    document.getElementById("ip_completa").style.display = mostrarBinario ? "none" : "";
    document.getElementById("ip_binario").style.display = mostrarBinario ? "" : "none";
    // Máscara
    document.getElementById("mascara_subred").style.display = mostrarBinario ? "none" : "";
    document.getElementById("mascara_supred_binario").style.display = mostrarBinario ? "" : "none";
    // Wildcard
    document.getElementById("Wildcard").style.display = mostrarBinario ? "none" : "";
    document.getElementById("Wildcard_binario").style.display = mostrarBinario ? "" : "none";
    // Red
    document.getElementById("direccion_red").style.display = mostrarBinario ? "none" : "";
    document.getElementById("direccion_red_binario").style.display = mostrarBinario ? "" : "none";
    // Broadcast
    document.getElementById("direccion_broadcast").style.display = mostrarBinario ? "none" : "";
    document.getElementById("direccion_broadcast_binario").style.display = mostrarBinario ? "" : "none";
    // Cambia el texto del botón
    this.innerText = mostrarBinario ? "Ver en decimal" : "Ver en binario";
});

document.getElementById("formulario").addEventListener('submit', function(event) {
    event.preventDefault();
    mostrarResultado();
});