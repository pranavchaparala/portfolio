// components.js

// Ensure projects.js is included before components.js so projectsData is available.
const worksData = typeof projectsData !== 'undefined' ? projectsData : [];

const getBasePath = () => {
    const p = window.location.pathname;
    if (p.includes('/projects/')) return '../../';
    const subpages = ['/work/', '/play/', '/about/', '/contact/', '/research/'];
    if (subpages.some(page => p.includes(page))) return '../';
    return './';
};

const basePath = getBasePath();

function injectNavigation() {
    const pathname = window.location.pathname;
    const isIndex = (pathname.endsWith('index.html') || pathname.endsWith('/') || pathname === '' || pathname.endsWith('portfolioagain')) && !pathname.includes('/projects/') && !pathname.includes('/work/') && !pathname.includes('/play/') && !pathname.includes('/about/');
    const isWork = pathname.includes('/work/');
    const isPlay = pathname.includes('/play/');
    const isResearch = pathname.includes('/research/');
    const isAbout = pathname.includes('/about/');
    const isContact = pathname.includes('/contact/');
    const isProject = window.location.pathname.includes('/projects/');

    if (isProject) return; 

    const brandClass = isIndex ? 'active-link' : 'brand';
    const inlineStyle = isIndex ? 'opacity: 0;' : '';

    const navHTML = `
        <div id="hamburger-btn">
            <div class="bar"></div>
            <div class="bar"></div>
        </div>
        <div id="mobile-nav-overlay">
            <nav class="mobile-nav-links">
                <a href="${basePath}index.html" class="${isIndex ? 'active-link' : ''}">Pranav Chaparala</a>
                <a href="${basePath}work/index.html" class="${isWork ? 'active-link' : ''}">Work</a>
                <a href="${basePath}play/index.html" class="${isPlay ? 'active-link' : ''}">Play</a>
                <a href="${basePath}about/index.html" class="${isAbout ? 'active-link' : ''}">About</a>
            </nav>
        </div>
        <nav class="main-nav desktop-only" style="${inlineStyle}">
            <a href="${basePath}index.html" class="${brandClass}">Pranav Chaparala</a>
            <a href="${basePath}work/index.html" class="${isWork ? 'active-link' : ''}">Work</a>
            <a href="${basePath}play/index.html" class="${isPlay ? 'active-link' : ''}">Play</a>
            <a href="${basePath}about/index.html" class="${isAbout ? 'active-link' : ''}">About</a>        
        </nav>
    `;
    document.body.insertAdjacentHTML('beforeend', navHTML);

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('mobile-nav-overlay');
    if (hamburgerBtn && overlay) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            overlay.classList.toggle('open');
            if (overlay.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
}

function setupTransitions() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
    });

    if (document.readyState === 'complete') {
        document.body.classList.add('page-loaded');
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        const href = link ? link.getAttribute('href') : null;

        if (link && href && !href.startsWith('#') && link.target !== '_blank') {
            e.preventDefault();
            const targetUrl = link.href;
            document.body.classList.remove('page-loaded');
            document.body.classList.add('page-leaving');
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 600);
        }
    });
}

