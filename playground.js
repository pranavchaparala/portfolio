/**
 * REVISED PLAYGROUND LOGIC (Extended Lock)
 */

// --- Global State ---
let grid, gridWrapper, infoOverlay, mainHeader, viewport;

const totalCards = 104; 
let isDragging = false;
let isFocused = false;
let isResetting = false;
let isGridReady = false; // Controls physics & dragging
let isClickable = false; // SEPARATE LOCK: Controls card clicking

let pendingZoomArgs = null;
let targetX = 0, targetY = 0; 
let currentX = 0, currentY = 0; 
let lastMouseX = 0, lastMouseY = 0;
let clickStartX = 0, clickStartY = 0;
let velocityX = 0, velocityY = 0;

const lerpAmount = 0.08;
const friction = 0.95;
const dragThreshold = 5;

function initGrid() {
    grid = document.getElementById('grid');
    gridWrapper = document.getElementById('grid-wrapper');
    infoOverlay = document.getElementById('info-overlay');
    mainHeader = document.querySelector('.main-nav');
    viewport = document.getElementById('viewport');

    if (!grid || !gridWrapper || !viewport) return;

    // Hard reset state on load
    isDragging = false;
    isFocused = false;
    isResetting = false;
    isGridReady = false; 
    isClickable = false; 
    targetX = 0; targetY = 0;
    currentX = 0; currentY = 0;
    velocityX = 0; velocityY = 0;

    let dataPool = [];
    while (dataPool.length < totalCards) {
        dataPool = dataPool.concat(playgroundData);
    }
    dataPool = dataPool.slice(0, totalCards);

    // Shuffle
    for (let i = dataPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dataPool[i], dataPool[j]] = [dataPool[j], dataPool[i]];
    }

    grid.innerHTML = ''; 

    for (let i = 0; i < totalCards; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.pointerEvents = 'none'; // Keep cursor default

        const data = dataPool[i];
        const title = data.title;
        const description = data.description;

        const img = document.createElement('img');
        img.src = `playgroundassets/${data.filename}`;
        img.className = 'card-img';
        img.draggable = false;
        img.ondragstart = (e) => e.preventDefault();
        img.onerror = function () { this.src = `https://picsum.photos/seed/${i + 100}/500/600`; };

        card.appendChild(img);

        card.onmousedown = (e) => {
            if (!isClickable) return;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            clickStartX = e.clientX;
            clickStartY = e.clientY;
        };

        card.onmouseup = (e) => {
            // Guard: Absolutely no clicking until fully settled
            if (!isClickable) return; 

            const dist = Math.hypot(e.clientX - clickStartX, e.clientY - clickStartY);
            if (dist < dragThreshold && !isResetting && !isFocused) {
                handleCardClick(card, title, description, data.videoFilename);
            }
        };

        grid.appendChild(card);
    }

    setupDragListeners();

    // --- SEQUENTIAL UNLOCK SEQUENCE ---
    
    // 1. Start CSS Expansion
    setTimeout(() => { 
        if (grid) grid.classList.add('grid-spaced'); 
    }, 1000);

    // 2. Unlock Physics/Dragging (after expansion starts settling)
    setTimeout(() => { 
        isGridReady = true; 
    }, 1800);

    // 3. Unlock Card Clicking (The "Longer" Wait)
    setTimeout(() => { 
        isClickable = true; 
        document.querySelectorAll('.card').forEach(c => {
            c.style.pointerEvents = 'auto'; 
            c.style.cursor = 'pointer';
        });
    }, 2500); // 2.5 seconds total before user can open a card

    if (!window.physicsLoopRunning) {
        window.physicsLoopRunning = true;
        requestAnimationFrame(updatePhysics);
    }
}

