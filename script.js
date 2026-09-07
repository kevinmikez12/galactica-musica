// ============================================================
// SECCIÓN 1: MENÚ FLOTANTE DE REDES SOCIALES
// ============================================================
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
// ============================================================
// FIN SECCIÓN 1
// ============================================================


// ============================================================
// SECCIÓN 2: SECUENCIA "BIG BANG" DE LA PANTALLA DE CARGA
// ============================================================
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
// ============================================================
// FIN SECCIÓN 2
// ============================================================


// ============================================================
// SECCIÓN 3: GENERAR ESTRELLAS DE FONDO
// ============================================================
// En vez de escribir 150 <div> a mano en el HTML, dejamos
// que JavaScript las cree en un loop — mucho más práctico
// cuando quieres muchas repeticiones con variación aleatoria.

const contenedorEstrellas = document.getElementById('estrellas');
// El contenedor .estrellas ahora mide 160vh en vez de 100vh (ver
// comentario en style.css) para que el parallax no deje huecos.
// Subimos la cantidad en la misma proporción (150 * 1.6 = 240)
// para que la densidad de estrellas por pantalla se sienta igual
// que antes, en vez de verse "más vacío" al repartirse en más área.
const CANTIDAD_ESTRELLAS = 240;

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
// ============================================================
// FIN SECCIÓN 3
// ============================================================


// ============================================================
// SECCIÓN 4: INTERACCIÓN DE PLANETAS (hover, click, enfocado)
// ============================================================
// Seleccionamos los PIVOTES (los contenedores que giran), no los
// planetas directamente. Esto es más estable porque el pivote
// nunca cambia de "sistema de coordenadas" (siempre es
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

  // ===== CLICK: comportamiento distinto según data-tipo =====
  planeta.addEventListener('click', (evento) => {
    evento.preventDefault();

    const tipo = planeta.dataset.tipo;     // lee el atributo data-tipo
    const nombre = planeta.dataset.nombre; // lee el atributo data-nombre

    // ===== TIPO "scroll" (Presskit, Biografía): solo desliza la
    // página hacia esa sección — SIN zoom, SIN atenuar el sistema
    // solar. Ese tratamiento es exclusivo de los planetas modal. =====
    if (tipo === 'scroll') {
      // El href del planeta ya trae el destino, ej. href="#presskit".
      // .replace('#', '') nos deja solo "presskit" para usar con getElementById.
      const idDestino = planeta.getAttribute('href').replace('#', '');
      document.getElementById(idDestino).scrollIntoView({ behavior: 'smooth' });
      return; // cortamos aquí, no ejecutamos el código de "enfocado" de abajo
    }

    // ===== TIPO "modal" (Shows, Newsletter): el comportamiento
    // que ya teníamos — el planeta se va al centro agrandado y
    // se abre su tarjeta de contenido =====
    if (planetaAbierto && planetaAbierto !== planeta) {
      cerrarPlaneta(planetaAbierto);
    }

    planeta.classList.add('enfocado');
    sistemaSolar.classList.add('enfocando');
    document.querySelector('.titulo').style.opacity = '0.15';
    planetaAbierto = planeta;

    if (nombre === 'Shows') {
      abrirModal('modalShows');
    } else if (nombre === 'Newsletter') {
      abrirModal('modalNewsletter');
    }
  });
});
// ============================================================
// FIN SECCIÓN 4
// ============================================================


// ============================================================
// SECCIÓN 5: SISTEMA DE MODALES (abrir, cerrar, click-fuera)
// ============================================================
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
// ============================================================
// FIN SECCIÓN 5
// ============================================================


// ============================================================
// SECCIÓN 6: EFECTO MAGNÉTICO DE LOS METEOROS (solo con mouse real)
// ============================================================
// Este efecto solo tiene sentido con un mouse real. En touch no
// existe "cursor pasando cerca" — lo que pasaba antes era que el
// navegador dispara un mousemove sintético después de cada tap, y
// el meteoro se enganchaba hacia donde tocaste en la pantalla
// (bug reportado en vista de celular). matchMedia detecta si el
// dispositivo tiene puntero fino con hover real (mouse) — si no
// lo tiene, ni siquiera corremos el efecto.
const tieneMouseReal = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const RADIO_DETECCION = 150;   // distancia en px a partir de la cual "siente" el cursor
const DESPLAZAMIENTO_MAX = 35; // qué tanto se puede mover el meteoro hacia el cursor, en px
const meteoros = document.querySelectorAll('.meteoro');

if (tieneMouseReal) {
  let mouseX = -1000; // arrancamos fuera de pantalla para que no reaccione al cargar
  let mouseY = -1000;

  // Guardamos la posición del mouse cada vez que se mueve.
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

        // Evita división por cero si el cursor cae justo en el
        // centro exacto del meteoro (NaN rompería el transform)
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
}
// ============================================================
// FIN SECCIÓN 6
// ============================================================


