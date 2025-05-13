const octetos = document.querySelectorAll('.octeto');

octetos.forEach(octeto => {
    octeto.addEventListener('input', () => {
        const valor = parseInt(octeto.value);

        if (valor <= 255 && valor >= 0) {
            octeto.style.backgroundColor = "green"; // Dentro del rango
        } else {
            octeto.style.backgroundColor = "red"; // Fuera del rango
        }
    });
});