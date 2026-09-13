// ============================================================
// SECCIÓN 1: MENÚ FLOTANTE DE REDES SOCIALES
// ============================================================
const botonRedes = document.getElementById('botonRedes');
const redesFlotantes = document.getElementById('redesFlotantes');

botonRedes.addEventListener('click', () => {
  // En modo "volver arriba" (footer visible, ver Sección 9) este
  // mismo botón ya no abre el menú de redes — regresa al inicio.
  if (redesFlotantes.classList.contains('modo-volver-arriba')) {
    const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefiereMenosMovimiento ? 'auto' : 'smooth' });
    return;
  }

  // toggle() es un método que AGREGA la clase si no la tiene,
  // o la QUITA si ya la tiene — perfecto para "encender/apagar"
  redesFlotantes.classList.toggle('abierto');
  botonRedes.classList.toggle('abierto');
  const abierto = redesFlotantes.classList.contains('abierto');
  // Cambiamos el símbolo "+" por "×" cuando está abierto
  botonRedes.textContent = abierto ? '×' : '+';
  botonRedes.setAttribute('aria-label', abierto ? 'Cerrar redes sociales' : 'Abrir redes sociales');
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

// nucleoBigbang es un <img> con un GIF animado (la estrella del
// cliente). Un GIF no se puede "pausar" con CSS como una animación
// nuestra — si el usuario pidió menos movimiento, la única forma de
// respetarlo de verdad es servirle un frame fijo en vez del GIF.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  nucleoBigbang.src = 'assets/nucleo-estrella-estatica.png';
}

// { once: true }: el propio navegador remueve este listener después del
// primer clic — reemplaza el intento anterior de hacerlo a mano con
// removeEventListener, que no funcionaba porque le pasábamos una función
// anónima DISTINTA a la que se había registrado (nunca podía coincidir,
// así que el listener nunca se quitaba de verdad). Con doble-clic rápido
// esto permitía re-disparar toda la secuencia y encimar los setTimeout.
pantallaCarga.addEventListener('click', () => {
  // Guardamos la bandera apenas hace clic (no hace falta esperar a que
  // termine la animación): la próxima vez que esta MISMA pestaña haga
  // un refresh, el script de <head> la va a encontrar y va a saltarse
  // la pantalla de carga por completo. Se borra sola si cierra la
  // pestaña/navegador — por eso sessionStorage y no localStorage.
  try {
    sessionStorage.setItem('galacticaIntroVista', '1');
  } catch (error) {
    // Si sessionStorage no está disponible, no pasa nada grave: solo
    // significa que la próxima vez volverá a ver la intro.
  }

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
    // 13 sept — antes: nucleoBigbang.style.opacity = '0'. No servía de
    // nada: la animación `respirar` (CSS, en curso) le sigue ganando a
    // un opacity puesto por JS vía estilo inline normal, así que el
    // núcleo seguía "respirando" visible durante todo el fundido final
    // (bug real que reportó Kevin: "se sigue viendo la estrella después
    // de la explosión"). classList.add en vez de .style: la clase trae
    // animation:none, que sí apaga la animación que estaba ganando la
    // pelea — ver .nucleo-bigbang.desvanecido en style.css.
    nucleoBigbang.classList.add('desvanecido');
    flashExplosion.classList.add('explotando'); // disparamos la expansión
  }, 600);

  // 3. Cuando el flash termine de expandirse (0.8s de animación),
  //    ocultamos toda la pantalla de carga para revelar el sistema solar
  setTimeout(() => {
    pantallaCarga.classList.add('oculta');
  }, 600 + 400); // 600ms de tensión + parte de la explosión, para que
                  // el flash blanco ya cubra la pantalla justo cuando
                  // empezamos a desvanecer esta capa
}, { once: true });
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