// ============================================================
// SECCIÓN 7: PARALAX DE ESTRELLAS AL HACER SCROLL
// ============================================================
// Las estrellas usan position:fixed — por defecto NO se mueven
// nada al hacer scroll, se quedan clavadas en pantalla siempre
// igual. Para dar sensación de "viajar" por el espacio, las
// desplazamos levemente en la misma dirección del scroll, pero
// mucho más lento que el contenido real (0.15x) — así se sienten
// "lejanas", como estrellas de fondo que casi no cambian de
// posición aunque avances mucho en la página.
const VELOCIDAD_PARALAX = 0.15;
let paralaxPendiente = false; // evita apilar cálculos si el scroll dispara más rápido de lo que el navegador puede pintar

window.addEventListener('scroll', () => {
  if (paralaxPendiente) return; // ya hay uno en camino, no agregamos otro

  // requestAnimationFrame agrupa el cálculo con el siguiente
  // redibujado de pantalla — mismo principio que usamos en el
  // efecto magnético de los meteoros (Sección 6), aquí para no
  // recalcular el transform más veces de las que el navegador
  // realmente puede mostrar (evita que el scroll se sienta "trabado")
  requestAnimationFrame(() => {
    // Tope de seguridad: el contenedor .estrellas tiene 30vh de
    // colchón extra (ver style.css). Sin este límite, si la página
    // se vuelve muy larga (cuando agreguemos contenido real a
    // Presskit/Biografía) el desplazamiento podría crecer más allá
    // de esos 30vh y volver a aparecer el hueco vacío. Al limitarlo
    // con Math.min(), el parallax simplemente deja de aumentar una
    // vez que llega al borde del colchón, sin importar qué tan
    // largo se ponga el scroll total de la página.
    const limiteParalax = window.innerHeight * 0.3; // 30vh en píxeles reales
    const desplazamiento = Math.min(window.scrollY * VELOCIDAD_PARALAX, limiteParalax);
    contenedorEstrellas.style.transform = `translateY(${desplazamiento}px)`;
    paralaxPendiente = false;
  });

  paralaxPendiente = true;
});
// ============================================================
// FIN SECCIÓN 7
// ============================================================


// ============================================================
// SECCIÓN 8: REVELADO ESCALONADO DEL MOODBOARD DE PRESSKIT
// (reversible: entra al bajar, se resetea al subir)
// ============================================================
// Para el efecto "las fotos van apareciendo al hacer scroll" NO
// usamos un listener de scroll como en el parallax (Sección 7).
// Ahí necesitábamos la posición EXACTA en cada momento (para mover
// las estrellas junto con el scroll). Aquí solo necesitamos una
// pregunta de sí/no: "¿el moodboard ya entró a la pantalla?" —
// y para ESO existe una herramienta hecha a la medida:
// IntersectionObserver. El navegador se encarga de vigilar el
// elemento y nos avisa solo, sin que nosotros calculemos nada en
// cada frame — más simple y más eficiente que reusar el patrón
// de scroll+requestAnimationFrame para este caso.

const moodboardPresskit = document.getElementById('moodboardPresskit');

if (moodboardPresskit) {
  const observadorPresskit = new IntersectionObserver((entradas) => {
    // "entradas" es una lista porque un mismo observer puede vigilar
    // varios elementos a la vez — aquí solo vigilamos uno, pero el
    // forEach es la forma estándar de leer el resultado de todos modos
    entradas.forEach((entrada) => {
      // .en-vista es la clase que activa las transiciones en CSS
      // (ver .moodboard-presskit.en-vista en style.css) — el CSS
      // decide CÓMO se ve la animación, JS solo decide CUÁNDO.
      //
      // La versión anterior solo hacía classList.add() y luego
      // dejaba de observar (unobserve) para que fuera "una sola
      // vez". Para que sea reversible basta con alternar: agregar
      // la clase cuando SÍ se ve (isIntersecting true, bajando) y
      // quitarla cuando deja de verse (isIntersecting false, al
      // subir y salir de la pantalla por arriba). Como .medio-presskit
      // ya tiene su transition definida en el estado base (no solo
      // en .en-vista), quitar la clase anima de regreso al estado
      // inicial con la misma duración — no hace falta CSS nuevo.
      entrada.target.classList.toggle('en-vista', entrada.isIntersecting);
    });
  }, {
    // threshold es un % del alto TOTAL del elemento, no de la pantalla.
    // Con 0.25 nos alcanzaba en desktop (moodboard de 780px, ~195px
    // ya activaban el efecto) pero en móvil el moodboard se apila en
    // una sola columna y mide más de 2000px — el 25% de eso son más
    // de 500px, y normalmente no entra tanto de una vez al llegar a
    // la sección. Bajarlo a 0.1 lo hace confiable sin importar qué
    // tan alto sea el moodboard en cada tamaño de pantalla.
    threshold: 0.1,
  });

  observadorPresskit.observe(moodboardPresskit);
}

// ============================================================
// FIN SECCIÓN 8
// ============================================================