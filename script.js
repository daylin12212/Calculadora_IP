const ip = document.getElementById("IP");

const mascara_personalizada = document.getElementById("mascara_personalizada");

let clase = "";
let mascara = "";
let wildcard = "";
let direccion_red = "";
let direccion_broadcast = "";
let hosts = "";
let numero_subredes = "";


function convertirMascaraVLSM(mascaraIP) {
    const octetos = mascaraIP.split('.');
    const binario = octetos.map(octeto => {
        return parseInt(octeto).toString(2).padStart(8, '0');
    }).join('');
    const numeroBits = binario.split('1').length - 1;
    return numeroBits; // Devuelve el número de bits
}

// Función para validar la máscara VLSM según la máscara CIDR
function validarMascaraVLSM() {
    const mascaraCIDR = parseInt(document.getElementById("mascara_personalizada").value); // Máscara CIDR del input
    const mascaraVLSM = document.getElementById("mascara_vlsm").value; // Máscara VLSM del input

    // Si no se ha ingresado una máscara VLSM válida, detenemos la validación
    if (!mascaraVLSM) {
        alert("Por favor ingrese una máscara VLSM.");
        return false;
    }

    // Convertir la máscara VLSM a formato binario y calcular el número de bits
    const numeroBitsVLSM = convertirMascaraVLSM(mascaraVLSM);

    // Validar que la máscara VLSM no sea mayor que la máscara CIDR
    if (numeroBitsVLSM > mascaraCIDR) {
        alert(`La máscara VLSM no puede ser mayor que la máscara CIDR (${mascaraCIDR} bits).`);
        return false;
    }

    return true; // La máscara VLSM es válida
}


