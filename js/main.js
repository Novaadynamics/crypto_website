/* ============================================================
   BITCOIN — CRYPTO BROKERAGE LANDING PAGE
   Main JavaScript — GSAP + Three.js Edition
   ============================================================ */
'use strict';

// ── Register GSAP plugins ─────────────────────────────────────
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

/* ============================================================
   1. PRELOADER
   ============================================================ */
const preloader = document.getElementById('preloader');

document.body.style.overflow = 'hidden';

const preloaderTl = gsap.timeline({
  onComplete: () => {
    preloader.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    startHeroAnimation();
  },
});

preloaderTl
  .to('.spinner', { rotation: 360, duration: 0.9, ease: 'none', repeat: 1 })
  .to(preloader, {
    opacity: 0, duration: 0.7, ease: 'power2.inOut',
    onComplete: () => preloader.classList.add('hidden'),
  });

/* ============================================================
   2. THREE.JS — REMOVED
   ============================================================ */
function initThreeScene() { return; // removed
  const canvas = document.getElementById('threeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.set(0, 0, 28);

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const pl1 = new THREE.PointLight(0xF7931A, 4, 60); pl1.position.set(-10, 10, 10); scene.add(pl1);
  const pl2 = new THREE.PointLight(0xF2A900, 3, 60); pl2.position.set(10, -6, 8);   scene.add(pl2);
  const pl3 = new THREE.PointLight(0xf7c948, 2, 40); pl3.position.set(0, -12, 6);   scene.add(pl3);

  // Central torus (coin ring)
  const coin = new THREE.Mesh(
    new THREE.TorusGeometry(4, 0.6, 32, 120),
    new THREE.MeshStandardMaterial({ color: 0xF7931A, emissive: 0xC5710A, emissiveIntensity: 0.6, metalness: 0.9, roughness: 0.15 }),
  );
  scene.add(coin);

  // Inner disc
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(3.2, 64),
    new THREE.MeshStandardMaterial({ color: 0x1a0800, emissive: 0x8A4500, emissiveIntensity: 0.3, metalness: 0.8, roughness: 0.2 }),
  );
  scene.add(disc);

  // Orbit rings
  const rings = [];
  [
    { r: 6.5,  tube: 0.04, color: 0xF7931A, speed:  0.004 },
    { r: 8.5,  tube: 0.03, color: 0xF2A900, speed: -0.003 },
    { r: 10.5, tube: 0.025,color: 0xf7c948, speed:  0.002 },
  ].forEach((d) => {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(d.r, d.tube, 16, 200),
      new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.5 }),
    );
    m.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
    m.rotation.z = (Math.random() - 0.5) * 0.5;
    m.userData.speed = d.speed;
    scene.add(m); rings.push(m);
  });

  // Orbiting nodes
  const orbiters = [];
  [
    { radius: 6.5,  size: 0.35, color: 0xf7c948, angle: 0,   speed:  0.008 },
    { radius: 6.5,  size: 0.25, color: 0xF2A900, angle: 2.1, speed:  0.008 },
    { radius: 8.5,  size: 0.4,  color: 0xF7931A, angle: 1.0, speed: -0.006 },
    { radius: 8.5,  size: 0.28, color: 0xFF6B00, angle: 3.5, speed: -0.006 },
    { radius: 10.5, size: 0.3,  color: 0x48f76f, angle: 0.5, speed:  0.004 },
    { radius: 10.5, size: 0.22, color: 0xf7c948, angle: 4.2, speed:  0.004 },
  ].forEach((cfg) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(cfg.size, 32, 32),
      new THREE.MeshStandardMaterial({ color: cfg.color, emissive: cfg.color, emissiveIntensity: 0.8, metalness: 0.7, roughness: 0.2 }),
    );
    m.userData = { ...cfg };
    scene.add(m); orbiters.push(m);
  });

  // Starfield
  const sPos = new Float32Array(2000 * 3).map(() => (Math.random() - 0.5) * 200);
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.7 }));
  scene.add(stars);

  // Background floating octahedrons
  const hexNodes = [];
  for (let i = 0; i < 18; i++) {
    const c = [0xF7931A, 0xF2A900, 0xf7c948, 0xFF6B00][i % 4];
    const m = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.3 + Math.random() * 0.4, 0),
      new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.5, wireframe: i % 2 === 0 }),
    );
    m.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 10 - 5);
    m.userData.rx = (Math.random() - 0.5) * 0.02;
    m.userData.ry = (Math.random() - 0.5) * 0.02;
    m.userData.fa =  Math.random() * Math.PI * 2;
    m.userData.fs = Math.random() * 0.005 + 0.002;
    m.userData.famp = Math.random() * 1.5 + 0.5;
    scene.add(m); hexNodes.push(m);
  }

  // Mouse parallax
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    coin.rotation.y += 0.006; coin.rotation.x = 0.3;
    disc.rotation.z += 0.003;
    rings.forEach((r) => r.rotation.z += r.userData.speed);
    orbiters.forEach((o) => {
      o.userData.angle += o.userData.speed;
      o.position.x = Math.cos(o.userData.angle) * o.userData.radius;
      o.position.y = Math.sin(o.userData.angle) * o.userData.radius * 0.35;
      o.position.z = Math.sin(o.userData.angle) * o.userData.radius * 0.15;
      o.rotation.y += 0.02;
    });
    hexNodes.forEach((n) => {
      n.rotation.x += n.userData.rx;
      n.rotation.y += n.userData.ry;
      n.position.y += Math.sin(t * n.userData.fs * 100 + n.userData.fa) * n.userData.famp * 0.003;
    });
    stars.rotation.y += 0.0002; stars.rotation.x += 0.0001;
    camera.position.x += (mx * 2   - camera.position.x) * 0.04;
    camera.position.y += (-my * 1.5 - camera.position.y) * 0.04;
    pl1.intensity = 4 + Math.sin(t * 1.5) * 1.5;
    pl2.intensity = 3 + Math.cos(t * 2.0) * 1.0;
    renderer.render(scene, camera);
  })();
}

