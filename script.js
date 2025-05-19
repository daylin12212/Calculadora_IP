// Cogemos los elementos principales del DOM que vamos a necesitar
const ip = document.getElementById("IP");
const mascara_personalizada = document.getElementById("mascara_personalizada");

// Variables globales que usaremos para guardar los resultados
let clase = "";
let mascara = "";
let wildcard = "";
let direccion_red = "";
let direccion_broadcast = "";
let hosts = "";
let numero_subredes = "";


// Esta funcion convierte una mascara en formato decimal (como 255.255.255.0) a su equivalente CIDR (como /24)
function convertirMascaraVLSM(mascaraIP) {
    // primero separamos en octetos
    const octetos = mascaraIP.split('.');
    // convertimos cada octeto a binario y los unimos
    const binario = octetos.map(octeto => {
        return parseInt(octeto).toString(2).padStart(8, '0');
    }).join('');
    // contamos cuantos "1" hay, que es lo que nos da el valor CIDR
    const numeroBits = binario.split('1').length - 1;
    return numeroBits; // devolvemos el numero de bits
}

// Esta funcion comprueba que la mascara VLSM ingresada sea valida comparada con la mascara CIDR
function validarMascaraVLSM() {
    const mascaraCIDR = parseInt(document.getElementById("mascara_personalizada").value); // lo que puso el usuario
    const mascaraVLSM = document.getElementById("mascara_vlsm").value; // esto tambien lo puso el usuario

    // si no metio nada, le avisamos
    if (!mascaraVLSM) {
        alert("Por favor ingrese una máscara VLSM.");
        return false;
    }

    // calculamos cuantos bits tiene la mascara VLSM
    const numeroBitsVLSM = convertirMascaraVLSM(mascaraVLSM);

    // si la mascara VLSM es mas grande que la CIDR, es un error
    if (numeroBitsVLSM > mascaraCIDR) {
        alert(`La máscara VLSM no puede ser mayor que la máscara CIDR (${mascaraCIDR} bits).`);
        return false;
    }

    return true; // todo ok!
}


// Esta funcion cambia el color del input IP segun si cumple el patron o no
function formatoIP() {
    const pattern = ip.pattern;
    const patron = new RegExp(pattern);  
    const isValid = patron.test(ip.value);

    // verde si esta bien, rojo si esta mal - asi sabemos visualmente si la IP es valida
    if (isValid) {
        ip.style.color = "green";
    } else {
        ip.style.color = "red";
    }
}

// Cada vez que el usuario escribe en el input IP, verificamos el formato y actualizamos la mascara
document.getElementById("IP").addEventListener('input', () => {
    formatoIP(ip);
    personalizarMascara(ip)
});


// Esta funcion ajusta la mascara automaticamente segun la clase de IP que detecte
function personalizarMascara(ip) {
    const octetos = ip.value.split('.');
    const primer_octeto = parseInt(octetos[0]);
    // asignamos la mascara segun la clase de IP
    if (primer_octeto >= 0 && primer_octeto <= 127) {
        document.getElementById("mascara_personalizada").value = 8;  // clase A
    }
    else if (primer_octeto >= 128 && primer_octeto <= 191) {
        document.getElementById("mascara_personalizada").value = 16; // clase B
    } else if (primer_octeto >= 192 && primer_octeto <= 223) {
        document.getElementById("mascara_personalizada").value = 24; // clase C
    } else {
        document.getElementById("mascara_personalizada").value = ""; // otras clases no tienen mascara por defecto
    }
};


// Boton para volver al menu principal
document.getElementById("menu_principal").addEventListener('click', () => {
    window.location.href = "index.html";
});


