const boton = document.getElementById('cambiar-tema');
const cuerpo = document.body;
const gif = document.getElementById('imagen-gif');

let temaOscuro = false;

boton.addEventListener('click', () => {
  temaOscuro = !temaOscuro; // cambia el valor a lo contrario

  if (temaOscuro) {
    cuerpo.classList.add('oscuro');
    gif.src = 'https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyYXFjYnFrenR3NmNrMnc1YTdtZjI1ZGtmYmFucTFkNnNieHNrYjA5ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/twtxKQir7Ixx7faoBS/source.gif'; // cambia al gif oscuro
  } else {
    cuerpo.classList.remove('oscuro');
    gif.src = 'https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyYXFjYnFrenR3NmNrMnc1YTdtZjI1ZGtmYmFucTFkNnNieHNrYjA5ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/twtxKQir7Ixx7faoBS/source.gif'; // vuelve al gif claro
  }
});



