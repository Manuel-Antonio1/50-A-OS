/**
 * ============================================================
 * INVITACIÓN 50 AÑOS · MANUEL GUILLÉN
 * script.js — JavaScript principal
 * ============================================================
 *
 * CONTENIDO:
 *  1. Configuración General
 *  2. Partículas Doradas (Canvas)
 *  3. Contador Regresivo (Countdown)
 *  4. Scroll Reveal (elementos que aparecen al bajar)
 *  5. Galería de fotos (cards animadas)
 *  6. Formulario RSVP (validación + envío)
 *  7. Toast (notificación emergente)
 *  8. Botón "Volver Arriba"
 *  9. Navegación suave (smooth scroll)
 * 10. Init (inicialización al cargar la página)
 * ============================================================
 */


/* ============================================================
   1. CONFIGURACIÓN GENERAL
   ✏️ Edita aquí la fecha del evento y otros ajustes
   ============================================================ */


function comenzarExperiencia() {
  // 1. Reproducir música
  const audio = document.getElementById('musica-fondo');
  audio.play().catch(error => console.log("El navegador bloqueó el audio inicial"));

  // 2. Desvanecer la pantalla de bienvenida
  const overlay = document.getElementById('overlay-inicio');
  overlay.style.opacity = '0';
  
  // 3. Eliminarla del DOM después de la animación
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 800);
}

// CARRUSEL DE COMETARIOS 

const slider = document.getElementById('testimonial-wrapper');
const track = document.getElementById('testimonial-track');
let isDown = false;
let startX;
let scrollLeft;
let scrollSpeed = 0.4; 
let autoScrollActive = true;
let timeoutId = null;

// 1. FUNCIÓN DE MOVIMIENTO INFINITO
function step() {
  if (autoScrollActive && !isDown) {
    slider.scrollLeft += scrollSpeed;
    
    // LÓGICA DE BUCLE INFINITO:
    // Si el scroll llega a la mitad (donde terminan los originales y empiezan los duplicados)
    // saltamos al inicio instantáneamente.
    const maxScroll = slider.scrollWidth / 2;
    if (slider.scrollLeft >= maxScroll) {
      slider.scrollLeft = 0;
    }
  }
  window.requestAnimationFrame(step);
}

// Iniciar animación
window.requestAnimationFrame(step);

function reanudarMovimiento() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    if (!isDown) autoScrollActive = true;
  }, 2000); 
}

// 2. EVENTOS DE MOUSE
slider.addEventListener('mousedown', (e) => {
  isDown = true;
  autoScrollActive = false;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
  clearTimeout(timeoutId);
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.5; 
  slider.scrollLeft = scrollLeft - walk;

  // Control de bucle durante el arrastre manual
  const maxScroll = slider.scrollWidth / 2;
  if (slider.scrollLeft <= 0) {
    slider.scrollLeft = maxScroll;
  } else if (slider.scrollLeft >= maxScroll) {
    slider.scrollLeft = 0;
  }
});

slider.addEventListener('mouseup', () => {
  isDown = false;
  reanudarMovimiento();
});

slider.addEventListener('mouseleave', () => {
  if (isDown) {
    isDown = false;
    reanudarMovimiento();
  }
});

// 3. EVENTOS DE TOQUE (CELULARES)
slider.addEventListener('touchstart', (e) => {
  isDown = true;
  autoScrollActive = false;
  startX = e.touches[0].pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
  clearTimeout(timeoutId);
});

slider.addEventListener('touchmove', (e) => {
  if (!isDown) return;
  const x = e.touches[0].pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.5;
  slider.scrollLeft = scrollLeft - walk;

  const maxScroll = slider.scrollWidth / 2;
  if (slider.scrollLeft <= 0) {
    slider.scrollLeft = maxScroll;
  } else if (slider.scrollLeft >= maxScroll) {
    slider.scrollLeft = 0;
  }
});

slider.addEventListener('touchend', () => {
  isDown = false;
  reanudarMovimiento();
});
















const CONFIG = {
  // ✏️ EDITAR: Fecha y hora del evento (formato: YYYY-MM-DDTHH:MM:SS)
  eventDate: '2025-06-21T20:00:00',

  // ✏️ EDITAR: Cantidad de partículas (más = más efecto, más recursos)
  particleCount: 100,

  // ✏️ EDITAR: Color base de las partículas (en RGB separado por comas)
  particleColor: '201,168,76',

  // Duración del toast de confirmación en milisegundos
  toastDuration: 4000,
};


/* ============================================================
   2. PARTÍCULAS DORADAS (CANVAS)
   Crea un fondo animado con puntos flotantes dorados
   ============================================================ */

