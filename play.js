<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Playground | Pranav Chaparala</title>
<style>

/* ── RESET & BASE (mirrors style.css exactly) ──────────────── */
* {
  margin: 0; padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  cursor: none;
}
body {
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  font-size: 18px;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
#cursor-dot {
  width: 12px; height: 12px;
  border: 1.5px solid #000;
  background: transparent;
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  transition:
    width  0.25s cubic-bezier(0.16,1,0.3,1),
    height 0.25s cubic-bezier(0.16,1,0.3,1),
    background-color 0.2s ease,
    border-color 0.2s ease;
}
body.cursor-ready #cursor-dot { background: #000; }
body.cursor-hover #cursor-dot { width: 8px; height: 8px; }

/* ── NAVBAR (matches style.css) ───────────────────────────── */
.main-nav {
  position: fixed;
  top: 65%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 32px;
  z-index: 10000;
  transition: opacity 0.4s ease, pointer-events 0.4s;
}
.main-nav a {
  text-decoration: none;
  color: #000;
  font-size: 18px;
  font-weight: 400;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}
.main-nav a:hover { opacity: 0.4; }
.active-link {
  text-decoration: underline !important;
  text-underline-offset: 4px;
}
body.popup-open .main-nav {
  opacity: 0;
  pointer-events: none;
}

/* ── PAGE DISSOLVE (matches style.css) ────────────────────── */
@keyframes contentDissolve {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
#scene {
  animation: contentDissolve 2.4s cubic-bezier(0.16,1,0.3,1) forwards;
}

/* ── SCENE ─────────────────────────────────────────────────── */
#scene {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 0 6px;
  overflow: hidden;
  transition: filter 0.5s ease;
  will-change: filter;
}
#scene.blurred {
  filter: blur(16px) brightness(0.45);
  transform: scale(1.02);
  transition: filter 0.5s ease, transform 0.5s ease;
}

/* ── COLUMN ────────────────────────────────────────────────── */
.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  will-change: transform;
  /* overflow deliberately not hidden — cropping is handled by scene */
}

/* ── CARD ──────────────────────────────────────────────────── */
.card {
  width: 100%;
  aspect-ratio: 3 / 4;
  flex-shrink: 0;
  background: #f0f0f0;
  overflow: hidden;
  position: relative;
  cursor: none;
}
.card-media {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  transition: transform 0.5s cubic-bezier(0.16,1,0.3,1),
              opacity 0.3s ease;
  opacity: 0.82;
}
.card:hover .card-media {
  transform: scale(1.05);
  opacity: 1;
}
.card-label {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 36px 10px 10px;
  background: linear-gradient(to top, rgba(0,0,0,0.58) 0%, transparent 100%);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.88);
  font-weight: 400;
  opacity: 0;
  transition: opacity 0.22s ease;
}
.card:hover .card-label { opacity: 1; }

/* ── POPUP ─────────────────────────────────────────────────── */
#popup {
  position: fixed;
  inset: 0;
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.42s ease;
}
#popup.active {
  opacity: 1;
  pointer-events: auto;
}

.popup-inner {
  width: min(460px, 88vw);
  background: #fff;
  border-top: 1.5px solid #000;
  transform: translateY(22px);
  transition: transform 0.48s cubic-bezier(0.16,1,0.3,1);
}
#popup.active .popup-inner { transform: translateY(0); }

.popup-img-wrap {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #f0f0f0;
}
.popup-img-wrap img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}

.popup-body {
  padding: 26px 30px 30px;
}
.popup-meta {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #919191;
  margin-bottom: 10px;
}
.popup-title {
  font-size: 20px;
  font-weight: 500;
  color: #000;
  line-height: 1.22;
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}
.popup-desc {
  font-size: 14px;
  font-weight: 400;
  color: #555;
  line-height: 1.7;
}
.popup-hint {
  margin-top: 26px;
  padding-top: 18px;
  border-top: 1px solid #ebebeb;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #b8b8b8;
  display: flex;
  align-items: center;
  gap: 10px;
}
.popup-hint::before {
  content: '';
  width: 14px; height: 1px;
  background: #c8c8c8;
  display: block;
  flex-shrink: 0;
}

/* Mobile */
@media (max-width: 768px) {
  .main-nav {
    gap: 16px !important;
    flex-wrap: wrap !important;
    width: 90vw !important;
    justify-content: center !important;
  }
  * { cursor: auto !important; }
  #cursor-dot { display: none; }
}

