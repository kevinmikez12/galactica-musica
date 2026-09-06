// ===================================================
// MENÚ FLOTANTE DE REDES SOCIALES
// ===================================================
const botonRedes = document.getElementById('botonRedes');
const redesFlotantes = document.getElementById('redesFlotantes');

botonRedes.addEventListener('click', () => {
  // toggle() es un método que AGREGA la clase si no la tiene,
  // o la QUITA si ya la tiene — perfecto para "encender/apagar"
  redesFlotantes.classList.toggle('abierto');
  botonRedes.classList.toggle('abierto');
  // Cambiamos el símbolo "+" por "×" cuando está abierto
  botonRedes.textContent = redesFlotantes.classList.contains('abierto') ? '×' : '+';
});

// ===================================================
// SECUENCIA "BIG BANG" DE LA PANTALLA DE CARGA
// ===================================================
const pantallaCarga = document.getElementById('pantallaCarga');
const nucleoBigbang = document.getElementById('nucleoBigbang');
const flashExplosion = document.getElementById('flashExplosion');
const textoCarga = document.getElementById('textoCarga');

pantallaCarga.addEventListener('click', () => {
  // Evitar que se pueda hacer clic dos veces mientras ya está explotando
  pantallaCarga.removeEventListener('click', () => {});
  pantallaCarga.style.cursor = 'default';
  textoCarga.textContent = '';

  // 1. El núcleo empieza a "temblar" más rápido (tensión)
  nucleoBigbang.classList.add('tension');

  // 2. Después de un breve momento de tensión, disparamos la explosión.
  //    setTimeout ejecuta código UNA SOLA VEZ, después de X milisegundos
  //    (diferente a setInterval, que se repite; o requestAnimationFrame,
  //    que es continuo). Aquí es la herramienta correcta porque solo
  //    queremos que pase una vez, con un retraso.
  setTimeout(() => {
    nucleoBigbang.style.opacity = '0'; // escondemos el núcleo original
    flashExplosion.classList.add('explotando'); // disparamos la expansión
  }, 600);

  // 3. Cuando el flash termine de expandirse (0.8s de animación),
  //    ocultamos toda la pantalla de carga para revelar el sistema solar
  setTimeout(() => {
    pantallaCarga.classList.add('oculta');
  }, 600 + 400); // 600ms de tensión + parte de la explosión, para que
                  // el flash blanco ya cubra la pantalla justo cuando
                  // empezamos a desvanecer esta capa
});
// ===================================================
// GENERAR ESTRELLAS DE FONDO
// ===================================================
// En vez de escribir 150 <div> a mano en el HTML, dejamos
// que JavaScript las cree en un loop — mucho más práctico
// cuando quieres muchas repeticiones con variación aleatoria.

const contenedorEstrellas = document.getElementById('estrellas');
const CANTIDAD_ESTRELLAS = 150;

for (let i = 0; i < CANTIDAD_ESTRELLAS; i++) {
  const estrella = document.createElement('div');
  estrella.className = 'estrella';

  // Tamaño aleatorio entre 1 y 3px (estrellas chicas se ven más realistas
  // que unas muy grandes y parejas)
  const tamano = Math.random() * 2 + 1;
  estrella.style.width = `${tamano}px`;
  estrella.style.height = `${tamano}px`;

  // Posición aleatoria en toda la pantalla (0% a 100% del ancho/alto)
  estrella.style.top = `${Math.random() * 100}%`;
  estrella.style.left = `${Math.random() * 100}%`;

  // Duración de titileo aleatoria, para que no todas parpadeen
  // sincronizadas (eso se vería artificial)
  const duracion = Math.random() * 3 + 2; // entre 2 y 5 segundos
  estrella.style.animationDuration = `${duracion}s`;

  // Delay aleatorio para que no arranquen todas al mismo tiempo
  estrella.style.animationDelay = `${Math.random() * 5}s`;

  contenedorEstrellas.appendChild(estrella);
}
// ===== SELECCIONAMOS LOS ELEMENTOS QUE VAMOS A CONTROLAR =====
// Ahora seleccionamos los PIVOTES (los contenedores que giran),
// no los planetas directamente. Esto es más estable porque el
// pivote nunca cambia de "sistema de coordenadas" (siempre es
// position:absolute), a diferencia del planeta que salta a
// position:fixed al enfocarse.
const planetas = document.querySelectorAll('.planeta');
const sistemaSolar = document.getElementById('sistemaSolar');
let planetaAbierto = null; // aquí guardamos cuál planeta está enfocado ahora mismo