/* ============================================================
   3. HERO ENTRANCE  (GSAP timeline — fires after preloader)
   ============================================================ */
function startHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .fromTo('#navbar',           { y: -80, opacity: 0 },                { y: 0,  opacity: 1, duration: 0.8 })
    .fromTo('.hero-badge',       { y: 40,  opacity: 0, scale: 0.8 },    { y: 0,  opacity: 1, scale: 1, duration: 0.7 }, '-=0.4')
    .fromTo('.hero-title',       { y: 60,  opacity: 0 },                { y: 0,  opacity: 1, duration: 0.9 }, '-=0.5')
    .fromTo('.hero-desc',        { y: 40,  opacity: 0 },                { y: 0,  opacity: 1, duration: 0.7 }, '-=0.5')
    .fromTo('.hero-buttons',     { y: 30,  opacity: 0 },                { y: 0,  opacity: 1, duration: 0.6 }, '-=0.4')
    .fromTo('.hero-stats .stat-item', { y: 30, opacity: 0, scale: 0.9 },{ y: 0,  opacity: 1, scale: 1, duration: 0.5, stagger: 0.12 }, '-=0.3')
    .fromTo('.trust-box',        { x: 60,  opacity: 0 },                { x: 0,  opacity: 1, duration: 0.8 }, '-=0.7')
    .fromTo('.hero-coin-wrapper',{ scale: 0.5, opacity: 0, rotation: -20 },{ scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1,0.5)' }, '-=1.0')
    .fromTo('.floating-badge',   { scale: 0, opacity: 0 },              { scale: 1, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(2)' }, '-=0.5');
}

/* ============================================================
   4. SCROLL-TRIGGERED ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  // Section tags, titles, subs
  ['.section-tag', '.section-title', '.section-sub'].forEach((sel, i) => {
    gsap.utils.toArray(sel).forEach((el) => {
      gsap.fromTo(el,
        { y: [30, 50, 30][i], opacity: 0, skewY: i === 1 ? 2 : 0 },
        { y: 0, opacity: 1, skewY: 0, duration: [0.6, 0.8, 0.6][i], ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none reverse' } },
      );
    });
  });

  // Service cards
  gsap.utils.toArray('.service-card').forEach((c, i) =>
    gsap.fromTo(c, { y: 70, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.4)', delay: i * 0.1,
        scrollTrigger: { trigger: c, start: 'top 88%' } }));

  // Mid CTA box
  gsap.fromTo('.mid-cta-box', { scale: 0.92, opacity: 0, y: 40 },
    { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.3)',
      scrollTrigger: { trigger: '.mid-cta-box', start: 'top 82%' } });

  // Testimonial cards
  gsap.utils.toArray('.testimonial-card').forEach((c, i) =>
    gsap.fromTo(c, { y: 60, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out', delay: i * 0.12,
        scrollTrigger: { trigger: c, start: 'top 88%' } }));

  // Proof items
  gsap.utils.toArray('.proof-item').forEach((el, i) =>
    gsap.fromTo(el, { y: 30, opacity: 0, scale: 0.85 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%' } }));

  // FAQ items
  gsap.utils.toArray('.faq-item').forEach((el, i) =>
    gsap.fromTo(el, { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, delay: i * 0.08,
        scrollTrigger: { trigger: '.faq-section .row', start: 'top 82%' } }));

  // CTA box
  gsap.fromTo('.cta-box', { scale: 0.9, opacity: 0, y: 40 },
    { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.3)',
      scrollTrigger: { trigger: '.cta-box', start: 'top 82%' } });

  // Contact
  gsap.fromTo('.contact-info', { x: -60, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.contact-section .row', start: 'top 80%' } });
  gsap.fromTo('.contact-form', { x: 60, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.contact-section .row', start: 'top 80%' } });

  // Footer cols
  gsap.utils.toArray('.footer-top [class*="col-"]').forEach((c, i) =>
    gsap.fromTo(c, { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: i * 0.1,
        scrollTrigger: { trigger: '.footer-top', start: 'top 90%' } }));
}

/* ============================================================
   5. HERO PARALLAX
   ============================================================ */
function initHeroParallax() {
  gsap.to('.hero-title, .hero-desc, .hero-badge, .hero-buttons, .hero-stats, .trust-box, .hero-coin-wrapper', {
    yPercent: 15, ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* ============================================================
   6. PROGRESS BARS
   ============================================================ */
function initProgressBars() {
  gsap.utils.toArray('.animated-bar').forEach((bar) => {
    gsap.fromTo(bar, { width: '0%' },
      { width: bar.getAttribute('data-width'), duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: bar, start: 'top 85%' } });
  });

  const heroBar = document.querySelector('.sale-progress .progress-bar');
  if (heroBar) gsap.fromTo(heroBar, { width: '0%' }, { width: '71%', duration: 2.2, ease: 'power2.out', delay: 1.6 });
}

/* ============================================================
   7. COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  const data = [
    { target: 24,  suffix: 'M+', prefix: '$' },
    { target: 180, suffix: 'K+', prefix: '' },
    { target: 50,  suffix: '+',  prefix: '' },
  ];
  document.querySelectorAll('.hero-stats .stat-item h3').forEach((el, i) => {
    if (!data[i]) return;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to(obj, {
        val: data[i].target, duration: 2, ease: 'power2.out',
        onUpdate: () => { el.textContent = data[i].prefix + Math.round(obj.val) + data[i].suffix; },
      }),
    });
  });
}

/* ============================================================
   8. COUNTDOWN TIMER  (GSAP flip animation)
   ============================================================ */
function initCountdown() {
  const end = new Date(Date.now() + 47 * 86400000 + 18 * 3600000 + 33 * 60000);
  const els = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-minutes'),
    s: document.getElementById('cd-seconds'),
  };
  if (!els.d) return;

  function flip(el, val) {
    const str = String(val).padStart(2, '0');
    if (el.textContent === str) return;
    gsap.to(el, {
      scaleY: 0, duration: 0.15, ease: 'power2.in',
      onComplete: () => {
        el.textContent = str;
        gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.2, ease: 'back.out(2)' });
      },
    });
  }

  function tick() {
    const d  = end - Date.now();
    if (d <= 0) return;
    flip(els.d, Math.floor(d / 86400000));
    flip(els.h, Math.floor((d % 86400000) / 3600000));
    flip(els.m, Math.floor((d % 3600000) / 60000));
    flip(els.s, Math.floor((d % 60000)   / 1000));
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   9. DONUT CHART
   ============================================================ */
function drawDonutChart() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;
  const ctx   = canvas.getContext('2d');
  const cx    = canvas.width / 2, cy = canvas.height / 2;
  const outer = cx - 10, inner = outer * 0.62, GAP = 0.04;
  const slices = [
    { value: 40, color: '#F7931A' },
    { value: 15, color: '#F2A900' },
    { value: 20, color: '#f7c948' },
    { value: 10, color: '#ff6b6b' },
    { value:  5, color: '#48f76f' },
    { value: 10, color: '#4887f7' },
  ];
  const obj = { p: 0 };
  function draw(p) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let a = -Math.PI / 2;
    slices.forEach((s) => {
      const sw = (s.value / 100) * 2 * Math.PI * p;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outer, a + GAP / 2, a + sw - GAP / 2);
      ctx.arc(cx, cy, inner, a + sw - GAP / 2, a + GAP / 2, true);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color; ctx.shadowBlur = 10;
      ctx.fill(); ctx.restore();
      a += sw;
    });
  }
  ScrollTrigger.create({
    trigger: canvas, start: 'top 80%', once: true,
    onEnter: () => gsap.to(obj, { p: 1, duration: 1.8, ease: 'power2.out', onUpdate: () => draw(obj.p) }),
  });
}

