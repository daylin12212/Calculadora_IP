const octetos = document.querySelectorAll('.octeto');


// Evento para ver si es válido el valor de cada octeto
// y cambiar el color de fondo a verde o rojo
octetos.forEach(octeto => {
    octeto.addEventListener('input', () => {
        const valor = parseInt(octeto.value);

        // Verificar si el valor está en el rango permitido
        if (!isNaN(valor) && valor >= 0 && valor <= 255) {
            octeto.style.backgroundColor = "green"; // Dentro del rango
        } else {
            octeto.style.backgroundColor = "red"; // Fuera del rango
        }
    });
});