// Esta es la funcion principal que calcula todas las caracteristicas de una IP
function caracteristicasIP(primer_octeto, segundo_octeto, tercer_octeto) {

    // calculamos hosts disponibles con la formula 2^(32-mascara) - 2
    let bistHosts = 32 - mascara_personalizada.value;
    let bits_predeterminados;
    let bits_prestados;


    // Esta funcion calcula la mascara en formato decimal a partir de los bits
    function calcularMascara(bits) {
        // creamos la representacion binaria de la mascara (1s seguidos de 0s)
        let mascaraBinaria = '1'.repeat(bits) + '0'.repeat(32 - bits);
        let mascaraFinal = '';
        // convertimos cada grupo de 8 bits a decimal
        for (let i = 0; i < 4; i++) {
            mascaraFinal += parseInt(mascaraBinaria.substr(i * 8, 8), 2);
            if (i < 3) mascaraFinal += '.';
        }
        return mascaraFinal;
    }

    // La wildcard es basicamente lo contrario de la mascara (donde hay 1s ponemos 0s y viceversa)
    function calcularWildcard(bits) {
        let wildcardBinaria = '0'.repeat(bits) + '1'.repeat(32 - bits);
        let wildcardFinal = '';
        for (let i = 0; i < 4; i++) {
            wildcardFinal += parseInt(wildcardBinaria.substr(i * 8, 8), 2);
            if (i < 3) wildcardFinal += '.';
        }
        return wildcardFinal;
    }

    // Para calcular la direccion broadcast hacemos un OR entre la direccion de red y la wildcard
    function calcularDireccionBroadcast(direccionRed, wildcard) {
        let direccionRedOctetos = direccionRed.split('.').map(Number);
        let wildcardOctetos = wildcard.split('.').map(Number);

        // aplicamos el OR bit a bit para cada octeto
        let direccionBroadcastOctetos = direccionRedOctetos.map((octeto, index) => octeto | wildcardOctetos[index]);

        return direccionBroadcastOctetos.join('.');
    }

    // Aqui procesamos la info segun la clase de IP
    if (primer_octeto >= 0 && primer_octeto <= 127) {
        // Clase A: primer octeto es la red, los otros 3 son para hosts
        clase = "Clase A";
        bits_predeterminados = 8;
        mascara = calcularMascara(mascara_personalizada.value);
        wildcard = calcularWildcard(mascara_personalizada.value);
        direccion_red = primer_octeto + ".0.0.0";
        direccion_broadcast = calcularDireccionBroadcast(direccion_red, wildcard); 

        // calcular subredes: 2^(bits_prestados)
        if (mascara_personalizada.value >= bits_predeterminados) {
            bits_prestados = mascara_personalizada.value - bits_predeterminados;
            numero_subredes = Math.pow(2, bits_prestados);
        } else {
            numero_subredes = "ERROR";
        }

    } else if (primer_octeto >= 128 && primer_octeto <= 191) {
        // Clase B: primeros 2 octetos son la red, los otros 2 para hosts
        clase = "Clase B";
        bits_predeterminados = 16;
        mascara = calcularMascara(mascara_personalizada.value);
        wildcard = calcularWildcard(mascara_personalizada.value);
        direccion_red = primer_octeto + "." + segundo_octeto + ".0.0";
        direccion_broadcast = calcularDireccionBroadcast(direccion_red, wildcard);

        if (mascara_personalizada.value >= bits_predeterminados) {
            bits_prestados = mascara_personalizada.value - bits_predeterminados;
            numero_subredes = Math.pow(2, bits_prestados);
        } else {
            numero_subredes = "ERROR";
        }

    } else if (primer_octeto >= 192 && primer_octeto <= 223) {
        // Clase C: primeros 3 octetos son la red, ultimo para hosts
        clase = "Clase C";
        bits_predeterminados = 24;
        mascara = calcularMascara(mascara_personalizada.value);
        wildcard = calcularWildcard(mascara_personalizada.value);
        direccion_red = primer_octeto + "." + segundo_octeto + "." + tercer_octeto + ".0";
        direccion_broadcast = calcularDireccionBroadcast(direccion_red, wildcard);

        if (mascara_personalizada.value >= bits_predeterminados) {
            bits_prestados = mascara_personalizada.value - bits_predeterminados;
            numero_subredes = Math.pow(2, bits_prestados);
        } else {
            numero_subredes = "ERROR";
        }

    } else if (primer_octeto >= 224 && primer_octeto <= 239) {
        // Clase D: para multicast, no tiene las mismas propiedades que las otras
        clase = "Clase D";
        mascara = "No tiene máscara";
        wildcard = "No tiene wildcard";
        direccion_red = "No tiene dirección de red";
        direccion_broadcast = "No tiene dirección de broadcast";
        numero_subredes = "No tiene número de subredes";

    } else if (primer_octeto >= 240 && primer_octeto <= 255) {
        // Clase E: reservada para experimentacion
        clase = "Clase E";
        mascara = "No tiene máscara";
        wildcard = "No tiene wildcard";
        direccion_red = "No tiene dirección de red";
        direccion_broadcast = "No tiene dirección de broadcast";
        numero_subredes = "No tiene número de subredes";
    }

    // Numero de hosts = 2^(bits para host) - 2 (se restan 2 por la dir de red y broadcast)
    let hosts = Math.pow(2, bistHosts) - 2;

    // Mostramos los resultados en el HTML
    document.getElementById("clase_red").innerText = clase;
    document.getElementById("mascara_subred").innerText = mascara;
    document.getElementById("Wildcard").innerText = wildcard;
    document.getElementById("direccion_red").innerText = direccion_red;
    document.getElementById("direccion_broadcast").innerText = direccion_broadcast;
    document.getElementById("numero_hosts").innerText = hosts;
    document.getElementById("numero_subredes").innerText = numero_subredes;
}
 

