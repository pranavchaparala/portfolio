// components.js

const worksData = [
    { title: "Echoes of Presence", img: "echoesofpresence.png", link: "projects/echoes-of-presence/index.html" },
    { title: "ClanX", img: "clanx.png", link: "projects/clanx/index.html" },
    { title: "Lectrix EV", img: "lectrix.png", link: "projects/lectrix/index.html" },
    { title: "Nosie: Luna Ring", img: "lunaring.png", link: "projects/lunaring/index.html" },
    { title: "Noise: View Buds", img: "echoesofpresence.png", link: "projects/viewbuds/index.html" },
    { title: "OxygenOS 12", img: "lectrix.png", link: "projects/oxygen/index.html" },
    { title: "Gudz Logistics", img: "echoesofpresence.png", link: "projects/gudz/index.html" },
    { title: "Bezapp", img: "clanx.png", link: "projects/bezapp/index.html" },
    { title: "Inka", img: "lectrix.png", link: "projects/inka/index.html" },
    { title: "SĀR Rise Collection", img: "lunaring.png", link: "projects/sar/index.html" }
];

const getBasePath = () => {
    return window.location.pathname.includes('/projects/') ? '../../' : './';
};

const basePath = getBasePath();

function injectNavigation() {
    // Determine active links based on current path
    const pathname = window.location.pathname;
    const isIndex = (pathname.endsWith('index.html') || pathname.endsWith('/') || pathname === '') && !pathname.includes('/projects/');
    const isWork = window.location.pathname.endsWith('work.html');
    const isPlay = window.location.pathname.endsWith('play.html');
    const isResearch = window.location.pathname.endsWith('research.html');
    const isAbout = window.location.pathname.endsWith('about.html');
    const isContact = window.location.pathname.endsWith('contact.html');
    const isProject = window.location.pathname.includes('/projects/');

    if (isProject) return; // Hide/avoid injecting navbar in project pages

    // Default brand to active link styling, otherwise regular style
    const brandClass = isIndex ? 'active-link' : 'brand';
    const inlineStyle = isIndex ? 'opacity: 0;' : '';

    const navHTML = `
        <nav class="main-nav" style="${inlineStyle}">
            <a href="${basePath}index.html" class="${brandClass}">Pranav Chaparala</a>
            <a href="${basePath}play.html" class="${isPlay ? 'active-link' : ''}">Play</a>
            <a href="${basePath}research.html" class="${isResearch ? 'active-link' : ''}">Research</a>
            <a href="${basePath}about.html" class="${isAbout ? 'active-link' : ''}">About</a>
            <a href="${basePath}contact.html" class="${isContact ? 'active-link' : ''}">Contact</a>
        </nav>
    `;
    document.body.insertAdjacentHTML('beforeend', navHTML);
}

function setupTransitions() {
    // Add page transition overlay to body
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    // Initial load transition
    window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
    });

    // In case load already fired
    if (document.readyState === 'complete') {
        document.body.classList.add('page-loaded');
    }

    // Handle link clicks
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
            }, 600); // Duration of out transition
        }
    });
}