planetas.forEach(planeta => {
  const pivote = planeta.parentElement;

  // ===== HOVER: SOLO pausa la órbita =====
  // El agrandado (scale 1.6) ya lo hace CSS solo con :hover,
  // aquí en JS únicamente pausamos el giro del pivote.
  planeta.addEventListener('mouseenter', () => {
    pivote.classList.add('pausado');
  });

  planeta.addEventListener('mouseleave', () => {
    // Solo despausamos si este planeta no es el que está "abierto"
    // (si el usuario ya le dio click, queremos que siga detenido)
    if (planeta !== planetaAbierto) {
      pivote.classList.remove('pausado');
    }
  });

  // ===== CLICK: manda el planeta al centro Y abre su modal si aplica =====
  planeta.addEventListener('click', (evento) => {
    evento.preventDefault();

    if (planetaAbierto && planetaAbierto !== planeta) {
      cerrarPlaneta(planetaAbierto);
    }

    planeta.classList.add('enfocado');
    sistemaSolar.classList.add('enfocando');
    document.querySelector('.titulo').style.opacity = '0.15';
    planetaAbierto = planeta;

    // Si este planeta es de tipo "modal", además abrimos su
    // tarjeta de contenido correspondiente
    const tipo = planeta.dataset.tipo;   // lee el atributo data-tipo
    const nombre = planeta.dataset.nombre; // lee el atributo data-nombre

    if (tipo === 'modal') {
      if (nombre === 'Shows') {
        abrirModal('modalShows');
      } else if (nombre === 'Newsletter') {
        abrirModal('modalNewsletter');
      }
    }
  });
});

// ===================================================
// SISTEMA DE MODALES: abrir y cerrar
// ===================================================
const fondoModal = document.getElementById('fondoModal');

function abrirModal(idModal) {
  const modal = document.getElementById(idModal);
  fondoModal.classList.add('visible');
  modal.classList.add('visible');
}

function cerrarModales() {
  // Ocultamos el fondo y CUALQUIER tarjeta que esté visible
  // (querySelectorAll por si en el futuro hay más de una abierta)
  fondoModal.classList.remove('visible');
  document.querySelectorAll('.tarjeta-modal.visible').forEach(modal => {
    modal.classList.remove('visible');
  });
  // Y también cerramos el planeta que quedó enfocado, si había uno
  if (planetaAbierto) {
    cerrarPlaneta(planetaAbierto);
  }
}

// El botón "×" de cada modal
document.querySelectorAll('[data-cerrar-modal]').forEach(boton => {
  boton.addEventListener('click', cerrarModales);
});

// Click en el fondo oscuro (fuera de la tarjeta) también cierra
fondoModal.addEventListener('click', cerrarModales);

// ===== Función para cerrar un planeta enfocado =====
function cerrarPlaneta(planeta) {
  const pivote = planeta.parentElement;
  planeta.classList.remove('enfocado');
  pivote.classList.remove('pausado');
  sistemaSolar.classList.remove('enfocando');
  document.querySelector('.titulo').style.opacity = '0.85';
  planetaAbierto = null;
}