// Esta funcion determina si la IP es de una red privada o publica
function tipoRed(primer_octeto) {
    // IPs privadas comienzan con 10, 192.168 o 172.16-31
    if (primer_octeto == 10 || primer_octeto == 192 || primer_octeto == 172) {
        document.getElementById("tipo_red").innerText = "Red privada";
    } else {
        document.getElementById("tipo_red").innerText = "Red pública";
    }
}

// Esta funcion muestra la IP en formato hexadecimal
function mostrarIPHexadecimal(octetos) {
    const ipHex = octetos
        .map(octeto => {
            // convertimos a hexadecimal y agregamos ceros si hace falta
            let hex = parseInt(octeto).toString(16).toUpperCase();
            return hex.length === 1 ? "0" + hex : hex;
        })
        .join('.');
    document.getElementById("ip_hexadecimal").innerText = ipHex;
}


// Funcion principal que muestra todos los resultados
function mostrarResultado(ip) {
    // cambiamos la vista del formulario al resultado
    const formulario = document.getElementById("formulario");
    const resultado = document.getElementById("resultado");
    formulario.style.display = "none";
    resultado.style.display = "block";

    // separamos la IP en sus octetos
    const octetos = ip.split('.');
    const primer_octeto = parseInt(octetos[0]);
    const segundo_octeto = parseInt(octetos[1]);
    const tercer_octeto = parseInt(octetos[2]);

    // calculamos todo
    caracteristicasIP(primer_octeto, segundo_octeto, tercer_octeto);
    tipoRed(primer_octeto);

    // mostramos la IP en formato decimal primero
    document.getElementById("ip_completa").innerText = ip;
    document.getElementById("ip_completa").style.display = "";
    document.getElementById("ip_binario").style.display = "none";
    document.getElementById("toggle_binario").innerText = "Ver en binario";

    // preparamos la version binaria con colores segun la clase
    let binarios = octetos.map(o => ("00000000" + parseInt(o).toString(2)).slice(-8));
    let ipBinColoreada = "";
    if (primer_octeto >= 0 && primer_octeto <= 127) { // Clase A
        ipBinColoreada =
            `<span class="ip-red">${binarios[0]}</span>.` + // primer octeto = red
            `<span class="ip-subred">${binarios[1]}</span>.` + // resto = host/subred
            `<span class="ip-subred">${binarios[2]}</span>.` +
            `<span class="ip-host">${binarios[3]}</span>`;
    } else if (primer_octeto >= 128 && primer_octeto <= 191) { // Clase B
        ipBinColoreada =
            `<span class="ip-red">${binarios[0]}</span>.` + // dos primeros = red
            `<span class="ip-red">${binarios[1]}</span>.` +
            `<span class="ip-subred">${binarios[2]}</span>.` + // resto = host/subred
            `<span class="ip-host">${binarios[3]}</span>`;
    } else if (primer_octeto >= 192 && primer_octeto <= 223) { 
        ipBinColoreada =
            `<span class="ip-red">${binarios[0]}</span>.` + // tres primeros = red
            `<span class="ip-red">${binarios[1]}</span>.` +
            `<span class="ip-red">${binarios[2]}</span>.` +
            `<span class="ip-host">${binarios[3]}</span>`; // ultimo = host
    } else {
        // para clases D y E mostramos todo gris
        ipBinColoreada = binarios.map(b => `<span class="ip-inactivo">${b}</span>`).join('.');
    }
    document.getElementById("ip_binario").innerHTML = ipBinColoreada;

    // mostramos la IP en hexadecimal tambien
    mostrarIPHexadecimal(octetos);

    // calculamos host minimo y maximo si la mascara tiene sentido
    const mascaraBits = parseInt(document.getElementById("mascara_personalizada").value);
    if (mascaraBits >= 8 && mascaraBits <= 30) {
        // convertimos la IP a un numero para hacer calculos
        const ipNum = octetos.reduce((acc, val) => (acc << 8) + parseInt(val), 0);
        const mask = (0xFFFFFFFF << (32 - mascaraBits)) >>> 0;
        const red = ipNum & mask;
        const broadcast = red | (~mask >>> 0);

        // host min = direccion red + 1
        // host max = direccion broadcast - 1
        const hostMin = red + 1;
        const hostMax = broadcast - 1;

        // funcion para convertir numero a formato IP
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

        // mostramos las subredes (si aplica)
        mostrarSubredes(ip, mascaraBits);
    } else {
        // si la mascara no es valida, no mostramos hosts
        document.getElementById("host_minimo").innerText = "N/A";
        document.getElementById("host_maximo").innerText = "N/A";
    }
}

