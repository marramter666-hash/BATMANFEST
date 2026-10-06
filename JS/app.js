const botonHamburguesa = document.querySelector('.hamburguesa');
const menuBatido = document.querySelector('.batido');

botonHamburguesa.addEventListener('click', () => {
    menuBatido.classList.toggle('show');
});