// Tecla Escape también cierra — patrón esperado de accesibilidad
// (WCAG 2.1, "cierre de contenido"/manejo de foco): quien navega con
// teclado o lector de pantalla no debería depender de encontrar y
// hacer click en el botón "×" para salir de un modal.
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && planetaAbierto) {
    cerrarModales();
  }
});

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
// SECCIÓN 8: REVELADO AL HACER SCROLL — utilidad reutilizable
// (reversible: entra al bajar, se resetea al subir)
// ============================================================
// Para el efecto "esto va apareciendo al hacer scroll" NO usamos
// un listener de scroll como en el parallax (Sección 7). Ahí
// necesitábamos la posición EXACTA en cada momento (para mover las
// estrellas junto con el scroll). Aquí solo necesitamos una
// pregunta de sí/no: "¿el elemento ya entró a la pantalla?" — y
// para ESO existe una herramienta hecha a la medida:
// IntersectionObserver. El navegador vigila el elemento y nos
// avisa solo, sin que nosotros calculemos nada en cada frame.
//
// activarRevelado() es GENÉRICA a propósito: le pasas un selector
// y observa TODOS los elementos que hagan match, cada uno por su
// cuenta (independiente de los demás — si hay 3 elementos, cada
// uno entra/sale según si ÉL está en pantalla, no los otros dos).
// A cada uno le agrega/quita 'en-vista' — el CSS decide CÓMO se ve
// la animación (opacity, transform, delay...), esta función solo
// decide CUÁNDO. Por eso el mismo helper sirve tanto para el
// moodboard de Presskit (un solo elemento, cascada interna por
// CSS) como para los bloques de Biografía (varios elementos
// independientes) sin duplicar la lógica del observer cada vez
// que una sección nueva necesite este mismo efecto.
//
// Para que sea reversible basta con alternar: agregar la clase
// cuando SÍ se ve (isIntersecting true, bajando) y quitarla cuando
// deja de verse (false, al subir y salir por arriba). Mientras el
// elemento tenga su transition definida en el estado BASE (no solo
// en .en-vista), quitar la clase anima de regreso solita, sin CSS
// extra — ver la nota sobre .medio-presskit en style.css para el
// motivo por el que el transition-delay escalonado NO debe vivir
// en la regla base (ahí está documentado el bug que eso causaba).
function activarRevelado(selector, threshold = 0.2) {
  const elementos = document.querySelectorAll(selector);
  if (!elementos.length) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      entrada.target.classList.toggle('en-vista', entrada.isIntersecting);
    });
  }, { threshold });

  elementos.forEach((elemento) => observador.observe(elemento));
}

// Presskit: threshold bajo (0.1) porque el moodboard mide muy
// distinto de alto en mobile (apilado, 2000px+) que en desktop
// (~780px) — con un threshold más alto no disparaba en mobile.
activarRevelado('#moodboardPresskit', 0.1);

// Presskit, video destacado (13 sept, fix de rendimiento — ver
// PENDIENTES #18 del doc del proyecto): el efecto de "vapor"
// (::before/::after con blur(45px)) corría siempre, sin importar si
// esta sección estaba en pantalla, mismo patrón ya corregido en v60
// para meteoros y la nebulosa de Biografía. threshold default (0.2):
// el bloque no cambia tanto de alto entre mobile/desktop como el
// moodboard de arriba.
activarRevelado('.video-destacado');

// Biografía: la intro (tagline) y cada uno de los 2 bloques
// foto+texto se revela cuando ÉL entra en pantalla — no cuando
// entra la sección completa. threshold default (0.2): aquí no hay
// tanta diferencia de alto entre mobile y desktop como en Presskit.
activarRevelado('.intro-biografia');
activarRevelado('.bloque-bio');

// ============================================================
// FIN SECCIÓN 8
// ============================================================