</style>
</head>
<body>

<div id="cursor-dot"></div>

<nav class="main-nav">
  <a href="index.html" class="brand">Pranav Chaparala</a>
  <a href="play.html" class="active-link">Play</a>
  <a href="research.html">Research</a>
  <a href="about.html">About</a>
  <a href="contact.html">Contact</a>
</nav>

<div id="scene"></div>

<div id="popup">
  <div class="popup-inner">
    <div class="popup-img-wrap" id="popup-media"></div>
    <div class="popup-body">
      <div class="popup-meta">Playground</div>
      <h2 class="popup-title" id="popup-title"></h2>
      <p  class="popup-desc"  id="popup-desc"></p>
      <div class="popup-hint">Click anywhere to return</div>
    </div>
  </div>
</div>

<script src="playgroundData.js"></script>
<script>
// playgroundData is now loaded from playgroundData.js
// Expected shape per item: { title, description, filename, videoFilename? }
// filename = thumbnail (image or muted looping .mp4)
// videoFilename = optional full audio video shown in popup

// ── CONFIG ────────────────────────────────────────────────────
// Responsive column count based on viewport width
function getColCount() {
  const w = window.innerWidth;
  if (w >= 1400) return 8;
  if (w >= 1100) return 6;
  if (w >= 768)  return 5;
  if (w >= 520)  return 4;
  if (w >= 360)  return 3;
  return 2;
}

const GAP        = 12;
const FRICTION   = 0.70;   // higher = slower coast after scroll
const SCROLL_IN  = 0.08;   // overall input sensitivity (lower = slower movement)
const SLOW_MULT  = 1.0;    // odd columns  — base speed
const FAST_MULT  = 1.25;   // even columns — slightly faster

// ── BUILD COLUMNS ─────────────────────────────────────────────
const scene   = document.getElementById('scene');
let colEls    = [];
let offsets   = [];
let COLS      = getColCount();

function buildGrid() {
  // Tear down old columns
  scene.innerHTML = '';
  colEls  = [];
  offsets = [];
  COLS    = getColCount();

  const colData = Array.from({ length: COLS }, () => []);
  playgroundData.forEach((item, i) => colData[i % COLS].push(item));

  colData.forEach((items, ci) => {
    const col = document.createElement('div');
    col.className = 'col';

    // Pad then triple for seamless infinite loop
    let pool = [...items];
    while (pool.length < 8) pool = [...pool, ...items];
    const tripled = [...pool, ...pool, ...pool];

    tripled.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.title    = item.title        || '';
      card.dataset.desc     = item.description  || '';
      card.dataset.filename = item.filename     || '';
      card.dataset.video    = item.videoFilename || '';

      const assetPath = `playgroundassets/${item.filename}`;
      const isVideo   = item.filename && item.filename.toLowerCase().endsWith('.mp4');

      if (isVideo) {
        // Muted looping video as the card thumbnail
        const vid = document.createElement('video');
        vid.src         = assetPath;
        vid.autoplay    = true;
        vid.loop        = true;
        vid.muted       = true;
        vid.playsInline = true;
        vid.className   = 'card-media';
        card.appendChild(vid);
      } else {
        const img     = document.createElement('img');
        img.src       = assetPath;
        img.alt       = item.title || '';
        img.loading   = 'lazy';
        img.className = 'card-media';
        img.onerror   = function() {
          this.onerror = null;
          this.src = `https://picsum.photos/seed/${encodeURIComponent(item.filename || Math.random())}/400/533`;
        };
        card.appendChild(img);
      }

      const lbl       = document.createElement('div');
      lbl.className   = 'card-label';
      lbl.textContent = item.title || '';
      card.appendChild(lbl);

      card.addEventListener('click', openPopup);
      col.appendChild(card);
    });

    offsets.push(0);
    colEls.push(col);
    scene.appendChild(col);

    // Re-attach cursor hover listeners for new cards
    col.querySelectorAll('.card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  });

  // Stagger so odd columns start visually offset
  requestAnimationFrame(() => requestAnimationFrame(() => {
    colEls.forEach((col, ci) => {
      const oneSet = col.scrollHeight / 3;
      offsets[ci] = (ci % 2 === 0) ? -(oneSet * 0.08) : -(oneSet * 0.42);
      col.style.transform = `translateY(${offsets[ci]}px)`;
    });
  }));
}

buildGrid();

// Rebuild on resize (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (getColCount() !== COLS) buildGrid();
  }, 200);
});

