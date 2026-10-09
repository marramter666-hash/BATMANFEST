const modal = document.querySelector('#modalBienvenida');
const btnCerrar = document.querySelector('#btnCerrarBienvenida');

window.addEventListener('DOMContentLoaded', () => {

  const entradas = performance.getEntriesByType("navigation");
  const esRefresco = entradas.length > 0 && entradas[0].type === "reload";

  if (esRefresco) {
    sessionStorage.removeItem('batfamiliaVisto');
  }

  const yaVisto = sessionStorage.getItem('batfamiliaVisto');

  if (!yaVisto) {
    setTimeout(() => {
      modal.showModal(); 
    }, 1000);
  }
});

btnCerrar.addEventListener('click', () => {
  modal.close();
  sessionStorage.setItem('batfamiliaVisto', 'true');
});