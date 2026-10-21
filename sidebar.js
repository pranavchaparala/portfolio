/**
 * sidebar.js
 *
 * Split-view sidebar (627px – 890px, see style.css). Hidden at every other width.
 *
 * - Projects / Experiments nav buttons act as tabs: they show / swap the thumbnail
 *   list in the sidebar and leave the right-hand view where it is. Home /
 *   About start with no list.
 * - Picking an item opens it in the right-hand view (case-study / experiment
 *   modal) when the page has one, otherwise loads projects.html?p=<id> /
 *   experiments.html?e=<id>.
 * - The right-hand view never shows the all-projects / all-experiments grid:
 *   on those pages the grid is hidden (body.split-detail-page), the first
 *   item opens when none is requested, and closing goes back home.
 * - Resume / LinkedIn pinned to the bottom of the sidebar.
 *
 * Requires projects.js (projectsData, experimentsData) to be loaded first.
 */
(function () {
    'use strict';

    var header = document.querySelector('header');
    var nav = document.getElementById('main-nav');
    if (!header || !nav || typeof projectsData === 'undefined') return;

    var splitQuery = window.matchMedia('screen and (min-width: 627px) and (max-width: 890px)');
    var EXP_MEDIA_BASE = 'assets/experiments/';
    var RESUME_URL = 'https://drive.google.com/uc?export=download&id=1cpND1GMJiNTteY0yfT2CI8pOVJn2AvJp';
    var LINKEDIN_URL = 'https://linkedin.com/in/pranavchaparala';

    var hasCaseModal = !!document.getElementById('case-study-modal');
    var hasExpModal = !!document.getElementById('experiment-modal');
    // projects.html / experiments.html: grid pages whose grid the split view hides
    var detailPage = document.getElementById('projects-section') ? 'projects'
        : document.getElementById('experiments-section') ? 'experiments' : null;

    if (detailPage) document.body.classList.add('split-detail-page');

    var lists = {};

    function buildList(key, label, items, toItem) {
        var list = document.createElement('div');
        list.className = 'sidebar-list';
        list.dataset.list = key;
        list.hidden = true;

        var heading = document.createElement('div');
        heading.className = 'sidebar-list-label';
        heading.textContent = label;
        list.appendChild(heading);

        items.forEach(function (data) {
            var cfg = toItem(data);

            var item = document.createElement('a');
            item.className = 'sidebar-item';
            item.href = cfg.href;
            item.dataset.itemId = cfg.id;
            item.setAttribute('data-haptic', '');

            var thumb = document.createElement('span');
            thumb.className = 'sidebar-item-thumb';
            if (cfg.thumb) {
                var img = document.createElement('img');
                img.src = cfg.thumb;
                img.alt = '';
                img.loading = 'lazy';
                img.decoding = 'async';
                thumb.appendChild(img);
            }
            item.appendChild(thumb);

            var title = document.createElement('span');
            title.className = 'sidebar-item-title';
            title.textContent = cfg.title;
            item.appendChild(title);

            item.addEventListener('click', function (e) {
                if (!cfg.canOpen()) return;
                e.preventDefault();
                cfg.open();
            });

            list.appendChild(item);
        });

        header.appendChild(list);
        lists[key] = list;
    }

    buildList('projects', 'Projects', projectsData, function (project) {
        var cover = project.galleryImages && project.galleryImages[0];
        return {
            id: project.id,
            href: 'projects.html?p=' + encodeURIComponent(project.id),
            thumb: cover ? cover.src : null,
            title: project.title,
            canOpen: function () { return hasCaseModal && typeof window.openCaseStudy === 'function'; },
            open: function () { window.openCaseStudy(project.id); }
        };
    });

    if (typeof experimentsData !== 'undefined') {
        buildList('experiments', 'Experiments', experimentsData, function (exp) {
            return {
                id: String(exp.id),
                href: 'experiments.html?e=' + encodeURIComponent(exp.id),
                thumb: EXP_MEDIA_BASE + exp.filename,
                title: exp.title,
                canOpen: function () { return hasExpModal && typeof window.openExperimentModal === 'function'; },
                open: function () { window.openExperimentModal(exp); }
            };
        });
    }

    // --- Resume / LinkedIn ---
    var links = document.createElement('div');
    links.className = 'sidebar-links';
    [['Resume ↗', RESUME_URL, 'pill-dark'], ['LinkedIn ↗', LINKEDIN_URL, 'pill-light']].forEach(function (l) {
        var a = document.createElement('a');
        a.className = 'pill ' + l[2];
        a.href = l[1];
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = l[0];
        links.appendChild(a);
    });
    header.appendChild(links);

    // --- Tabs ---
    var tabButtons = {
        projects: nav.querySelector('a[href="projects.html"]'),
        experiments: nav.querySelector('a[href="experiments.html"]')
    };

    Object.keys(tabButtons).forEach(function (k) {
        if (tabButtons[k]) tabButtons[k].dataset.sidebarTab = k;
    });
    nav.classList.add('has-sidebar-tabs');

    function showTab(key) {
        Object.keys(lists).forEach(function (k) { lists[k].hidden = k !== key; });
        Object.keys(tabButtons).forEach(function (k) {
            if (tabButtons[k]) tabButtons[k].classList.toggle('sidebar-tab-active', k === key);
        });
    }

    // Home / About start with no list (just nav + Resume / LinkedIn) until a tab is picked
    showTab(detailPage);

    // Capture on window so this runs before page-transition.js (document, capture)
    window.addEventListener('click', function (e) {
        if (!splitQuery.matches) return;
        var link = e.target.closest && e.target.closest('#main-nav a.nav-btn');
        if (!link) return;
        var key = link.dataset.sidebarTab;
        if (!key || !lists[key]) return;
        e.preventDefault();
        e.stopPropagation();
        showTab(key);
    }, true);

    // --- Highlight the item open in the right-hand view ---
    var openIds = { projects: null, experiments: null };

    function syncActive() {
        Object.keys(lists).forEach(function (key) {
            lists[key].querySelectorAll('.sidebar-item').forEach(function (el) {
                el.classList.toggle('active', el.dataset.itemId === openIds[key]);
            });
        });
    }

    function wrap(name, after) {
        var fn = window[name];
        if (typeof fn !== 'function') return;
        window[name] = function () {
            var result = fn.apply(this, arguments);
            after.apply(this, arguments);
            syncActive();
            return result;
        };
    }

    // On grid pages there's nothing behind the modal in split view, so
    // closing the item goes home instead of revealing an empty panel.
    function closeToHome(name) {
        var fn = window[name];
        if (typeof fn !== 'function') return;
        window[name] = function () {
            if (detailPage && splitQuery.matches) {
                window.location.href = 'index.html';
                return;
            }
            return fn.apply(this, arguments);
        };
    }

    // app.js / experiments.js define the modal functions on DOMContentLoaded;
    // this listener is registered after theirs, so they exist by now.
    document.addEventListener('DOMContentLoaded', function () {
        var caseModal = document.getElementById('case-study-modal');
        function syncProjectFromUrl() {
            var open = caseModal && caseModal.classList.contains('active');
            openIds.projects = open ? new URLSearchParams(window.location.search).get('p') : null;
        }

        closeToHome('closeCaseStudy');
        closeToHome('closeExperimentModal');
        wrap('openCaseStudy', syncProjectFromUrl);
        wrap('closeCaseStudy', syncProjectFromUrl);
        wrap('openExperimentModal', function (exp) { openIds.experiments = exp ? String(exp.id) : null; });
        wrap('closeExperimentModal', function () { openIds.experiments = null; });

        window.addEventListener('popstate', function () {
            setTimeout(function () { syncProjectFromUrl(); syncActive(); }, 0);
        });

        var params = new URLSearchParams(window.location.search);

        if (detailPage === 'experiments' && hasExpModal && typeof experimentsData !== 'undefined') {
            var expParam = params.get('e');
            var exp = experimentsData.find(function (x) { return String(x.id) === expParam; });
            if (!exp && splitQuery.matches) exp = experimentsData[0];
            if (exp) window.openExperimentModal(exp);
        }

        if (detailPage === 'projects' && splitQuery.matches && !params.get('p') && projectsData[0]) {
            window.openCaseStudy(projectsData[0].id);
        }

        syncProjectFromUrl();
        syncActive();
    });
})();