function initWorksTrack() {
    const stage = document.getElementById('stage');
    if (!stage) return;

    // Ensure GSAP is loaded before attempting animation
    if (typeof gsap === 'undefined') return;

    const bgBlur = document.getElementById('bg-blur');
    const bgImg = document.getElementById('bg-img');

    let blurEnabled = false;
    const VW = window.innerWidth;
    const VH = window.innerHeight;

    const N = worksData.length;
    const GAP = 0;

    // Responsive sizing helpers based on viewport
    const isMobile = VW <= 768;
    const isTablet = VW <= 1024;

    let pWidth = 255, lWidth = 390;
    if (isMobile) { pWidth = 153; lWidth = 234; }
    else if (isTablet) { pWidth = 170; lWidth = 260; }

    const sh = i => i % 2 === 0 ? 'p' : 'l';
    const w = i => sh(i) === 'p' ? pWidth : lWidth;

    const cycleW = worksData.reduce((sum, _, i) => sum + w(i) + GAP, 0);
    const numReps = Math.ceil((VW * 3) / cycleW) + 2;

    const cards = [];
    for (let r = 0; r < numReps; r++) {
        worksData.forEach((work, i) => {
            const gi = r * N + i;
            const card = document.createElement('div');
            card.className = `card ${sh(gi)}`;
            card.innerHTML = `<div class="pan"><img src="${basePath + 'covers/' + work.img}" alt="${work.title}" class="project-img"></div>`;
            card.dataset.workIdx = i;
            // Add a global lock flag at the top of your function ideally, but we can stick it onto the parent scope for the carousel. Actually let's use document.body class for global lock.

            card.addEventListener('mouseenter', () => {
                if (!blurEnabled || document.body.classList.contains('project-opening')) return;
                bgImg.src = `${basePath + 'covers/' + work.img}`;
                bgBlur.style.opacity = '0.4';
                cards.forEach(c => {
                    if (c !== card) c.classList.add('dimmed');
                });
            });
            card.addEventListener('mouseleave', () => {
                if (!blurEnabled || document.body.classList.contains('project-opening')) return;
                bgBlur.style.opacity = '0';
                cards.forEach(c => c.classList.remove('dimmed'));
            });
            card.addEventListener('click', (e) => {
                if (document.body.classList.contains('project-opening')) return;
                const ci = cards.indexOf(card);
                vel = 0; // stop scroll momentum
                const targetOffset = VW / 2 - (cardX[ci] + w(ci % N) / 2);
                let proxy = { o: offset };

                gsap.to(proxy, {
                    o: targetOffset,
                    duration: 0.7,
                    ease: 'power3.out',
                    onUpdate: () => { offset = proxy.o; },
                    onComplete: () => {
                        // Lock the hover state securely
                        document.body.classList.add('project-opening');
                        cards.forEach(c => {
                            if (c !== card) {
                                c.classList.add('dimmed');
                            } else {
                                c.classList.remove('dimmed');
                                c.classList.add('clicked-active');
                                // Force 100% opacity natively on the container and the pan internal
                                c.style.setProperty('opacity', '1', 'important');
                                const pan = c.querySelector('.pan');
                                if (pan) pan.style.setProperty('opacity', '1', 'important');
                            }
                        });

                        // After centered, short delay before triggering route
                        setTimeout(() => {
                            document.body.classList.remove('page-loaded');
                            document.body.classList.add('page-leaving');
                            setTimeout(() => {
                                window.location.href = basePath + work.link;
                            }, 600); // UI transition duration
                        }, 200); // Short delay
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
        x += w(i % N) + GAP;
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
            if (pan) pan.style.transform = `translateX(${(cx + w(i % N) / 2 - VW / 2) * 0.08}px)`;
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

    let vel = 0;
    let spinning = false;

    function revealCarousel(instant = false) {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);

        const sorted = cards
            .filter(c => c !== heroCard)
            .sort((a, b) => {
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
                onComplete() {
                    spinning = true;
                    blurEnabled = true;
                }
            });
        }

        const mainNav = document.querySelector('.main-nav');
        if (mainNav) gsap.to(mainNav, { opacity: 1, duration: instant ? 0 : 0.8 });
        const footer = document.querySelector('footer');
        if (footer) gsap.to(footer, { opacity: 1, duration: instant ? 0 : 0.8 });

        // Hide the page content dissolve animation so it doesn't conflict
        const content = document.querySelector('.page-content');
        if (content) content.style.opacity = '1';
    }

    const hasVisited = sessionStorage.getItem('portfolio_visited');

    if (!hasVisited) {
        sessionStorage.setItem('portfolio_visited', 'true');

        const fakes = worksData.map((work, i) => {
            const f = document.createElement('div');
            f.className = `fake ${sh(i)}`;
            f.style.zIndex = 100 + i;
            if (isMobile) {
                f.style.width = sh(i) === 'p' ? '153px' : '234px';
                f.style.height = sh(i) === 'p' ? '216px' : '153px';
                f.style.marginLeft = sh(i) === 'p' ? '-76px' : '-117px';
                f.style.marginTop = sh(i) === 'p' ? '-108px' : '-76px';
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
            opacity: 0, duration: 0.4,
            stagger: { each: 0.04, from: 'start' },
            ease: 'power2.in'
        }, seqEnd + 0.3)
            .to(fakes[N - 1], {
                opacity: 0, duration: 0.5,
                ease: 'power2.in'
            });
    } else {
        // Immediately reveal without GSAP animation on re-visits
        revealCarousel(true);
    }

    window.addEventListener('wheel', e => { if (spinning) vel += e.deltaY * 0.05; });

    const BUFFER = 600;

    (function loop() {
        requestAnimationFrame(loop);
        if (!spinning) return;

        vel *= 0.90;
        offset -= vel;

        cards.forEach((c, i) => {
            let cx = cardX[i] + offset;
            if (cx + w(i % N) < -BUFFER) {
                cardX[i] += totalW + GAP;
            }
            if (cx > VW + BUFFER) {
                cardX[i] -= totalW + GAP;
            }
        });

        let closestCard = null;
        let minDiff = Infinity;

        cards.forEach((c, i) => {
            const cx = cardX[i] + offset;
            const mid = cx + w(i % N) / 2;
            const diff = Math.abs(mid - VW / 2);
            if (diff < minDiff) {
                minDiff = diff;
                closestCard = c;
            }

            c.style.left = cx + 'px';
            const pan = c.querySelector('.pan');
            if (pan) pan.style.transform = `translateX(${(cx + w(i % N) / 2 - VW / 2) * 0.08}px)`;
        });

        if (closestCard && isMobile) {
            const workIdx = parseInt(closestCard.dataset.workIdx);
            const work = worksData[workIdx];
            if (titleEl.textContent !== work.title) {
                titleEl.textContent = work.title;
            }
        }
    }());

    // Start clock
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
        a.textContent = work.title;

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
            if (hoverContainer) {
                hoverContainer.classList.remove('active');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    injectNavigation();
    setupTransitions();
    initWorksTrack();
    initWorksList();
});