// cuando se envia el formulario, procesamos la IP
document.getElementById("formulario").addEventListener('submit', function(event) {
    event.preventDefault();

    // primero validamos la mascara VLSM
    if (!validarMascaraVLSM()) {
        return; // si falla, no seguimos
    }
    const ip = document.getElementById("IP").value;
    mostrarResultado(ip);
});

// esta funcion obtiene la IP publica del usuario y la pone como placeholder
async function asignarIPPlaceholder() {
    try {
        // usamos la API de ipify para obtener la IP
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();

        // la mostramos como placeholder
        document.getElementById("IP").placeholder = `IP Actual: ${data.ip}`;
    } catch (error) {
        console.error("Error al obtener la IP pública:", error);
    }
}

// llamamos a la funcion para cargar la IP actual
asignarIPPlaceholder();

// esta funcion muestra las subredes disponibles (hasta un maximo de 8)
function mostrarSubredes(ip, mascaraBits) {
    const listaSubredes = document.getElementById('lista-subredes');
    const infoSubred = document.getElementById('info-subred');
    const mensajeSeleccion = document.querySelector('.mensaje-seleccion');
    const contenedorSubredes = document.getElementById('contenedor-tablas-subredes');

    // limpiamos lo que haya
    listaSubredes.innerHTML = '';
    infoSubred.style.display = 'none';
    mensajeSeleccion.style.display = 'block';

    // vemos cuantas subredes hay
    const numeroSubredes = document.getElementById("numero_subredes").innerText;

    // si no hay subredes, no mostramos nada
    if (numeroSubredes === "No tiene número de subredes" || numeroSubredes === "0") {
        contenedorSubredes.style.display = 'none';
        return;
    }

    // convertimos la IP a formato numerico para calcular
    const octetos = ip.split('.').map(Number);
    const ipNum = (octetos[0] << 24) | (octetos[1] << 16) | (octetos[2] << 8) | octetos[3];

    // determinamos los bits de red segun la clase
    let bitsRed;
    if (octetos[0] >= 0 && octetos[0] <= 127) bitsRed = 8;      // Clase A
    else if (octetos[0] >= 128 && octetos[0] <= 191) bitsRed = 16; // Clase B
    else if (octetos[0] >= 192 && octetos[0] <= 223) bitsRed = 24; // Clase C
    else bitsRed = 0; // Clase D o E (no subredes)

    // calculamos cuantas subredes hay segun la mascara
    let numSubredes = 0;
    if (mascaraBits > bitsRed) {
        numSubredes = Math.pow(2, mascaraBits - bitsRed);
    } else {
        numSubredes = 1; // si no hay subredes adicionales, mostramos la red principal
    }

    // solo mostramos hasta 8 subredes para no sobrecargar la vista
    const subredesMostrar = Math.min(numSubredes, 8);

    // tamano de cada subred = 2^(32-mascara)
    const tamanoSubred = Math.pow(2, 32 - mascaraBits);

    // calculamos la direccion de red base
    const mascara = (0xFFFFFFFF << (32 - mascaraBits)) >>> 0;
    const redBase = ipNum & mascara;

    // generamos las subredes
    for (let i = 0; i < subredesMostrar; i++) {
        // direccion de red = base + (indice * tamano)
        const dirRed = redBase + (i * tamanoSubred);

        // direccion de broadcast = direccion red + tamano - 1
        const dirBroadcast = dirRed + tamanoSubred - 1;

        // host min y max
        const hostMin = dirRed + 1;
        const hostMax = dirBroadcast - 1;

        // calculamos hosts disponibles (tamano - 2)
        const numHosts = Math.max(0, tamanoSubred - 2);

        // wildcard es lo opuesto a la mascara
        const wildcard = ~mascara >>> 0;

        // convertimos todo a formato IP legible
        const redIP = numToIp(dirRed);
        const broadcastIP = numToIp(dirBroadcast);
        const hostMinIP = numToIp(hostMin);
        const hostMaxIP = numToIp(hostMax);
        const mascaraIP = numToIp(mascara);
        const wildcardIP = numToIp(wildcard);

        // creamos el elemento de la subred para mostrarlo
        const subredItem = document.createElement('div');
        subredItem.className = 'subred-item';
        subredItem.innerHTML = `
            <h4>Subred ${i + 1}</h4>
            <p>Red: ${redIP}/${mascaraBits}</p>
            <p>Hosts: ${numHosts}</p>
        `;

        // guardamos todos los datos para mostrarlos si se hace clic
        subredItem.dataset.direccionRed = redIP;
        subredItem.dataset.mascara = mascaraIP;
        subredItem.dataset.mascaraBits = mascaraBits;
        subredItem.dataset.wildcard = wildcardIP;
        subredItem.dataset.broadcast = broadcastIP;
        subredItem.dataset.hostMin = hostMinIP;
        subredItem.dataset.hostMax = hostMaxIP;
        subredItem.dataset.numHosts = numHosts;

        // cuando se hace clic en una subred, mostramos sus detalles
        subredItem.addEventListener('click', function() {
            // quitamos la seleccion anterior
            document.querySelectorAll('.subred-item').forEach(item => {
                item.classList.remove('activa');
            });

            // marcamos esta como activa
            this.classList.add('activa');

            // mostramos la info
            mostrarDetallesSubred(this.dataset);
        });

        listaSubredes.appendChild(subredItem);
    }

    // seleccionamos la primera subred por defecto
    if (subredesMostrar > 0) {
        const primeraSubred = listaSubredes.firstElementChild;
        if (primeraSubred) {
            primeraSubred.click();
        }
    }

    // si hay muchas subredes, avisamos que solo mostramos 8
    if (numSubredes > 8) {
        const mensajeExtra = document.createElement('div');
        mensajeExtra.className = 'mensaje-extra';
        mensajeExtra.innerHTML = `<p>Mostrando 8 de ${numSubredes} subredes totales</p>`;
        listaSubredes.appendChild(mensajeExtra);
    }

    // actualizamos el texto del boton
    document.getElementById('toggle_subredes').textContent = 'Mostrar subredes';
}