function updatePhysics() {
    if (!gridWrapper) {
        window.physicsLoopRunning = false;
        return;
    }

    // Grid interaction only allowed once isGridReady is true
    if (!isFocused && !isResetting && isGridReady) {
        if (!isDragging) {
            if (pendingZoomArgs) {
                velocityX *= 0.6;
                velocityY *= 0.6;
                if (Math.hypot(velocityX, velocityY) < 0.5) {
                    velocityX = 0; velocityY = 0;
                    executeZoom(pendingZoomArgs);
                    pendingZoomArgs = null;
                }
            } else {
                velocityX *= friction;
                velocityY *= friction;
            }
            targetX += velocityX;
            targetY += velocityY;
        }

        const gridRect = grid.getBoundingClientRect();
        const vW = window.innerWidth;
        const vH = window.innerHeight;

        const limitX = Math.max(0, (gridRect.width - vW) / 2);
        const limitY = Math.max(0, (gridRect.height - vH) / 2);

        targetX = Math.max(-limitX, Math.min(limitX, targetX));
        targetY = Math.max(-limitY, Math.min(limitY, targetY));

        currentX += (targetX - currentX) * lerpAmount;
        currentY += (targetY - currentY) * lerpAmount;

        gridWrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0px) scale(1)`;
    }
    requestAnimationFrame(updatePhysics);
}

function setupDragListeners() {
    if (!viewport) return;

    viewport.onmousedown = (e) => {
        if (isFocused || isResetting || !isGridReady) return; 
        if (pendingZoomArgs) pendingZoomArgs = null;
        isDragging = true;
        velocityX = 0; velocityY = 0;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    };

    window.onmousemove = (e) => {
        if (!isDragging || isFocused || isResetting || !isGridReady) return;
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        targetX += dx; targetY += dy;
        velocityX = dx; velocityY = dy;
        lastMouseX = e.clientX; lastMouseY = e.clientY;
    };

    window.onmouseup = () => { isDragging = false; };
}

function handleCardClick(clickedCard, title, description, videoFilename) {
    if (Math.hypot(velocityX, velocityY) > 1.0) {
        pendingZoomArgs = { clickedCard, title, description, videoFilename };
        return;
    }
    executeZoom({ clickedCard, title, description, videoFilename });
}

function executeZoom({ clickedCard, title, description, videoFilename }) {
    isFocused = true;
    viewport.classList.add('is-focused-mode');
    gridWrapper.classList.add('is-focused');
    gridWrapper.classList.remove('is-resetting');

    document.querySelectorAll('.card').forEach(c => c.classList.remove('active-card'));
    clickedCard.classList.add('active-card');

    const wrapperRect = gridWrapper.getBoundingClientRect();
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;
    const cardRect = clickedCard.getBoundingClientRect();
    
    const relX = (cardRect.left + cardRect.width / 2) - wrapperRect.left;
    const relY = (cardRect.top + cardRect.height / 2) - wrapperRect.top;

    const scale = 2.8;
    const initialOriginX = wrapperRect.left - currentX;
    const initialOriginY = wrapperRect.top - currentY;

    const zoomTargetX = screenCenterX - initialOriginX - (relX * scale);
    const zoomTargetY = screenCenterY - initialOriginY - (relY * scale);

    gridWrapper.style.transform = `translate3d(${zoomTargetX}px, ${zoomTargetY}px, 0px) scale(${scale})`;

    infoOverlay.classList.add('info-visible');
    document.getElementById('focus-title').innerText = title;
    document.getElementById('focus-subtitle').innerText = description;

    if (mainHeader) mainHeader.style.opacity = '0';
    if (mainHeader) mainHeader.style.pointerEvents = 'none';

    if (videoFilename) {
        const vid = document.createElement('video');
        vid.src = `playgroundassets/${videoFilename}`;
        vid.autoplay = true; vid.muted = false; vid.loop = true; vid.playsInline = true;
        vid.className = 'card-video';
        vid.style.position = 'absolute'; vid.style.top = '0'; vid.style.left = '0';
        vid.style.width = '100%'; vid.style.height = '100%'; vid.style.objectFit = 'cover';
        vid.style.opacity = '0'; vid.style.transition = 'opacity 0.5s ease 0.5s'; vid.style.pointerEvents = 'none';

        clickedCard.appendChild(vid);
        vid.play().catch(() => { vid.muted = true; vid.play(); });
        setTimeout(() => { vid.style.opacity = '1'; }, 100);
    }
}

function resetView() {
    if (!isFocused) return;
    isFocused = false;
    isResetting = true;

    viewport.classList.remove('is-focused-mode');
    gridWrapper.classList.remove('is-focused');
    gridWrapper.classList.add('is-resetting');

    infoOverlay.classList.remove('info-visible');
    if (mainHeader) {
        mainHeader.style.opacity = '1';
        mainHeader.style.pointerEvents = 'auto';
    }

    targetX = 0; targetY = 0;
    currentX = 0; currentY = 0;
    velocityX = 0; velocityY = 0;

    gridWrapper.style.transform = `translate3d(0px, 0px, 0px) scale(1)`;

    const activeCards = document.querySelectorAll('.card.active-card');
    activeCards.forEach(card => {
        const vids = card.querySelectorAll('video');
        vids.forEach(v => {
            v.style.opacity = '0';
            setTimeout(() => v.remove(), 600);
        });
        card.classList.remove('active-card');
    });

    setTimeout(() => {
        isResetting = false;
        if (gridWrapper) gridWrapper.classList.remove('is-resetting');
    }, 1800);
}

window.addEventListener('load', () => { if (document.getElementById('grid')) initGrid(); });

window.onmousedown = (e) => {
    if (!isFocused || isResetting) return;
    if (!e.target.closest('.active-card')) resetView();
};