function formatoIP() {
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


function caracteristicasIP(primer_octeto, segundo_octeto, tercer_octeto) {

    let bistHosts = 32 - mascara_personalizada.value;
    let bits_predeterminados;
    let bits_prestados;


    // Función para calcular la máscara
    function calcularMascara(bits) {
        let mascaraBinaria = '1'.repeat(bits) + '0'.repeat(32 - bits);
        let mascaraFinal = '';
        for (let i = 0; i < 4; i++) {
            mascaraFinal += parseInt(mascaraBinaria.substr(i * 8, 8), 2);
            if (i < 3) mascaraFinal += '.';
        }
        return mascaraFinal;
    }

    // Función para calcular la wildcard
    function calcularWildcard(bits) {
        let wildcardBinaria = '0'.repeat(bits) + '1'.repeat(32 - bits);
        let wildcardFinal = '';
        for (let i = 0; i < 4; i++) {
            wildcardFinal += parseInt(wildcardBinaria.substr(i * 8, 8), 2);
            if (i < 3) wildcardFinal += '.';
        }
        return wildcardFinal;
    }

    // Función para calcular la dirección de broadcast
    function calcularDireccionBroadcast(direccionRed, wildcard) {
        let direccionRedOctetos = direccionRed.split('.').map(Number);
        let wildcardOctetos = wildcard.split('.').map(Number);

        let direccionBroadcastOctetos = direccionRedOctetos.map((octeto, index) => octeto | wildcardOctetos[index]);

        return direccionBroadcastOctetos.join('.');
    }

    // Condicionales para clases A, B y C
    if (primer_octeto >= 0 && primer_octeto <= 127) {
        clase = "Clase A";
        bits_predeterminados = 8;
        mascara = calcularMascara(mascara_personalizada.value);
        wildcard = calcularWildcard(mascara_personalizada.value);
        direccion_red = primer_octeto + ".0.0.0";
        direccion_broadcast = calcularDireccionBroadcast(direccion_red, wildcard); 

        if (mascara_personalizada.value >= bits_predeterminados) {
            bits_prestados = mascara_personalizada.value - bits_predeterminados;
            numero_subredes = Math.pow(2, bits_prestados);
        } else {
            numero_subredes = "ERROR";
        }

    } else if (primer_octeto >= 128 && primer_octeto <= 191) {
        clase = "Clase B";
        bits_predeterminados = 16;
        mascara = calcularMascara(mascara_personalizada.value);
        wildcard = calcularWildcard(mascara_personalizada.value);
        direccion_red = primer_octeto + "." + segundo_octeto + ".0.0";
        direccion_broadcast = calcularDireccionBroadcast(direccion_red, wildcard); // Cálculo dinámico de la dirección de broadcast

        if (mascara_personalizada.value >= bits_predeterminados) {
            bits_prestados = mascara_personalizada.value - bits_predeterminados;
            numero_subredes = Math.pow(2, bits_prestados);
        } else {
            numero_subredes = "ERROR";
        }

    } else if (primer_octeto >= 192 && primer_octeto <= 223) {
        clase = "Clase C";
        bits_predeterminados = 24;
        mascara = calcularMascara(mascara_personalizada.value);
        wildcard = calcularWildcard(mascara_personalizada.value);
        direccion_red = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + ".0";
        direccion_broadcast = calcularDireccionBroadcast(direccion_red, wildcard); // Cálculo dinámico de la dirección de broadcast

        if (mascara_personalizada.value >= bits_predeterminados) {
            bits_prestados = mascara_personalizada.value - bits_predeterminados;
            numero_subredes = Math.pow(2, bits_prestados);
        } else {
            numero_subredes = "ERROR";
        }

    } else if (primer_octeto >= 224 && primer_octeto <= 239) {
        clase = "Clase D";
        mascara = "No tiene máscara";
        wildcard = "No tiene wildcard";
        direccion_red = "No tiene dirección de red";
        direccion_broadcast = "No tiene dirección de broadcast";
        numero_subredes = "No tiene número de subredes";

    } else if (primer_octeto >= 240 && primer_octeto <= 255) {
        clase = "Clase E";
        mascara = "No tiene máscara";
        wildcard = "No tiene wildcard";
        direccion_red = "No tiene dirección de red";
        direccion_broadcast = "No tiene dirección de broadcast";
        numero_subredes = "No tiene número de subredes";
    }

    let hosts = Math.pow(2, bistHosts) - 2;

    // Asignación de resultados en el HTML
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

function mostrarIPHexadecimal(octetos) {
    const ipHex = octetos
        .map(octeto => {
            let hex = parseInt(octeto).toString(16).toUpperCase();
            return hex.length === 1 ? "0" + hex : hex;
        })
        .join('.');
    document.getElementById("ip_hexadecimal").innerText = ipHex;
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

    mostrarIPHexadecimal(octetos);

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

        // Llamar a la función para mostrar subredes
        mostrarSubredes(ip, mascaraBits);
    } else {
        document.getElementById("host_minimo").innerText = "N/A";
        document.getElementById("host_maximo").innerText = "N/A";
    }
}

document.getElementById("formulario").addEventListener('submit', function(event) {
    event.preventDefault();

    if (!validarMascaraVLSM()) {
        return; // Si la validación falla, no se procede con el cálculo
    }
    const ip = document.getElementById("IP").value;
    mostrarResultado(ip);
});

// Obtener la IP pública y asignarla al placeholder del input con id "IP"
async function asignarIPPlaceholder() {
    try {
        // Llamada a la API para obtener la IP pública
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();

        // Asignar la IP pública al placeholder del input
        document.getElementById("IP").placeholder = `IP Actual: ${data.ip}`;
    } catch (error) {
        console.error("Error al obtener la IP pública:", error);
    }
}

asignarIPPlaceholder();

// Modificar la función mostrarSubredes para no mostrar nada si no hay subredes
function mostrarSubredes(ip, mascaraBits) {
    const listaSubredes = document.getElementById('lista-subredes');
    const infoSubred = document.getElementById('info-subred');
    const mensajeSeleccion = document.querySelector('.mensaje-seleccion');
    const contenedorSubredes = document.getElementById('contenedor-tablas-subredes');

    // Limpiar contenedores
    listaSubredes.innerHTML = '';
    infoSubred.style.display = 'none';
    mensajeSeleccion.style.display = 'block';

    // Obtener el número de subredes
    const numeroSubredes = document.getElementById("numero_subredes").innerText;

    // Si no hay subredes, ocultar el contenedor y salir
    if (numeroSubredes === "No tiene número de subredes" || numeroSubredes === "0") {
        contenedorSubredes.style.display = 'none';
        return;
    }

    // Obtener la dirección IP en formato numérico
    const octetos = ip.split('.').map(Number);
    const ipNum = (octetos[0] << 24) | (octetos[1] << 16) | (octetos[2] << 8) | octetos[3];

    // Determinar los bits de red según la clase de IP
    let bitsRed;
    if (octetos[0] >= 0 && octetos[0] <= 127) bitsRed = 8;      // Clase A
    else if (octetos[0] >= 128 && octetos[0] <= 191) bitsRed = 16; // Clase B
    else if (octetos[0] >= 192 && octetos[0] <= 223) bitsRed = 24; // Clase C
    else bitsRed = 0; // Clase D o E (no soportan subredes)

    // Calcular el número de subredes
    let numSubredes = 0;
    if (mascaraBits > bitsRed) {
        numSubredes = Math.pow(2, mascaraBits - bitsRed);
    } else {
        numSubredes = 0; // No hay subredes
    }

    // Si no hay subredes, ocultar el contenedor y salir
    if (numSubredes === 0) {
        contenedorSubredes.style.display = 'none';
        return;
    }

    // Limitar a 8 subredes como máximo para la visualización
    const subredesMostrar = Math.min(numSubredes, 8);

    // Calcular el tamaño de cada subred
    const tamanoSubred = Math.pow(2, 32 - mascaraBits);

    // Calcular la dirección de red base
    const mascara = (0xFFFFFFFF << (32 - mascaraBits)) >>> 0;
    const redBase = ipNum & mascara;

    // Generar las subredes
    for (let i = 0; i < subredesMostrar; i++) {
        // Calcular dirección de red de esta subred
        const dirRed = redBase + (i * tamanoSubred);

        // Calcular dirección de broadcast de esta subred
        const dirBroadcast = dirRed + tamanoSubred - 1;

        // Calcular host mínimo y máximo
        const hostMin = dirRed + 1;
        const hostMax = dirBroadcast - 1;

        // Calcular número de hosts
        const numHosts = Math.max(0, tamanoSubred - 2);

        // Calcular wildcard para esta máscara
        const wildcard = ~mascara >>> 0;

        // Convertir a formato IP
        const redIP = numToIp(dirRed);
        const broadcastIP = numToIp(dirBroadcast);
        const hostMinIP = numToIp(hostMin);
        const hostMaxIP = numToIp(hostMax);
        const mascaraIP = numToIp(mascara);
        const wildcardIP = numToIp(wildcard);

        // Crear elemento para la subred
        const subredItem = document.createElement('div');
        subredItem.className = 'subred-item';
        subredItem.innerHTML = `
            <h4>Subred ${i + 1}</h4>
            <p>Red: ${redIP}/${mascaraBits}</p>
            <p>Hosts: ${numHosts}</p>
        `;

        // Almacenar todos los datos de la subred
        subredItem.dataset.direccionRed = redIP;
        subredItem.dataset.mascara = mascaraIP;
        subredItem.dataset.mascaraBits = mascaraBits;
        subredItem.dataset.wildcard = wildcardIP;
        subredItem.dataset.broadcast = broadcastIP;
        subredItem.dataset.hostMin = hostMinIP;
        subredItem.dataset.hostMax = hostMaxIP;
        subredItem.dataset.numHosts = numHosts;

        // Agregar evento de clic
        subredItem.addEventListener('click', function() {
            // Remover clase activa de otros elementos
            document.querySelectorAll('.subred-item').forEach(item => {
                item.classList.remove('activa');
            });

            // Agregar clase activa al elemento seleccionado
            this.classList.add('activa');

            // Mostrar detalles de la subred
            mostrarDetallesSubred(this.dataset);
        });

        listaSubredes.appendChild(subredItem);
    }

    // Si hay al menos una subred, seleccionar la primera por defecto
    if (subredesMostrar > 0) {
        const primeraSubred = listaSubredes.firstElementChild;
        if (primeraSubred) {
            primeraSubred.click();
        }
    }

    // Si hay más subredes de las que se muestran, agregar un mensaje
    if (numSubredes > 8) {
        const mensajeExtra = document.createElement('div');
        mensajeExtra.className = 'mensaje-extra';
        mensajeExtra.innerHTML = `<p>Mostrando 8 de ${numSubredes} subredes totales</p>`;
        listaSubredes.appendChild(mensajeExtra);
    }

    // Mostrar el contenedor de subredes
    contenedorSubredes.style.display = 'block';
}

// Función para mostrar los detalles de una subred
function mostrarDetallesSubred(datos) {
    const infoSubred = document.getElementById('info-subred');
    const mensajeSeleccion = document.querySelector('.mensaje-seleccion');

    // Ocultar mensaje y mostrar detalles
    mensajeSeleccion.style.display = 'none';
    infoSubred.style.display = 'block';

    // Actualizar la interfaz con todos los datos de la subred
    document.getElementById('detalle-red').textContent = `${datos.direccionRed}/${datos.mascaraBits}`;
    document.getElementById('detalle-mascara').textContent = `${datos.mascara} (/${datos.mascaraBits})`;
    document.getElementById('detalle-wildcard').textContent = datos.wildcard;
    document.getElementById('detalle-broadcast').textContent = datos.broadcast;
    document.getElementById('detalle-host-min').textContent = datos.hostMin;
    document.getElementById('detalle-host-max').textContent = datos.hostMax;
    document.getElementById('detalle-num-hosts').textContent = datos.numHosts;
}

// Función auxiliar para convertir número a IP
function numToIp(num) {
    return [
        (num >>> 24) & 0xFF,
        (num >>> 16) & 0xFF,
        (num >>> 8) & 0xFF,
        num & 0xFF
    ].join('.');
}

// Función para alternar entre binario y decimal
function alternarBinarioDecimal() {
    const ipBin = document.getElementById("ip_binario");
    const ipDec = document.getElementById("ip_completa");
    const wildcardBin = document.getElementById("Wildcard_binario");
    const wildcardDec = document.getElementById("Wildcard");
    const mascaraBin = document.getElementById("mascara_supred_binario");
    const mascaraDec = document.getElementById("mascara_subred");
    const redBin = document.getElementById("direccion_red_binario");
    const redDec = document.getElementById("direccion_red");
    const broadBin = document.getElementById("direccion_broadcast_binario");
    const broadDec = document.getElementById("direccion_broadcast");

    // Generar valores en binario si no están generados
    function toBin(ip) {
        return ip.split('.').map(o => ("00000000" + parseInt(o).toString(2)).slice(-8)).join('.');
    }

    if (!ipBin.innerHTML) ipBin.innerHTML = toBin(ipDec.innerText);
    if (!wildcardBin.innerHTML) wildcardBin.innerHTML = toBin(wildcardDec.innerText);
    if (!mascaraBin.innerHTML) mascaraBin.innerHTML = toBin(mascaraDec.innerText);
    if (!redBin.innerHTML) redBin.innerHTML = toBin(redDec.innerText);
    if (!broadBin.innerHTML) broadBin.innerHTML = toBin(broadDec.innerText);

    // Alternar entre binario y decimal
    const mostrarBinario = ipBin.style.display === "none";
    ipBin.style.display = mostrarBinario ? "block" : "none";
    ipDec.style.display = mostrarBinario ? "none" : "block";
    wildcardBin.style.display = mostrarBinario ? "block" : "none";
    wildcardDec.style.display = mostrarBinario ? "none" : "block";
    mascaraBin.style.display = mostrarBinario ? "block" : "none";
    mascaraDec.style.display = mostrarBinario ? "none" : "block";
    redBin.style.display = mostrarBinario ? "block" : "none";
    redDec.style.display = mostrarBinario ? "none" : "block";
    broadBin.style.display = mostrarBinario ? "block" : "none";
    broadDec.style.display = mostrarBinario ? "none" : "block";

    // Cambiar el texto del botón
    document.getElementById("toggle_binario").innerText = mostrarBinario ? "Ver en decimal" : "Ver en binario";
}

// Asignar el evento al botón
if (document.getElementById("toggle_binario")) {
    document.getElementById("toggle_binario").addEventListener("click", alternarBinarioDecimal);
}

// Modificar el evento del botón para mostrar/ocultar subredes
const toggleSubredesBtn = document.getElementById("toggle_subredes");
const contenedorSubredes = document.getElementById("contenedor-tablas-subredes");

toggleSubredesBtn.addEventListener("click", function () {
    const isHidden = contenedorSubredes.style.display === "none" || contenedorSubredes.style.display === "";
    contenedorSubredes.style.display = isHidden ? "block" : "none";
    toggleSubredesBtn.innerText = isHidden ? "Ocultar subredes" : "Mostrar subredes";
});

// Asegurarse de que el contenedor de subredes esté oculto inicialmente
contenedorSubredes.style.display = "none";