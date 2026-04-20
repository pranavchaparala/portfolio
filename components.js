// components.js

// Ensure projects.js is included before components.js so projectsData is available.
const worksData = typeof projectsData !== 'undefined' ? projectsData : [];

const getBasePath = () => {
    const p = window.location.pathname;
    const isIndex = p.endsWith('index.html') || p.endsWith('/') || p === '';
    const isRoot = isIndex && !p.includes('/', 1) && !p.startsWith('/work/') && !p.startsWith('/play/') && !p.startsWith('/about/');
    
    // If it's the root index.html, assets are local
    if (isRoot) return './';
    
    // Everything else (moved projects, work, play, etc.) is now 1 level deep
    return '../';
};

const basePath = getBasePath();

// Global touch tracking for mobile interaction optimizations
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
}, { passive: true });

function injectAboutModal() {
    if (document.querySelector('.about-modal')) return;
    const modalHTML = `
        <div class="about-modal" onclick="closeAboutModal()">
            <button class="modal-close-btn" onclick="closeAboutModal()">Close [X]</button>
            <div class="about-content" onclick="event.stopPropagation()">
                <div class="two-col-text" style="align-items: flex-end; margin-bottom: 0;">
                    <div>
                        <h1>Pranav Chaparala</h1>
                        <p style="margin-bottom: 8px; font-size: 14px; line-height: 1.4;">Product Designer based in NYC currently pursuing an MFA in Design & Technology at Parsons School of Design.</p>
                        <p style="margin-bottom: 0; font-size: 14px; line-height: 1.4; opacity: 0.8;">My work focuses on the intersection of human-centered design and emerging technologies, striving to create seamless digital experiences that solve real-world problems.</p>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-end;">
                        <span class="meta-value" style="font-size: 14px;"><a href="mailto:pranavchaparala@gmail.com" style="color: inherit; text-decoration: none;">Email ↗</a></span>
                        <span class="meta-value" style="font-size: 14px;"><a href="https://drive.google.com/uc?export=download&id=1ry9SKoEx5cpskW3K9lFgc1BD4zF4ZJUA" target="_blank" style="color: inherit; text-decoration: none;">Resume ↗</a></span>
                        <span class="meta-value" style="font-size: 14px;"><a href="https://linkedin.com/in/pranavchaparala" target="_blank" style="color: inherit; text-decoration: none;">LinkedIn ↗</a></span>
                    </div>
                </div>

                <hr style="margin: 20px 0;">

                <div class="three-col-text">
                    <div>
                        <h2>Education</h2>
                        <p style="font-size: 13px; margin-bottom: 4px;"><b>Parsons School of Design</b><br>New York (2024 - 2026)</p>
                        <p style="font-size: 13px; margin-bottom: 0;"><b>NIFT</b><br>India (2019 - 2023)</p>
                    </div>
                    <div>
                        <h2>Work</h2>
                        <p style="font-size: 13px; margin-bottom: 4px;">DigitalOcean</p>
                        <p style="font-size: 13px; margin-bottom: 4px;">OnePlus</p>
                        <p style="font-size: 13px; margin-bottom: 4px;">Noise</p>
                        <p style="font-size: 13px; margin-bottom: 4px;">WTFRuchit Studios</p>
                        <p style="font-size: 13px; margin-bottom: 0;">SĀR Studio</p>
                    </div>
                    <div>
                        <h2>Recognition</h2>
                        <p style="font-size: 13px; margin-bottom: 4px;">NIFT Academy Award ‘23</p>
                        <p style="font-size: 13px; margin-bottom: 4px;">Meritorious Student ‘23</p>
                        <p style="font-size: 13px; margin-bottom: 4px;">Salesforce Design Days</p>
                        <p style="font-size: 13px; margin-bottom: 0;">Spectrum ‘22 Lead</p>
                    </div>
                </div>

                <p class="modal-hint" style="font-size: 9px; opacity: 0.3; margin-top: 40px; text-align: center; width: 100%;">Click anywhere outside to close</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

window.openAboutModal = function() {
    injectAboutModal();
    setTimeout(() => {
        document.querySelector('.about-modal').classList.add('active');
    }, 10);
};

window.closeAboutModal = function() {
    const modal = document.querySelector('.about-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

function injectNavigation() {
    const pathname = window.location.pathname;
    const isIndex = (pathname.endsWith('index.html') || pathname.endsWith('/') || pathname === '' || pathname.endsWith('portfolioagain')) && !pathname.includes('/projects/') && !pathname.includes('/work/') && !pathname.includes('/play/') && !pathname.includes('/about/');
    const isWork = pathname.includes('/work/');
    const isPlay = pathname.includes('/play/');
    const isResearch = pathname.includes('/research/');
    const isAbout = pathname.includes('/about/');
    const isContact = pathname.includes('/contact/');
    const isProject = window.location.pathname.includes('/projects/');

    const brandClass = isIndex ? 'active-link' : 'brand';
    const inlineStyle = isIndex ? 'opacity: 0;' : '';
    
    // Immediately display spatial navigation on non-index pages
    const spatialOpacityStyle = !isIndex ? 'opacity: 1 !important;' : 'opacity: 0;';

    const navHTML = `
        <nav class="mobile-spatial-nav mobile-only" style="${spatialOpacityStyle}">
            <a href="${basePath}index.html" class="nav-top-left ${isIndex ? 'active-link' : ''}">Pranav Chaparala</a>
            <a href="${basePath}work/index.html" class="nav-top-center ${isWork ? 'active-link' : ''}">Work</a>
            <a href="${basePath}play/index.html" class="nav-top-right ${isPlay ? 'active-link' : ''}">Play</a>
            <a href="javascript:void(0)" onclick="openAboutModal()" class="nav-bottom-left">About</a>
        </nav>
        <nav class="main-nav desktop-only" style="${inlineStyle}">
            <a href="${basePath}index.html" class="${brandClass}">Pranav Chaparala</a>
            <div class="nav-right-links">
                <a href="${basePath}work/index.html" class="${isWork ? 'active-link' : ''}">Work</a>
                <a href="${basePath}play/index.html" class="${isPlay ? 'active-link' : ''}">Play</a>
                <a href="javascript:void(0)" onclick="openAboutModal()">About</a>        
            </div>
        </nav>
    `;
    document.body.insertAdjacentHTML('beforeend', navHTML);
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

        // Skip modal triggers
        if (href && href.startsWith('javascript:')) return;

        if (link && href && !href.startsWith('#') && link.target !== '_blank') {
            e.preventDefault();
            const targetUrl = link.href;
            document.body.classList.remove('page-loaded');
            document.body.classList.add('page-leaving');
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400); // Optimized from 600ms
        }
    });
}

function initWorksTrack() {
    const stage = document.getElementById('stage');
    if (!stage) return;
    
    // Physics bouncing executes natively now on iOS.

    // Initialize hover sound
    const hoverSound = new Audio(basePath + 'hover.mp3');
    hoverSound.preload = 'auto';

    if (typeof gsap === 'undefined') return;

    const bgBlur = document.getElementById('bg-blur');
    const bgImg = document.getElementById('bg-img');

    let blurEnabled = false;
    let VW = window.innerWidth;
    let VH = window.innerHeight;

    window.addEventListener('resize', () => {
        VW = window.innerWidth;
        VH = window.innerHeight;
        // Recalculate horizontal offsets if needed
        if (!isVertical) applyPositions();
    });

    const carouselWorks = worksData.slice(0, 6);
    const N = carouselWorks.length;
    const GAP = 0;

    const isMobile = VW <= 768;
    const isTablet = VW <= 1024 && VW > 768;
    const isVertical = false; // Reverted to horizontal globally

    let pWidth = 280, lWidth = 390;
    if (isMobile) { pWidth = 220; lWidth = 280; } // Shrunk slightly for horizontal fit
    else if (isTablet) { pWidth = 240; lWidth = 320; }


    const sh = i => (i % N) % 2 === 0 ? 'p' : 'l';
    const w = i => sh(i) === 'p' ? pWidth : lWidth;

    const h = i => {
        if (sh(i) === 'p') {
            if (isMobile) return 308;
            if (isTablet) return 336;
            return 395;
        } else {
            if (isMobile) return 210;
            if (isTablet) return 240;
            return 255;
        }
    };

    const cycleSize = carouselWorks.reduce((sum, _, i) => sum + (isVertical ? h(i) : w(i)) + GAP, 0);
    const numReps = isVertical ? 1 : Math.ceil(((isVertical ? VH : VW) * 3) / cycleSize) + 2;

    if (isVertical) {
        stage.style.position = 'relative';
        stage.style.display = 'flex';
        stage.style.flexDirection = 'column';
        stage.style.alignItems = 'center';
        stage.style.paddingTop = '80px';
        stage.style.paddingBottom = '80px';
    }

    const cards = [];
    for (let r = 0; r < numReps; r++) {
        carouselWorks.forEach((work, i) => {
            const gi = r * N + i;
            const card = document.createElement('div');
            card.className = `card ${sh(i)}`;
            card.style.width = w(i) + 'px';
            card.style.height = h(i) + 'px';
            
            if (isVertical) {
                card.style.position = 'relative';
                card.style.left = 'auto';
                card.style.top = 'auto';
                card.style.margin = '0 0 -1px 0'; // Prevent iOS render pixel gapping entirely
            }

            card.innerHTML = `<div class="pan"><img src="${basePath + 'covers/' + work.img}" alt="${work.title}" class="project-img"></div>`;
            card.dataset.workIdx = i;

            card.addEventListener('mouseenter', () => {
                if (isMobile) return; // Prevent Safari ghost tap
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
                // [ADJUST OPACITY HERE] - Background blur opacity when hovering carousel cards (Desktop)
                bgBlur.style.opacity = '0.25';
                cards.forEach(c => {
                    if (c !== card) c.classList.add('dimmed');
                });
            });
            card.addEventListener('mouseleave', () => {
                if (isMobile) return; // Prevent Safari ghost tap
                if (!blurEnabled || document.body.classList.contains('project-opening')) return;
                
                if (!isMobile) {
                    gsap.to(titleEl, { opacity: 0, duration: 0.15 });
                }

                bgBlur.style.opacity = '0';
                cards.forEach(c => c.classList.remove('dimmed'));
            });
            const handleProjectClick = (e) => {
                // Prevent navigation if a significant drag just occurred
                if (window.isPanning) return;
                if (document.body.classList.contains('project-opening')) return;
                
                const ci = cards.indexOf(card);
                const size = w(ci % N);
                
                if (isVertical) {
                    document.body.classList.add('project-opening');
                    document.body.classList.remove('page-loaded');
                    document.body.classList.add('page-leaving');
                    setTimeout(() => {
                        window.location.href = basePath + work.link;
                    }, 400);
                    return;
                }

                // --- MOBILE TWO-TAP FOCUS ---
                if (isMobile) {
                    const mid = cardPos[ci] + offset + size / 2;
                    const isCentered = Math.abs(mid - VW / 2) < 40;

                    if (window.focusedMobileCardIndex !== ci && !isCentered) {
                        window.focusedMobileCardIndex = ci;
                        vel = 0;
                        const targetOffset = VW / 2 - (cardPos[ci] + size / 2);
                        let proxy = { o: offset };
                        
                        gsap.to(proxy, {
                            o: targetOffset,
                            duration: 0.4, // Faster centering
                            ease: 'power2.out',
                            onUpdate: () => { offset = proxy.o; }
                        });
                        
                        titleEl.innerHTML = `<div class="project-subheading">Selected Work</div>${work.title}`;
                        gsap.to(titleEl, { opacity: 1, duration: 0.3 });
                        return; // Block navigation on first tap
                    }
                }
                // -----------------------------

                vel = 0;
                const targetOffset = VW / 2 - (cardPos[ci] + size / 2);
                let proxy = { o: offset };

                gsap.to(proxy, {
                    o: targetOffset,
                    duration: 0.5, // Standardized entry
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
                        // Standalone exit animation (decoupled from intro timeline 'tl')
                        gsap.to({}, {
                            duration: 0.7, // Optimized: Gentler but faster (was 1.0s)
                            ease: 'power4.inOut',
                            onComplete: () => {
                                // Native View Transition API (standard for modern browsers)
                                if (document.startViewTransition) {
                                    // Assign a transition name to the specific card for the shared element effect
                                    card.style.viewTransitionName = 'active-project-card';
                                    
                                    document.startViewTransition(() => {
                                        window.location.href = basePath + work.link;
                                    });
                                } else {
                                    // Fallback for older browsers
                                    window.location.href = basePath + work.link;
                                }
                            }
                        });
                    }
                });
            };

            card.addEventListener('click', (e) => handleProjectClick(e));
            
            // Fast-tap for mobile to bypass click delay
            card.addEventListener('touchend', (e) => {
                if (!isMobile) return;
                const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
                const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
                const dt = Date.now() - touchStartTime;
                // If it's a fast tap without significant movement, trigger instantly
                if (dx < 10 && dy < 10 && dt < 300) {
                    e.preventDefault();
                    handleProjectClick(e);
                }
            });

            stage.appendChild(card);
            cards.push(card);
        });
    }

    let pos = 0;
    const cardPos = cards.map((c, i) => {
        const cp = pos;
        pos += (isVertical ? h(i) : w(i)) + GAP;
        return cp;
    });
    const totalPos = pos - GAP;

    const midRep = Math.floor(numReps / 2);
    const heroIdx = midRep * N + (N - 1);
    const heroCard = cards[heroIdx];
    const heroSize = isVertical ? h(heroIdx % N) : w(heroIdx % N);
    const heroMid = cardPos[heroIdx] + heroSize / 2;
    let offset = (isVertical ? VH : VW) / 2 - heroMid;

    function applyPositions() {
        if (isVertical) return; // Native CSS handles location!
        cards.forEach((c, i) => {
            const cp = cardPos[i] + offset;
            c.style.left = cp + 'px';
            const pan = c.querySelector('.pan');
            if (pan) pan.style.transform = `translateX(${(cp + w(i % N) / 2 - VW / 2) * 0.01}px)`;
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

    // Initial state for all devices: hide until reveal
    gsap.set(titleEl, { opacity: 0 });

    if (isMobile) {
        const heroWork = carouselWorks[heroIdx % N];
        titleEl.dataset.currentTitle = heroWork.title;
        titleEl.innerHTML = `<div class="project-subheading">Selected Work</div>${heroWork.title}`;
        bgImg.src = `${basePath + 'covers/' + heroWork.img}`;
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
                opacity: 1, duration: 0.4, stagger: 0.02, ease: 'power2.out',
                onComplete() { spinning = true; blurEnabled = true; }
            });
        }

        const mainNav = document.querySelector('.main-nav');
        const mobileNav = document.querySelector('.mobile-spatial-nav');
        if (mainNav) {
            gsap.to(mainNav, { opacity: 1, duration: instant ? 0 : 0.8 });
            mainNav.style.pointerEvents = 'auto';
        }
        if (mobileNav) {
            gsap.to(mobileNav, { opacity: 1, duration: instant ? 0 : 0.8 });
            mobileNav.style.pointerEvents = 'auto';
        }
        if (titleEl && !isMobile) gsap.to(titleEl, { opacity: 1, duration: instant ? 0 : 0.8 });
        
        const footer = document.querySelector('footer');
        if (footer) gsap.to(footer, { opacity: 1, duration: instant ? 0 : 0.8, onComplete: () => footer.style.pointerEvents = 'auto' });

        document.body.classList.remove('loading-page');
        sessionStorage.setItem('portfolio_visited', 'true');
    }

    const hasVisited = sessionStorage.getItem('portfolio_visited');

    if (!hasVisited) {
        const fakes = carouselWorks.map((work, i) => {
            const f = document.createElement('div');
            f.className = `fake ${sh(i)}`;
            f.style.zIndex = 100 + i;
            if (isMobile) {
                f.style.width = sh(i) === 'p' ? '220px' : '280px';
                f.style.height = sh(i) === 'p' ? '308px' : '210px';
                f.style.marginLeft = sh(i) === 'p' ? '-110px' : '-140px';
                f.style.marginTop = sh(i) === 'p' ? '-154px' : '-105px';
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

    // --- ZERO-DEPENDENCY HAPTIC ENGINE ---
    const triggerHaptic = () => {
        if (navigator.vibrate) {
            navigator.vibrate(10); // Standard Android tick
            return;
        }
        // iOS Safari 17.4+ native switch hack
        const cb = document.createElement('input');
        cb.setAttribute('type', 'checkbox');
        cb.setAttribute('switch', '');
        cb.style.position = 'absolute';
        cb.style.opacity = '0';
        cb.style.pointerEvents = 'none';
        document.body.appendChild(cb);
        cb.click();
        cb.remove();
    };

    // WHEEL SENSITIVITY: Adjust the 0.03 to change how fast the mouse wheel scrolls (lower = slower)
    window.addEventListener('wheel', e => { if (spinning && !isVertical) vel += e.deltaY * 0.03; });

    // --- DESKTOP MOUSE DRAG ENGINE ---
    let isMouseDown = false;
    let lastMouseX = 0;
    window.isPanning = false; // Shared flag to block clicks during/after drag
    let dragDist = 0;

    window.addEventListener('mousedown', e => {
        if (!spinning || isVertical) return;
        isMouseDown = true;
        lastMouseX = e.clientX;
        dragDist = 0;
        window.isPanning = false;
    });

    window.addEventListener('mousemove', e => {
        if (!isMouseDown) return;
        const dx = lastMouseX - e.clientX;
        dragDist += Math.abs(dx);
        
        // DRAG SENSITIVITY: Adjust the 0.12 to change how fast the carousel moves with the mouse (lower = more weight)
        vel += dx * 0.12;
        lastMouseX = e.clientX;

        if (dragDist > 10) window.isPanning = true;
    });

    window.addEventListener('mouseup', () => {
        isMouseDown = false;
        // Keep isPanning true very briefly to catch and block the 'click' event
        setTimeout(() => { window.isPanning = false; }, 50);
    });

    window.addEventListener('mouseleave', () => { isMouseDown = false; window.isPanning = false; });


    window.addEventListener('touchmove', e => {
        if (!spinning || isVertical) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const dx = touchStartX - currentX;
        const dy = touchStartY - currentY;
        
        // Prevent default vertical scrolling on the home page
        // Only prevent if movement is significant to avoid swallowing tiny taps
        if (!document.body.classList.contains('scrollable')) {
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                if (e.cancelable) e.preventDefault();
            }
        }

        // TOUCH SENSITIVITY: Adjust the 0.12 to change how fast it scrolls on mobile (lower = slower)
        vel += dx * 0.12;
        
        if (Math.abs(dx) > 2) {
            window.focusedMobileCardIndex = -1;
            if (isMobile && titleEl) gsap.to(titleEl, { opacity: 0, duration: 0.2 });
        }

        touchStartX = currentX;
        touchStartY = currentY;
    }, {passive: false});

    const BUFFER = 600;
    (function loop() {
        requestAnimationFrame(loop);
        if (!spinning) return;
        
        if (isVertical) {
            // NATIVE MOBILE Parallax & Hover calculations ONLY
            let closestCard = null;
            let minDiff = Infinity;
            cards.forEach((c, i) => {
                const rect = c.getBoundingClientRect();
                const mid = rect.top + rect.height / 2;
                const viewSize = VH;
                const diff = Math.abs(mid - viewSize / 2);
                if (diff < minDiff) { 
                    minDiff = diff; 
                    closestCard = c; 
                }
                const pan = c.querySelector('.pan');
                if (pan) pan.style.transform = `translateY(${(mid - viewSize / 2) * 0.01}px)`;
            });

            if (closestCard && isMobile) {
                const workIdx = parseInt(closestCard.dataset.workIdx);
                const work = carouselWorks[workIdx];
                if (titleEl.dataset.currentTitle !== work.title) {
                    titleEl.dataset.currentTitle = work.title;
                    titleEl.innerHTML = `<div class="project-subheading">Selected Work</div>${work.title}`;
                    bgImg.src = `${basePath + 'covers/' + work.img}`;
                    bgBlur.style.opacity = '0.2';
                }
            }
            return; // completely halt GSAP math processing for vertical
        }

        // FRICTION: Adjust the 0.88 to change how long the momentum lasts. 
        // 0.85 is heavy, 0.95 is very slippery.
        vel *= 0.88; 
        offset -= vel;
        cards.forEach((c, i) => {
            let cp = cardPos[i] + offset;
            const size = w(i % N);
            if (cp + size < -BUFFER) cardPos[i] += totalPos + GAP;
            if (cp > VW + BUFFER) cardPos[i] -= totalPos + GAP;
        });
        
        let minDiff = Infinity;
        let currentCenterIdx = -1;

        cards.forEach((c, i) => {
            const cp = cardPos[i] + offset;
            const size = w(i % N);
            const viewSize = VW;
            const mid = cp + size / 2;
            c.style.left = cp + 'px';
            // Vertical parallax completely removed for purely horizontal interaction
            c.style.transform = 'translateY(0)';
            const pan = c.querySelector('.pan');
            if (pan) pan.style.transform = `translateX(${(mid - viewSize / 2) * 0.01}px)`;
            
            // Calculate closest card for haptic feedback
            const diff = Math.abs(mid - viewSize / 2);
            if (diff < minDiff) {
                minDiff = diff;
                currentCenterIdx = i;
            }
        });

        if (isMobile && currentCenterIdx !== window.lastHapticIdx) {
            if (window.lastHapticIdx !== undefined && Math.abs(vel) > 0.5) triggerHaptic();
            window.lastHapticIdx = currentCenterIdx;
            
            // SYNCHRONIZATION: Update focus index so a single tap opens the project
            // if it's already centered and showing the title.
            if (Math.abs(vel) < 2) {
                window.focusedMobileCardIndex = currentCenterIdx;
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
            const isTouch = window.innerWidth <= 1024;
            if (isTouch) return;
            const imgName = li.getAttribute('data-img');
            if (imgName && hoverImg && hoverBg && hoverContainer) {
                const fullPath = basePath + 'covers/' + imgName;
                hoverImg.src = fullPath;
                hoverBg.src = fullPath;
                hoverContainer.classList.add('active');
            }
        });
        a.addEventListener('mouseleave', () => {
            const isTouch = window.innerWidth <= 1024;
            if (isTouch) return;
            if (hoverContainer) hoverContainer.classList.remove('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    injectNavigation();
    setupTransitions();
    initWorksTrack();
    initWorksList();
    injectAboutModal();

    const isIndex = (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '' || window.location.pathname.endsWith('portfolioagain')) && !window.location.pathname.includes('/projects/') && !window.location.pathname.includes('/work/') && !window.location.pathname.includes('/play/') && !window.location.pathname.includes('/about/');
    if (isIndex && !sessionStorage.getItem('portfolio_visited')) {
        document.body.classList.add('loading-page');
    }

    if (window.location.pathname.includes('/work/')) {
        document.body.classList.add('scrollable');
        document.documentElement.classList.add('scrollable');
    }

    const isPlay = window.location.pathname.includes('/play/');
    if (isPlay) {
        document.body.classList.add('play-page');
    }

    // Critical Navigation Fix: Reveal nav on subpages or return visits
    // revealCarousel is scoped inside initWorksTrack, so we reveal nav directly here
    if (!isIndex || sessionStorage.getItem('portfolio_visited')) {
        const mainNav = document.querySelector('.main-nav');
        const mobileNav = document.querySelector('.mobile-spatial-nav');
        const footer = document.querySelector('footer');
        if (mainNav) { mainNav.style.opacity = '1'; mainNav.style.pointerEvents = 'auto'; }
        if (mobileNav) { mobileNav.style.opacity = '1'; mobileNav.style.pointerEvents = 'auto'; }
        if (footer) { footer.style.opacity = '1'; footer.style.pointerEvents = 'auto'; }
    }

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

    // Fast-tap for navigation links to bypass 300ms click delay
    document.querySelectorAll('.main-nav a, .mobile-spatial-nav a').forEach(link => {
        link.addEventListener('touchend', (e) => {
            const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
            const dt = Date.now() - touchStartTime;
            if (dx < 10 && dy < 10 && dt < 300) {
                e.preventDefault();
                link.click();
            }
        });
    });
});