// ============================================================
// SECCIÓN 8B: TEXTURA DECORATIVA DE BIOGRAFÍA — auto-relleno
// ============================================================
// .textura-bio (los 2 bloques de Biografía) repite una frase corta
// como "papel tapiz" muy tenue detrás del párrafo real — ver
// style.css para el resto del efecto. La cantidad de repeticiones
// vivía escrita a mano en el HTML (primero 3 copias de la frase,
// después 6) — bug real que reportó Kevin dos veces seguidas: cada
// vez que cambiaba el tamaño de fuente de la textura o el ancho de
// pantalla, esa cantidad fija dejaba de alcanzar (dejaba un hueco
// sin frase) o sobraba de forma distinta en cada bloque (uno se veía
// "completo", el otro no) — porque el alto real de cada tarjeta
// depende de cuánto ocupa el párrafo REAL de cada bloque, que no es
// igual entre los dos ni se puede saber de antemano.
//
// En vez de seguir ajustando el número a mano cada vez, esta función
// mide el alto real de la tarjeta en el navegador de quien esté
// viendo el sitio y repite la frase las veces que hagan falta para
// llenarlo con margen de sobra — funciona igual sin importar el
// ancho de pantalla, el tamaño de fuente que se use en el futuro, o
// cuánto texto real tenga cada bloque.
function llenarTexturasBio() {
  document.querySelectorAll('.textura-bio').forEach((el) => {
    // La frase base vive en data-frase (una sola copia) en vez de en
    // el texto visible directamente — así esta función siempre sabe
    // cuál es la unidad a repetir, sin importar cuántas copias haya
    // dejado puestas una corrida anterior (por ejemplo, después de
    // un resize).
    const frase = el.dataset.frase;
    if (!frase) return;

    // .textura-bio es position:absolute + inset:0, así que su propio
    // alto YA es igual al de su contenedor (.texto-bloque-bio) incluso
    // sin contenido — medimos el contenedor directamente, más claro
    // que depender de ese detalle.
    const alturaObjetivo = el.parentElement.getBoundingClientRect().height;

    let texto = frase;
    el.textContent = texto;

    // Límite de 80 vueltas: red de seguridad para nunca quedar en un
    // loop infinito si algo raro pasa con la medición (por ejemplo,
    // el elemento todavía no es visible y alturaObjetivo da 0) — no
    // el número real que se espera usar. (Con 40 de tope, la frase
    // más corta —"UN RINCÓN SEGURO"— llegó a topar el límite en
    // algunos anchos de pantalla antes de alcanzar el margen de 1.3x
    // de abajo, verificado con Playwright; 80 deja bastante aire de
    // sobra sin arriesgar un loop largo de verdad — cada vuelta es
    // barata, solo mide scrollHeight.)
    let vueltas = 0;
    // ×1.3: no solo "alcanzar" el alto exacto (ahí quedaría el último
    // renglón justo al ras, fácil que un cambio mínimo de ancho lo
    // deje corto de nuevo) sino pasarse con margen real, para que
    // vuelva a sobrar texto incluso si la tarjeta crece un poco.
    while (el.scrollHeight < alturaObjetivo * 1.3 && vueltas < 80) {
      texto += ' ' + frase;
      el.textContent = texto;
      vueltas++;
    }
  });
}

// window.load (no solo al final del <script>): esta medición depende
// de cuánto ocupa el párrafo real ya con la fuente Montserrat
// self-hosted aplicada — si corriera antes de que esa fuente termine
// de cargar, el navegador mediría con la fuente de reemplazo
// (distinto ancho de letra = distinto conteo de renglones reales) y
// el resultado podría quedar corto una vez que la fuente real entra.
window.addEventListener('load', llenarTexturasBio);

// Las tarjetas cambian de alto al cambiar el ancho de pantalla (el
// párrafo real envuelve distinto) — recalculamos, con un debounce
// simple de 200ms para no correr esto en cada pixel que dispara el
// evento resize.
let temporizadorResizeTextura;
window.addEventListener('resize', () => {
  clearTimeout(temporizadorResizeTextura);
  temporizadorResizeTextura = setTimeout(llenarTexturasBio, 200);
});
// ============================================================
// FIN SECCIÓN 8B
// ============================================================


// ============================================================
// SECCIÓN 9: BOTÓN STICKY → "VOLVER ARRIBA" AL LLEGAR AL FOOTER
// ============================================================
// El mismo botón redondo de redes sociales (Sección 1) se transforma
// en un cohete que regresa al usuario arriba cuando el footer entra
// en pantalla. No usamos activarRevelado() aquí porque esa función
// alterna una clase en el MISMO elemento que observa — este caso es
// distinto: observamos el footer, pero el que cambia es el botón de
// redes, que vive en otra parte del HTML.
const piePagina = document.querySelector('.pie-pagina');

if (piePagina) {
  const observadorFooter = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        // Si el menú de redes se había quedado abierto, lo cerramos
        // primero — si no, se ve una lista de íconos abierta justo
        // encima de la fila de redes del footer (duplicado y feo).
        redesFlotantes.classList.remove('abierto');
        botonRedes.classList.remove('abierto');
        // Sincronizamos también el texto "+/×": aquí no se ve porque
        // el modo cohete lo oculta con font-size:0, pero si no lo
        // reseteamos, al volver arriba reaparecería con el símbolo
        // equivocado (el "×" de un menú que ya forzamos a cerrar).
        botonRedes.textContent = '+';
        botonRedes.setAttribute('aria-label', 'Volver arriba');
      } else {
        botonRedes.setAttribute('aria-label', 'Abrir redes sociales');
      }
      // Reversible, mismo patrón que el resto del sitio: aparece al
      // entrar el footer, se deshace solo al volver a subir.
      redesFlotantes.classList.toggle('modo-volver-arriba', entrada.isIntersecting);
    });
  }, { threshold: 0.1 });

  observadorFooter.observe(piePagina);
}
// ============================================================
// FIN SECCIÓN 9
// ============================================================