const ParticleSystem = (() => {

  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let   W, H;
  let   particles = [];
  let   animFrame;

  /**
   * Ajusta el canvas al tamaño de la ventana
   */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /**
   * Devuelve un número aleatorio entre a y b
   * @param {number} a - mínimo
   * @param {number} b - máximo
   */
  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  /**
   * Crea un objeto partícula con propiedades aleatorias
   */
  function createParticle() {
    return {
      x:      Math.random() * W,        // posición horizontal
      y:      Math.random() * H,        // posición vertical
      r:      rand(0.4, 2.5),           // radio (tamaño)
      alpha:  rand(0.1, 0.75),          // opacidad
      dx:     rand(-0.25, 0.25),        // velocidad horizontal
      dy:     rand(-0.7, -0.1),         // velocidad vertical (sube)
      phase:  Math.random() * Math.PI * 2, // fase del parpadeo
      speed:  rand(0.003, 0.009),       // velocidad del parpadeo
      shape:  Math.random() > 0.85 ? 'diamond' : 'circle', // forma
    };
  }

  /**
   * Dibuja una partícula en el canvas
   * @param {object} p - objeto partícula
   */
  function drawParticle(p) {
    // Opacidad pulsante usando onda seno
    const a = p.alpha * (0.5 + 0.5 * Math.sin(p.phase));

    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle   = `rgb(${CONFIG.particleColor})`;

    if (p.shape === 'diamond') {
      // Forma de diamante pequeño
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
      ctx.restore();
    } else {
      // Forma circular (por defecto)
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Inicializa el array de partículas
   */
  function init() {
    particles = Array.from({ length: CONFIG.particleCount }, createParticle);
  }

  /**
   * Bucle de animación principal
   */
  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p) => {
      drawParticle(p);

      // Actualizar posición
      p.x     += p.dx;
      p.y     += p.dy;
      p.phase += p.speed;

      // Reciclar partícula cuando sale del borde superior o lateral
      if (p.y < -10 || p.x < -10 || p.x > W + 10) {
        // Reinicia desde la parte inferior con valores nuevos
        const fresh = createParticle();
        Object.assign(p, fresh, { y: H + 5, x: Math.random() * W });
      }
    });

    animFrame = requestAnimationFrame(animate);
  }

  /**
   * Arranca el sistema de partículas
   */
  function start() {
    resize();
    init();
    animate();

    // Reajustar cuando cambia el tamaño de ventana
    window.addEventListener('resize', resize);
  }

  // API pública
  return { start };

})();


/* ============================================================
   3. CONTADOR REGRESIVO (COUNTDOWN)
   Muestra días, horas, minutos y segundos hasta el evento
   ============================================================ */

const Countdown = (() => {

  // Elementos del DOM para cada unidad de tiempo
  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');

  // Fecha objetivo
const target = new Date(2026, 4, 16, 20, 0, 0).getTime();

  /**
   * Rellena con cero a la izquierda si el número < 10
   * @param {number} n
   */
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  /**
   * Anima un número cuando cambia (destello dorado)
   * @param {HTMLElement} el
   */
  function flashElement(el) {
    el.style.color = '#e8c97a';
    setTimeout(() => { el.style.color = ''; }, 300);
  }

  /**
   * Actualiza los valores del contador cada segundo
   */
  function update() {
    const now  = Date.now();
    const diff = target - now;

    // Si la fecha ya pasó, muestra ceros
    if (diff <= 0) {
      [elDays, elHours, elMins, elSecs].forEach(el => { if(el) el.textContent = '00'; });
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    // Solo actualizar y animar si el valor cambió
    if (elDays  && elDays.textContent  !== pad(days))  { elDays.textContent  = pad(days);  flashElement(elDays); }
    if (elHours && elHours.textContent !== pad(hours)) { elHours.textContent = pad(hours); flashElement(elHours); }
    if (elMins  && elMins.textContent  !== pad(mins))  { elMins.textContent  = pad(mins);  flashElement(elMins); }
    if (elSecs  && elSecs.textContent  !== pad(secs))  { elSecs.textContent  = pad(secs);  flashElement(elSecs); }
  }

  /**
   * Inicia el contador
   */
  function start() {
    if (!elDays) return; // Si no existe el elemento, no hacer nada
    update();
    setInterval(update, 1000);
  }

  return { start };

})();


/* ============================================================
   4. SCROLL REVEAL
   Los elementos con clase .reveal aparecen al hacer scroll
   ============================================================ */

const ScrollReveal = (() => {

  /**
   * Inicializa el IntersectionObserver
   */
  function init() {
    const elements = document.querySelectorAll('.reveal');

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Una vez visible, dejar de observar para mejor rendimiento
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,   // Se activa cuando el 10% del elemento es visible
        rootMargin: '0px 0px -40px 0px', // Margen inferior para que no se active muy tarde
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  return { init };

})();


/* ============================================================
   5. GALERÍA DE FOTOS (ANIMACIÓN ESCALONADA)
   Las tarjetas de la galería aparecen con delay
   ============================================================ */

const Gallery = (() => {

  function init() {
    const cards = document.querySelectorAll('.gallery-card');

    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card  = entry.target;
            const delay = parseInt(card.dataset.delay || '0', 10);

            // Delay escalonado definido en el HTML con data-delay
            setTimeout(() => {
              card.classList.add('visible');
            }, delay);

            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));
  }

  return { init };

})();