function initWorksTrack() {
    const stage = document.getElementById('stage');
    if (!stage) return;

    // Initialize hover sound
    const hoverSound = new Audio(basePath + 'hover.mp3');
    hoverSound.preload = 'auto';

    if (typeof gsap === 'undefined') return;

    const bgBlur = document.getElementById('bg-blur');
    const bgImg = document.getElementById('bg-img');

    let blurEnabled = false;
    const VW = window.innerWidth;
    const VH = window.innerHeight;

    const carouselWorks = worksData.slice(0, 6);
    const N = carouselWorks.length;
    const GAP = 0;

    const isMobile = VW <= 768;
    const isTablet = VW <= 1024;

    let pWidth = 280, lWidth = 390;
    if (isMobile) { pWidth = 230; lWidth = 315; }
    else if (isTablet) { pWidth = 200; lWidth = 260; }

    const sh = i => (i % N) % 2 === 0 ? 'p' : 'l';
    const w = i => sh(i) === 'p' ? pWidth : lWidth;

    const h = i => {
        if (sh(i) === 'p') {
            if (isMobile) return 325;
            if (isTablet) return 282;
            return 395;
        } else {
            if (isMobile) return 206;
            if (isTablet) return 170;
            return 255;
        }
    };

    const cycleW = carouselWorks.reduce((sum, _, i) => sum + w(i) + GAP, 0);
    const numReps = Math.ceil((VW * 3) / cycleW) + 2;

    const cards = [];
    for (let r = 0; r < numReps; r++) {
        carouselWorks.forEach((work, i) => {
            const gi = r * N + i;
            const card = document.createElement('div');
            card.className = `card ${sh(i)}`;
            card.style.width = w(i) + 'px';
            card.style.height = h(i) + 'px';
            card.innerHTML = `<div class="pan"><img src="${basePath + 'covers/' + work.img}" alt="${work.title}" class="project-img"></div>`;
            card.dataset.workIdx = i;

            card.addEventListener('mouseenter', () => {
                if (!blurEnabled || document.body.classList.contains('project-opening')) return;

                // Play hover sound
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => { /* Blocked until first interaction */ });

                // Update project title for desktop
                if (!isMobile) {
                    titleEl.innerHTML = `<div class="project-subheading">Selected Work</div>${work.title}`;
                    gsap.to(titleEl, { opacity: 1, duration: 0.15 });
                }

                bgImg.src = `${basePath + 'covers/' + work.img}`;
                bgBlur.style.opacity = '0.4';
                cards.forEach(c => {
                    if (c !== card) c.classList.add('dimmed');
                });
            });
            card.addEventListener('mouseleave', () => {
                if (!blurEnabled || document.body.classList.contains('project-opening')) return;
                
                if (!isMobile) {
                    gsap.to(titleEl, { opacity: 0, duration: 0.15 });
                }

                bgBlur.style.opacity = '0';
                cards.forEach(c => c.classList.remove('dimmed'));
            });
            card.addEventListener('click', (e) => {
                if (document.body.classList.contains('project-opening')) return;
                const ci = cards.indexOf(card);
                vel = 0;
                const targetOffset = VW / 2 - (cardX[ci] + w(ci % N) / 2);
                let proxy = { o: offset };

                gsap.to(proxy, {
                    o: targetOffset,
                    duration: 0.7,
                    ease: 'power3.out',
                    onUpdate: () => { offset = proxy.o; },
                    onComplete: () => {
                        document.body.classList.add('project-opening');
                        cards.forEach(c => {
                            if (c !== card) {
                                c.classList.add('dimmed');
                            } else {
                                c.classList.remove('dimmed');
                                c.classList.add('clicked-active');
                                c.style.setProperty('opacity', '1', 'important');
                                const pan = c.querySelector('.pan');
                                if (pan) pan.style.setProperty('opacity', '1', 'important');
                            }
                        });
                        setTimeout(() => {
                            document.body.classList.remove('page-loaded');
                            document.body.classList.add('page-leaving');
                            setTimeout(() => {
                                window.location.href = basePath + work.link;
                            }, 600);
                        }, 200);
                    }
                });
            });
            stage.appendChild(card);
            cards.push(card);
        });
    }

    let x = 0;
    const cardX = cards.map((c, i) => {
        const cx = x;
        x += w(i) + GAP;
        return cx;
    });
    const totalW = x - GAP;

    const midRep = Math.floor(numReps / 2);
    const heroIdx = midRep * N + (N - 1);
    const heroCard = cards[heroIdx];
    const heroMid = cardX[heroIdx] + w(heroIdx % N) / 2;
    let offset = VW / 2 - heroMid;

    function applyPositions() {
        cards.forEach((c, i) => {
            const cx = cardX[i] + offset;
            c.style.left = cx + 'px';
            const pan = c.querySelector('.pan');
            if (pan) pan.style.transform = `translateX(${(cx + w(i % N) / 2 - VW / 2) * 0.01}px)`;
        });
    }
    applyPositions();

    heroCard.style.opacity = '1';

    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.appendChild(overlay);

    const titleEl = document.createElement('div');
    titleEl.id = 'active-project-title';
    document.body.appendChild(titleEl);

    if (isMobile) {
        const heroWork = carouselWorks[heroIdx % N];
        titleEl.dataset.currentTitle = heroWork.title;
        titleEl.innerHTML = `<div class="project-subheading">Selected Work</div>${heroWork.title}`;
        bgImg.src = `${basePath + 'covers/' + heroWork.img}`;
    } else {
        // Desktop initial state
        gsap.set(titleEl, { opacity: 0 });
    }

    let vel = 0;
    let spinning = false;

    function revealCarousel(instant = false) {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        const sorted = cards.filter(c => c !== heroCard).sort((a, b) => {
            const ai = cards.indexOf(a);
            const bi = cards.indexOf(b);
            return Math.abs(ai - heroIdx) - Math.abs(bi - heroIdx);
        });

        if (instant) {
            gsap.set(cards, { opacity: 1 });
            spinning = true;
            blurEnabled = true;
        } else {
            gsap.to(sorted, {
                opacity: 1, duration: 0.6, stagger: 0.03, ease: 'power2.out',
                onComplete() { spinning = true; blurEnabled = true; }
            });
        }

        const mainNav = document.querySelector('.main-nav');
        const hamburgerBtn = document.getElementById('hamburger-btn');
        if (mainNav) gsap.to(mainNav, { opacity: 1, duration: instant ? 0 : 0.8 });
        if (hamburgerBtn) gsap.to(hamburgerBtn, { opacity: 1, duration: instant ? 0 : 0.8 });
        
        const footer = document.querySelector('footer');
        if (footer) gsap.to(footer, { opacity: 1, duration: instant ? 0 : 0.8 });
    }

    const hasVisited = sessionStorage.getItem('portfolio_visited');

    if (!hasVisited) {
        sessionStorage.setItem('portfolio_visited', 'true');
        const fakes = carouselWorks.map((work, i) => {
            const f = document.createElement('div');
            f.className = `fake ${sh(i)}`;
            f.style.zIndex = 100 + i;
            if (isMobile) {
                f.style.width = sh(i) === 'p' ? '210px' : '315px';
                f.style.height = sh(i) === 'p' ? '296px' : '210px';
                f.style.marginLeft = sh(i) === 'p' ? '-105px' : '-157px';
                f.style.marginTop = sh(i) === 'p' ? '-148px' : '-105px';
            } else if (isTablet) {
                f.style.width = sh(i) === 'p' ? '170px' : '260px';
                f.style.height = sh(i) === 'p' ? '240px' : '170px';
                f.style.marginLeft = sh(i) === 'p' ? '-85px' : '-130px';
                f.style.marginTop = sh(i) === 'p' ? '-120px' : '-85px';
            }
            f.innerHTML = `<div class="pan"><img src="${basePath + 'covers/' + work.img}" alt="${work.title}"></div>`;
            overlay.appendChild(f);
            return f;
        });

        const tl = gsap.timeline({ onComplete: () => revealCarousel(false) });
        const STEP = 0.20, IN = 0.50, HOLD = 0.10, OUT = 0.28;

        fakes.forEach((f, i) => {
            const t = i * STEP;
            tl.to(f, { scale: 1.02, duration: IN, ease: 'power3.out' }, t)
              .to(f, { scale: 1.0, duration: OUT, ease: 'power2.inOut' }, t + IN + HOLD);
        });

        const seqEnd = (N - 1) * STEP + IN + HOLD + OUT;
        tl.to(fakes.slice(0, -1), {
            opacity: 0, duration: 0.4, stagger: { each: 0.04, from: 'start' }, ease: 'power2.in'
        }, seqEnd + 0.3)
        .to(fakes[N - 1], { opacity: 0, duration: 0.5, ease: 'power2.in' });
    } else {
        revealCarousel(true);
    }

    window.addEventListener('wheel', e => { if (spinning) vel += e.deltaY * 0.05; });

    let touchStartX = 0;
    let touchStartY = 0;
    window.addEventListener('touchstart', e => {
        if (!spinning) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, {passive: true});

    window.addEventListener('touchmove', e => {
        if (!spinning) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const dx = touchStartX - currentX;
        const dy = touchStartY - currentY;
        
        vel += (dx + dy) * 0.15;
        
        touchStartX = currentX;
        touchStartY = currentY;
    }, {passive: true});

    const BUFFER = 600;
    (function loop() {
        requestAnimationFrame(loop);
        if (!spinning) return;
        vel *= 0.90;
        offset -= vel;
        cards.forEach((c, i) => {
            let cx = cardX[i] + offset;
            if (cx + w(i) < -BUFFER) cardX[i] += totalW + GAP;
            if (cx > VW + BUFFER) cardX[i] -= totalW + GAP;
        });
        let closestCard = null;
        let minDiff = Infinity;
        cards.forEach((c, i) => {
            const cx = cardX[i] + offset;
            const cw = w(i);
            const mid = cx + cw / 2;
            const diff = Math.abs(mid - VW / 2);
            if (diff < minDiff) { minDiff = diff; closestCard = c; }
            c.style.left = cx + 'px';
            const pan = c.querySelector('.pan');
            if (pan) pan.style.transform = `translateX(${(cx + cw / 2 - VW / 2) * 0.01}px)`;
        });
        if (closestCard && isMobile) {
            const workIdx = parseInt(closestCard.dataset.workIdx);
            const work = carouselWorks[workIdx];
            if (titleEl.dataset.currentTitle !== work.title) {
                titleEl.dataset.currentTitle = work.title;
                titleEl.innerHTML = `<div class="project-subheading">Selected Work</div>${work.title}`;
                
                // Update background for mobile since hover is disabled
                bgImg.src = `${basePath + 'covers/' + work.img}`;
                bgBlur.style.opacity = '0.2';
            }
        }
    }());

    setInterval(() => {
        const clk = document.getElementById('clock');
        if (clk) clk.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
    }, 1000);
}