/* ============================================================
   10. MAGNETIC BUTTONS
   ============================================================ */
function initMagneticButtons() {
  document.querySelectorAll('.btn-gradient, .btn-outline-glow').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () =>
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' }));
  });
}

/* ============================================================
   11. 3D CARD TILT
   ============================================================ */
function initTilt() {
  document.querySelectorAll('.service-card, .testimonial-card').forEach((card) => {
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      gsap.to(card, {
        rotationX: ((e.clientY - r.top)  / r.height - 0.5) * 12,
        rotationY: ((e.clientX - r.left) / r.width  - 0.5) * -12,
        scale: 1.03, duration: 0.35, ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () =>
      gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1,0.5)' }));
  });
}

/* ============================================================
   12. NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  ScrollTrigger.create({
    trigger: 'body', start: 'top -60px',
    onEnter:     () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
  });

  document.querySelectorAll('section[id]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 45%', end: 'bottom 45%',
      onEnter:     () => setActive(sec.id),
      onEnterBack: () => setActive(sec.id),
    });
  });

  function setActive(id) {
    navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          gsap.to(window, {
            scrollTo: { y: target, offsetY: 72 },
            duration: 0.6,
            ease: 'power2.out',
            overwrite: true,
          });
        }
        const col = document.getElementById('navbarNav');
        if (col && col.classList.contains('show')) document.querySelector('.navbar-toggler')?.click();
      }
    });
  });

  const toggler = document.querySelector('.navbar-toggler');
  const col     = document.getElementById('navbarNav');
  if (toggler && col) {
    col.addEventListener('show.bs.collapse', () => {
      gsap.to(toggler.querySelector('i'), { rotation: 90, duration: 0.3 });
      toggler.querySelector('i').className = 'fa-solid fa-xmark';
    });
    col.addEventListener('hide.bs.collapse', () => {
      toggler.querySelector('i').className = 'fa-solid fa-bars';
      gsap.to(toggler.querySelector('i'), { rotation: 0, duration: 0.3 });
    });
  }
}

/* ============================================================
   13. BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  gsap.set(btn, { opacity: 0, y: 20, visibility: 'hidden' });
  ScrollTrigger.create({
    trigger: 'body', start: 'top -400px',
    onEnter:     () => gsap.to(btn, { opacity: 1, y: 0, visibility: 'visible', duration: 0.4 }),
    onLeaveBack: () => gsap.to(btn, { opacity: 0, y: 20, visibility: 'hidden',  duration: 0.4 }),
  });
  btn.addEventListener('click', (e) => { e.preventDefault(); gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'power3.inOut' }); });
  btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.15, duration: 0.25 }));
  btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1,    duration: 0.25 }));
}

/* ============================================================
   14. PARTNERS MARQUEE
   ============================================================ */
function initMarquee() {
  const list = document.querySelector('.partners-list');
  if (!list) return;
  list.style.animation = 'none';
  const half = list.scrollWidth / 2;
  gsap.to(list, {
    x: -half, duration: 30, ease: 'none', repeat: -1,
    modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % half) },
  });
  list.addEventListener('mouseenter', () => gsap.globalTimeline.timeScale(0.1));
  list.addEventListener('mouseleave', () => gsap.globalTimeline.timeScale(1));
}