// esta funcion muestra los detalles de una subred cuando la seleccionamos
function mostrarDetallesSubred(datos) {
    const infoSubred = document.getElementById('info-subred');
    const mensajeSeleccion = document.querySelector('.mensaje-seleccion');

    // ocultamos el mensaje y mostramos los detalles
    mensajeSeleccion.style.display = 'none';
    infoSubred.style.display = 'block';

    // actualizamos la interfaz con los datos de la subred
    document.getElementById('detalle-red').textContent = `${datos.direccionRed}/${datos.mascaraBits}`;
    document.getElementById('detalle-mascara').textContent = `${datos.mascara} (/${datos.mascaraBits})`;
    document.getElementById('detalle-wildcard').textContent = datos.wildcard;
    document.getElementById('detalle-broadcast').textContent = datos.broadcast;
    document.getElementById('detalle-host-min').textContent = datos.hostMin;
    document.getElementById('detalle-host-max').textContent = datos.hostMax;
    document.getElementById('detalle-num-hosts').textContent = datos.numHosts;
}

// funcion auxiliar para convertir un numero a formato IP
function numToIp(num) {
    return [
        (num >>> 24) & 0xFF,
        (num >>> 16) & 0xFF,
        (num >>> 8) & 0xFF,
        num & 0xFF
    ].join('.');
}

