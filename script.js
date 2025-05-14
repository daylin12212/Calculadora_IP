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
    if (IP.value <= 255 && IP.value >= 0) {
        IP.style.color = "green"; 
    } else {
        IP.style.color = "red"; 
    }
    formatoIP(ip) 
});

// Convierte un número a binario de 8 bits
function toBin(octeto) {
    return Number(octeto).toString(2).padStart(8, '0');
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

    // Dirección IP
    document.getElementById("ip_completa").innerText = ip;

    // Máscara de subred
    if (document.getElementById("mascara_subred"))
        document.getElementById("mascara_subred").innerText = mascara;

    // Wildcard
    if (document.getElementById("Wildcard"))
        document.getElementById("Wildcard").innerText = mascara !== 'No tiene' ? calcularWildcard(mascara) : '-';

    // Dirección de red
    if (document.getElementById("direccion_red"))
        document.getElementById("direccion_red").innerText = mascara !== 'No tiene' ? calcularRed(ip, mascara) : '-';

    // Dirección de broadcast
    if (document.getElementById("direccion_broadcast"))
        document.getElementById("direccion_broadcast").innerText = mascara !== 'No tiene' ? calcularBroadcast(ip, mascara) : '-';

    // Número de hosts
    if (document.getElementById("numero_hosts"))
        document.getElementById("numero_hosts").innerText = mascara !== 'No tiene' ? calcularHosts(mascara) : '-';

    // Clase de red
    if (document.getElementById("clase_red"))
        document.getElementById("clase_red").innerText = clase;

    // Tipo de red
    if (document.getElementById("tipo_red"))
        document.getElementById("tipo_red").innerText = obtenerTipoRed(ipArr);

    formulario.style.display = "none";
    resultado.style.display = "block";
}

document.getElementById("formulario").addEventListener('submit', function(event) {
    event.preventDefault();
    mostrarResultado();
});