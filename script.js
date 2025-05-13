const octetos = document.querySelectorAll('.octeto');


octetos.forEach(octeto => {
    octeto.addEventListener('input', () => {
        const valor = parseInt(octeto.value);

        if (valor <= 255 && valor >= 0) {
            octeto.style.color = "green"; // Dentro del rango
        } else {
            octeto.style.color = "red"; // Fuera del rango
        }
    });
});


document.getElementById("calcular").addEventListener('click', () => {
    

});