// esta funcion alterna entre mostrar los valores en binario o decimal
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

    // si no tenemos los valores en binario, los generamos
    function toBin(ip) {
        return ip.split('.').map(o => ("00000000" + parseInt(o).toString(2)).slice(-8)).join('.');
    }

    if (!ipBin.innerHTML) ipBin.innerHTML = toBin(ipDec.innerText);
    if (!wildcardBin.innerHTML) wildcardBin.innerHTML = toBin(wildcardDec.innerText);
    if (!mascaraBin.innerHTML) mascaraBin.innerHTML = toBin(mascaraDec.innerText);
    if (!redBin.innerHTML) redBin.innerHTML = toBin(redDec.innerText);
    if (!broadBin.innerHTML) broadBin.innerHTML = toBin(broadDec.innerText);

    // alternamos entre binario y decimal
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

    // cambiamos el texto del boton
    document.getElementById("toggle_binario").innerText = mostrarBinario ? "Ver en decimal" : "Ver en binario";
}

// asignamos el evento al boton de alternar binario/decimal
if (document.getElementById("toggle_binario")) {
    document.getElementById("toggle_binario").addEventListener("click", alternarBinarioDecimal);
}

// ocultamos el contenedor de subredes al inicio
const contenedorSubredes = document.getElementById("contenedor-tablas-subredes");
contenedorSubredes.style.display = "none";

// evento para mostrar/ocultar subredes
document.getElementById('toggle_subredes').addEventListener('click', function() {
    const isHidden = contenedorSubredes.style.display === "none" || contenedorSubredes.style.display === "";
    contenedorSubredes.style.display = isHidden ? "block" : "none";
    this.textContent = isHidden ? "Ocultar subredes" : "Mostrar subredes";
});