/* ============================================================
   15. SCROLL PROGRESS LINE
   ============================================================ */
function initScrollProgress() {
  const line = document.createElement('div');
  line.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,#F7931A,#F2A900);z-index:9999;pointer-events:none;box-shadow:0 0 8px rgba(247,147,26,0.8)';
  document.body.appendChild(line);
  gsap.to(line, { width: '100%', ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
}

/* ============================================================
   16. TOAST + FORMS
   ============================================================ */
function showToast(msg, isError = false) {
  const old = document.querySelector('.toast-container');
  if (old) gsap.to(old, { opacity: 0, y: 20, duration: 0.3, onComplete: () => old.remove() });
  const container = document.createElement('div');
  container.className = 'toast-container';
  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.style.borderColor = isError ? 'rgba(255,107,107,0.4)' : 'rgba(242,169,0,0.4)';
  toast.innerHTML = `<i class="fa-solid fa-${isError ? 'circle-xmark' : 'circle-check'}" style="color:${isError ? '#ff6b6b' : '#F2A900'}"></i> ${msg}`;
  container.appendChild(toast);
  document.body.appendChild(container);
  gsap.fromTo(container, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(2)' });
  gsap.to(container, { y: 20, opacity: 0, duration: 0.4, delay: 3.5, onComplete: () => container.remove() });
}

document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
  showToast('🎉 Successfully subscribed to Bitcoin updates!');
  e.target.querySelector('input').value = '';
});

document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  gsap.fromTo(btn, { scale: 0.96 }, { scale: 1, duration: 0.5, ease: 'elastic.out(2,0.5)' });
  showToast("✅ Message sent! We'll get back to you shortly.");
  e.target.reset();
});

/* ============================================================
   17. COIN GLOW (CSS coin fallback)
   ============================================================ */
function initCoinGlow() {
  const c = document.querySelector('.coin-center');
  if (!c) return;
  gsap.to(c, { boxShadow: '0 0 90px rgba(247,147,26,0.9)', duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
}

/* ============================================================
   18. INIT ALL
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeroParallax();
  initNavbar();
  initBackToTop();
  initMagneticButtons();
  initTilt();
  initScrollProgress();
  initCoinGlow();
  setTimeout(initMarquee, 500);
});

window.addEventListener('resize', () => {
  clearTimeout(window._st);
  window._st = setTimeout(() => ScrollTrigger.refresh(), 250);
});