function initWorksList() {
    const listContainer = document.querySelector('#work-list ul');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    const hoverContainer = document.getElementById('hover-image-container');
    const hoverImg = document.getElementById('hover-preview');
    const hoverBg = document.getElementById('hover-bg-blur');

    worksData.forEach(work => {
        const li = document.createElement('li');
        li.setAttribute('data-img', work.img);
        const a = document.createElement('a');
        a.href = basePath + work.link;
        
        // Add image for mobile (hidden on desktop via css)
        const coverImg = document.createElement('img');
        coverImg.src = basePath + 'covers/' + work.img;
        coverImg.className = 'mobile-work-cover';
        a.appendChild(coverImg);
        
        const textSpan = document.createElement('span');
        textSpan.className = 'work-title';
        textSpan.textContent = work.title;
        a.appendChild(textSpan);

        li.appendChild(a);
        listContainer.appendChild(li);

        a.addEventListener('mouseenter', () => {
            const imgName = li.getAttribute('data-img');
            if (imgName && hoverImg && hoverBg && hoverContainer) {
                const fullPath = basePath + 'covers/' + imgName;
                hoverImg.src = fullPath;
                hoverBg.src = fullPath;
                hoverContainer.classList.add('active');
            }
        });
        a.addEventListener('mouseleave', () => {
            if (hoverContainer) hoverContainer.classList.remove('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    injectNavigation();
    setupTransitions();
    initWorksTrack();
    initWorksList();

    // AUDIO UNLOCKER: Captures the very first interaction to enable hover sounds
    const unlockAudio = () => {
        const silentAudio = new Audio();
        silentAudio.play().then(() => {
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('wheel', unlockAudio);
        }).catch(() => {});
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('wheel', unlockAudio);
});