/* ============================================================
   6. FORMULARIO RSVP - CONEXIÓN REAL
   ============================================================ */

const RSVPForm = (() => {

  const form       = document.getElementById('rsvp-form');
  const successMsg = document.getElementById('rsvp-success');
  const btnEnviar  = document.getElementById('btn-enviar');

  function validateField(input, errorId, message) {
    const errorEl = document.getElementById(errorId);
    const value   = input ? input.value.trim() : '';

    if (!value) {
      if (input)   input.classList.add('invalid');
      if (errorEl) errorEl.textContent = message;
      return false;
    }

    if (input)   input.classList.remove('invalid');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  function validateForm() {
    let isValid = true;

    if (!validateField(document.getElementById('nombre'), 'err-nombre', 'Por favor ingresa tu nombre')) { isValid = false; }
    if (!validateField(document.getElementById('apellido'), 'err-apellido', 'Por favor ingresa tu apellido')) { isValid = false; }
    if (!validateField(document.getElementById('familia'), 'err-familia', 'Por favor ingresa tu grupo/familia')) { isValid = false; }

    // CAMBIO IMPORTANTE: Usamos 'acompanantes' porque así está en tu HTML
    if (!validateField(document.getElementById('acompanantes'), 'err-asistencia', 'Por favor selecciona una opción')) { isValid = false; }

    return isValid;
  }

  /**
   * ENVÍO REAL AL BACKEND DE RENDER
   */
  async function simulateSubmit() {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // URL DE TU BACKEND REAL
    const urlBackend = 'https://onrender.com';

    const response = await fetch(urlBackend, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Error en el servidor');
    return true;
  }

  function init() {
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      if (btnEnviar) {
        btnEnviar.innerHTML = "ENVIANDO...";
        btnEnviar.disabled = true;
      }

      try {
        await simulateSubmit();

        // ÉXITO
        if (form)       form.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

      } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al conectar con el servidor. Inténtalo de nuevo.');
      } finally {
        if (btnEnviar) {
          btnEnviar.innerHTML = "CONFIRMAR";
          btnEnviar.disabled = false;
        }
      }
    });
  }

  return { init };

})();

// ¡NO OLVIDES ESTA LÍNEA AL FINAL PARA QUE TODO ARRANQUE!
RSVPForm.init();


/* ============================================================
   7. TOAST (NOTIFICACIÓN EMERGENTE)
   Muestra un mensaje temporal en la parte inferior
   ============================================================ */

const Toast = (() => {

  const toastEl = document.getElementById('toast');
  let   timer;

  /**
   * Muestra el toast con un mensaje
   * @param {string} message - texto a mostrar
   */
  function show(message) {
    if (!toastEl) return;

    // Actualizar mensaje
    toastEl.textContent = message;

    // Mostrar
    toastEl.classList.add('show');

    // Limpiar timer anterior si existía
    clearTimeout(timer);

    // Ocultar después del tiempo configurado
    timer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, CONFIG.toastDuration);
  }

  return { show };

})();


/* ============================================================
   8. BOTÓN "VOLVER ARRIBA"
   Aparece cuando el usuario hace scroll hacia abajo
   ============================================================ */

const ScrollTop = (() => {

  const btn = document.getElementById('scroll-top');

  function init() {
    if (!btn) return;

    // Mostrar/ocultar según posición del scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    // Click: scroll al inicio
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  return { init };

})();


/* ============================================================
   9. NAVEGACIÓN SUAVE (SMOOTH SCROLL)
   Asegura que todos los enlaces ancla (#) hagan scroll suave
   ============================================================ */

const SmoothNav = (() => {

  function init() {
    // Selecciona todos los enlaces que apuntan a un ancla interna
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();

        // Offset del scroll (útil si hay navegación fija)
        const offset = 0; // ✏️ EDITAR: cambia a 70 si tienes navbar fija
        const top    = targetEl.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  return { init };

})();


/* ============================================================
   10. INIT — INICIALIZACIÓN AL CARGAR LA PÁGINA
   Arranca todos los módulos cuando el DOM está listo
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Iniciar partículas doradas de fondo
  ParticleSystem.start();

  // Iniciar contador regresivo
  Countdown.start();

  // Activar reveal de elementos al hacer scroll
  ScrollReveal.init();

  // Activar animación de la galería
  Gallery.init();

  // Iniciar lógica del formulario RSVP
  RSVPForm.init();

  // Iniciar botón de volver arriba
  ScrollTop.init();

  // Activar navegación suave
  SmoothNav.init();

  // Mensaje en consola para identificar la versión
  console.log('%c✦ Invitación 50 Años · Manuel Guillén ✦', 'color:#c9a84c; font-size:14px; font-weight:bold;');
  console.log('%c✏️  Edita CONFIG al inicio de script.js para personalizar', 'color:#8a6a20; font-size:11px;');

});