// ── SCROLL PHYSICS ────────────────────────────────────────────
let velocity = 0;
let rafId    = null;

window.addEventListener('wheel', (e) => {
  e.preventDefault();
  velocity += e.deltaY * SCROLL_IN;
  if (!rafId) rafId = requestAnimationFrame(tick);
}, { passive: false });

// Touch
let touchY = 0;
window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchmove',  e => {
  const dy = touchY - e.touches[0].clientY;
  touchY = e.touches[0].clientY;
  velocity += dy * SCROLL_IN * 1.4;
  if (!rafId) rafId = requestAnimationFrame(tick);
}, { passive: true });

function tick() {
  if (Math.abs(velocity) < 0.03) {
    velocity = 0; rafId = null; return;
  }

  colEls.forEach((col, ci) => {
    // All columns move in the SAME direction; alternates just move at different speeds
    // User requested 2nd and 4th rows (even index: 1, 3, etc.) to be slightly faster
    const mult = (ci % 2 !== 0) ? FAST_MULT : SLOW_MULT;
    offsets[ci] += velocity * mult;

    // Seamless wrap within tripled content
    const oneSet = col.scrollHeight / 3;
    if (offsets[ci] < -(oneSet * 2)) offsets[ci] += oneSet;
    if (offsets[ci] > 0)             offsets[ci] -= oneSet;

    col.style.transform = `translateY(${offsets[ci]}px)`;
  });

  velocity *= FRICTION;
  rafId = requestAnimationFrame(tick);
}

// ── POPUP ─────────────────────────────────────────────────────
const popup      = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const popupDesc  = document.getElementById('popup-desc');
const popupMedia = document.getElementById('popup-media');

function openPopup(e) {
  const card      = e.currentTarget;
  const filename  = card.dataset.filename;
  const videoFile = card.dataset.video;
  const assetPath = `playgroundassets/${filename}`;
  const isVideo   = filename && filename.toLowerCase().endsWith('.mp4');

  // Clear previous media
  popupMedia.innerHTML = '';

  // If there's a dedicated popup videoFilename, show that (with audio)
  // Otherwise show the thumbnail asset (image or muted video)
  if (videoFile) {
    const vid       = document.createElement('video');
    vid.src         = `playgroundassets/${videoFile}`;
    vid.autoplay    = true;
    vid.loop        = true;
    vid.muted       = false;
    vid.playsInline = true;
    vid.controls    = false;
    vid.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    popupMedia.appendChild(vid);
    vid.play().catch(() => { vid.muted = true; vid.play(); });
  } else if (isVideo) {
    const vid       = document.createElement('video');
    vid.src         = assetPath;
    vid.autoplay    = true;
    vid.loop        = true;
    vid.muted       = true;
    vid.playsInline = true;
    vid.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    popupMedia.appendChild(vid);
  } else {
    const img   = document.createElement('img');
    img.src     = assetPath;
    img.alt     = card.dataset.title;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.onerror = function() {
      this.onerror = null;
      this.src = `https://picsum.photos/seed/${encodeURIComponent(filename)}/640/480`;
    };
    popupMedia.appendChild(img);
  }

  popupTitle.textContent = card.dataset.title;
  popupDesc.textContent  = card.dataset.desc;
  scene.classList.add('blurred');
  popup.classList.add('active');
  document.body.classList.add('popup-open');
}

function closePopup() {
  popup.classList.remove('active');
  scene.classList.remove('blurred');
  document.body.classList.remove('popup-open');
  // Stop any video playing in popup
  popupMedia.querySelectorAll('video').forEach(v => { v.pause(); v.src = ''; });
}

// Click anywhere outside popup-inner closes it
popup.addEventListener('click', e => {
  if (!e.target.closest('.popup-inner')) closePopup();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });

// ── CUSTOM CURSOR ─────────────────────────────────────────────
const dot = document.getElementById('cursor-dot');
let mx = -200, my = -200, cx = -200, cy = -200;

window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function loop() {
  cx += (mx - cx) * 0.15;
  cy += (my - cy) * 0.15;
  dot.style.left = cx + 'px';
  dot.style.top  = cy + 'px';
  requestAnimationFrame(loop);
})();

setTimeout(() => document.body.classList.add('cursor-ready'), 200);

// Nav links cursor hover
document.querySelectorAll('a').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
</script>
</body>
</html>