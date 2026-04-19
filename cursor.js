window.onload = () => { document.body.classList.add('loaded'); };

const basePathCursor = window.location.pathname.includes('/projects/') ? '../../' : './';

function initCursor() {
    if (!document.getElementById('cursor-svg')) {
        document.body.insertAdjacentHTML('beforeend', `
            <svg id="cursor-svg"><path id="thread-path" d="" /></svg>
            <div id="cursor-square-loader">
                <div class="loader-rect"></div>
                <span id="open-project-label">open project</span>
                <span id="drag-explore-hint">drag to explore</span>
            </div>
        `);
    }

    const cursorSq = document.getElementById('cursor-square-loader');
    const pathEl = document.getElementById('thread-path');
    const label = document.getElementById('open-project-label');
    const hint = document.getElementById('drag-explore-hint');

    // Show hint only on play page
    if (document.body.classList.contains('play-page')) {
        setTimeout(() => {
            if (hint) hint.classList.add('visible');
        }, 1000);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideHint();
        }, 6000); // 1000ms delay + 5000ms duration
    }

    const hideHint = () => {
        if (hint) {
            hint.classList.remove('visible');
            hint.style.opacity = '0';
        }
        window.removeEventListener('mousedown', hideHint);
        window.removeEventListener('touchstart', hideHint);
    };

    window.addEventListener('mousedown', hideHint);
    window.addEventListener('touchstart', hideHint);

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let points = Array.from({ length: 12 }, () => ({ x: mouse.x, y: mouse.y }));

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function updateCursor() {
        points[0].x = mouse.x;
        points[0].y = mouse.y;
        for (let i = 1; i < 12; i++) {
            points[i].x += (points[i - 1].x - points[i].x) * 0.25;
            points[i].y += (points[i - 1].y - points[i].y) * 0.25;
        }

        cursorSq.style.left = `${points[0].x}px`;
        cursorSq.style.top = `${points[0].y}px`;

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < 12; i++) d += ` L ${points[i].x} ${points[i].y}`;
        pathEl.setAttribute('d', d);

        if (label) {
            const elements = document.elementsFromPoint(mouse.x, mouse.y);
            // Including links for transitioning
            const isOverImgOrLink = elements.some(el =>
                el.classList.contains('project-img') ||
                (el.tagName && el.tagName.toLowerCase() === 'a') ||
                el.closest('a')
            );

            if (isOverImgOrLink) {
                // Strictly target ONLY the project-img (carousel covers) for the "Open Project" label
                const isImg = elements.some(el => el.classList.contains('project-img'));

                label.textContent = isImg ? 'open project' : '';

                cursorSq.classList.add('active-hover');
                if (isImg) document.body.classList.add('hovering-project');
                else document.body.classList.remove('hovering-project');
            } else {
                cursorSq.classList.remove('active-hover');
                document.body.classList.remove('hovering-project');
            }
        }

        requestAnimationFrame(updateCursor);
    }


    updateCursor();
}

document.addEventListener('DOMContentLoaded', initCursor);