// ===== Click fuera de un planeta enfocado, lo cierra =====
// OJO: agregamos una excepción — si el click ocurrió DENTRO de
// una tarjeta de modal (el usuario escribiendo en el newsletter,
// por ejemplo), NO cerramos nada. .closest() busca hacia arriba
// en el HTML si el elemento clickeado está dentro de ese selector.
document.addEventListener('click', (evento) => {
  const clickDentroDeModal = evento.target.closest('.tarjeta-modal');

  if (planetaAbierto && !evento.target.classList.contains('planeta') && !clickDentroDeModal) {
    cerrarModales(); // usamos cerrarModales() en vez de cerrarPlaneta()
                      // directo, para que también oculte cualquier
                      // modal que estuviera abierto al mismo tiempo
  }
});

// Los meteoros ya no reaccionan al hover — solo cruzan la pantalla
// de forma continua, como fondo decorativo.

// ===================================================
// EFECTO MAGNÉTICO: los meteoros se desplazan levemente
// hacia el cursor cuando este pasa cerca
// ===================================================

const RADIO_DETECCION = 150;   // distancia en px a partir de la cual "siente" el cursor
const DESPLAZAMIENTO_MAX = 35; // qué tanto se puede mover el meteoro hacia el cursor, en px

// Esta línea se había perdido — sin ella, "meteoros" no existía
// en ningún lado y JavaScript no podía usarla más abajo.
const meteoros = document.querySelectorAll('.meteoro');

let mouseX = -1000; // arrancamos fuera de pantalla para que no reaccione al cargar
let mouseY = -1000;

// Guardamos la posición del mouse cada vez que se mueve.
// OJO: no calculamos nada pesado aquí, solo guardamos números —
// el cálculo real se hace aparte, en un loop controlado (ver abajo).
document.addEventListener('mousemove', (evento) => {
  mouseX = evento.clientX;
  mouseY = evento.clientY;
});

// requestAnimationFrame es la forma correcta de animar en JS:
// le pide al navegador "llama esta función justo antes del
// siguiente redibujado de pantalla" — usualmente 60 veces por
// segundo, sincronizado con el monitor, mucho más eficiente
// que un setInterval a mano.
function actualizarMeteoros() {
  meteoros.forEach(meteoro => {
    // getBoundingClientRect() nos da la posición ACTUAL real
    // del meteoro en pantalla (incluyendo dónde va su animación
    // CSS en este preciso instante)
    const rect = meteoro.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;

    // Distancia entre el cursor y el centro del meteoro
    // (teorema de Pitágoras: raíz de (dx² + dy²))
    const dx = mouseX - centroX;
    const dy = mouseY - centroY;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia < RADIO_DETECCION) {
      // Mientras más cerca el cursor, más fuerte el "jalón"
      const fuerza = 1 - (distancia / RADIO_DETECCION);

      // ===== FIX DEL BUG =====
      // Si el cursor cae justo, justo encima del centro exacto del
      // meteoro, "distancia" puede ser 0 (o casi 0). Dividir entre 0
      // da como resultado "NaN" (Not a Number), lo cual rompe el
      // transform y deja al meteoro congelado — exactamente el bug
      // que viste. Math.max(distancia, 1) evita esto: nunca dejamos
      // que el divisor baje de 1, así el cálculo siempre da un
      // número válido, sin cambiar el efecto visual de forma notoria.
      const distanciaSegura = Math.max(distancia, 1);

      const desplazX = (dx / distanciaSegura) * DESPLAZAMIENTO_MAX * fuerza;
      const desplazY = (dy / distanciaSegura) * DESPLAZAMIENTO_MAX * fuerza;

      meteoro.style.transform = `translate(${desplazX}px, ${desplazY}px)`;
    } else {
      meteoro.style.transform = `translate(0px, 0px)`;
    }
  });

  // Volvemos a llamar esta misma función en el siguiente frame,
  // creando un loop infinito y eficiente
  requestAnimationFrame(actualizarMeteoros);
}

// Arrancamos el loop una sola vez
actualizarMeteoros();
