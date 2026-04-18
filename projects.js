// projects.js

// This file acts as your CMS. 
// You can edit the content string using HTML for formatting. 
// Keep the 'id' matching the URL parameter you want.
// Example: id: 'my-project' means it will link to project.html?id=my-project

const projectsData = [
    {
        id: "echoes-of-presence",
        title: "Echoes of Presence",
        img: "echoesofpresence.png",
        link: "project.html?id=echoes-of-presence",
        content: `
            <h1>Echoes of Presence</h1>
            <p class="body-text">What happens when AI recognizes other forms of presence?</p>
            <p class="body-text">In response to an AI-reconstructed world, <i>Echoes of Presence</i> seeks to
                reconcile our relationship to our environment through an evolving generative art installation.</p>

            <div class="meta-grid">
                <span class="meta-label">Year</span><span class="meta-value">2023</span>
                <span class="meta-label">Media</span><span class="meta-value">Mixed Media using Physical Computing,
                    Generative Design</span>
                <span class="meta-label">Tools</span><span class="meta-value">TouchDesigner, Arduino, Raspberry
                    Pi</span>
            </div>

            <div class="full-img">
                <div style="padding:56.25% 0 0 0;position:relative;"><iframe
                    src="https://player.vimeo.com/video/1086204137?h=ad2f5560ce&amp;title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    style="position:absolute;top:0;left:0;width:100%;height:100%;"
                    title="Echoes of Presence - Pranav Chaparala"></iframe></div>
                <script src="https://player.vimeo.com/api/player.js"></script>
            </div>

            <h2>THE SEARCH</h2>
            <div class="img-grid">
                <div class="gallery-item"></div>
                <div class="gallery-item"></div>
            </div>

            <div class="gallery-grid">
                <div class="gallery-item"></div>
                <div class="gallery-item"></div>
                <div class="gallery-item"></div>
                <div class="gallery-item"></div>
                <div class="gallery-item"></div>
                <div class="gallery-item"></div>
            </div>
        `
    },
    {
        id: "clanx",
        title: "ClanX",
        img: "clanx.png",
        link: "project.html?id=clanx",
        content: `
            <h1>ClanX: Deep Profile</h1>
            <p class="body-text">
                This case study explores the key features, design philosophy, and potential impact of Deep Profiles
                on ClanX, an AI-powered recruitment platform.
            </p>
            <p class="body-text">
                It highlights the importance of understanding recruiter needs, analyzing essential candidate data
                points, and designing efficient, user-centered workflows.
            </p>

            <div class="meta-grid">
                <span class="meta-label">Year</span>
                <span class="meta-value">2024</span>
                <span class="meta-label">Client</span>
                <span class="meta-value">ClanX</span>
                <span class="meta-label">Team</span>
                <span class="meta-value">Pranav Chaparala, Ruchit Mehta</span>
            </div>

            <!-- Notice paths here rely on being called from project.html at root, 
                 so assets/1.png would be projects/clanx/assets/1.png -->
            <img src="projects/clanx/assets/1.png" alt="01">
            <img src="projects/clanx/assets/2.png" alt="02">
            <img src="projects/clanx/assets/3.png" alt="03">
            <img src="projects/clanx/assets/4.png" alt="04">
            <img src="projects/clanx/assets/5.png" alt="05">
            <img src="projects/clanx/assets/6.png" alt="06">
        `
    },
    {
        id: "lectrixEV",
        title: "Lectrix EV",
        img: "lectrix.png",
        link: "project.html?id=lectrixEV",
        content: `
            <h1>Lectrix EV: Deep Profile</h1>
            <p class="body-text">
                This case study explores the key features, design philosophy, and potential impact of Deep Profiles
                on ClanX, an AI-powered recruitment platform.
            </p>
            <p class="body-text">
                It highlights the importance of understanding recruiter needs, analyzing essential candidate data
                points, and designing efficient, user-centered workflows.
            </p>

            <div class="meta-grid">
                <span class="meta-label">Year</span>
                <span class="meta-value">2024</span>
                <span class="meta-label">Client</span>
                <span class="meta-value">ClanX</span>
                <span class="meta-label">Team</span>
                <span class="meta-value">Pranav Chaparala, Ruchit Mehta</span>
            </div>

            <!-- Notice paths here rely on being called from project.html at root, 
                 so assets/1.png would be projects/clanx/assets/1.png -->
            <img src="projects/lectrix/assets/1.png" alt="01">
            <img src="projects/lectrix/assets/2.png" alt="02">
            <img src="projects/lectrix/assets/3.png" alt="03">
            <img src="projects/lectrix/assets/4.png" alt="04">
            <img src="projects/lectrix/assets/5.png" alt="05">
            <img src="projects/lectrix/assets/6.png" alt="06">
        `
    },
    { id: "lectrix", title: "Lectrix EV", img: "lectrix.png", link: "project.html?id=lectrix", content: "<h1>Lectrix EV</h1><p>Content coming soon.</p>" },
    { id: "lunaring", title: "Noise: Luna Ring", img: "lunaring.png", link: "project.html?id=lunaring", content: "<h1>Noise: Luna Ring</h1><p>Content coming soon.</p>" },
    { id: "viewbuds", title: "Noise: View Buds", img: "echoesofpresence.png", link: "project.html?id=viewbuds", content: "<h1>Noise: View Buds</h1><p>Content coming soon.</p>" },
    { id: "oxygen", title: "OxygenOS 12", img: "lectrix.png", link: "project.html?id=oxygen", content: "<h1>OxygenOS 12</h1><p>Content coming soon.</p>" },
    { id: "gudz", title: "Gudz Logistics", img: "echoesofpresence.png", link: "project.html?id=gudz", content: "<h1>Gudz Logistics</h1><p>Content coming soon.</p>" },
    { id: "bezapp", title: "Bezapp", img: "clanx.png", link: "project.html?id=bezapp", content: "<h1>Bezapp</h1><p>Content coming soon.</p>" },
    { id: "inka", title: "Inka", img: "lectrix.png", link: "project.html?id=inka", content: "<h1>Inka</h1><p>Content coming soon.</p>" },
    { id: "sar", title: "SĀR Rise Collection", img: "lunaring.png", link: "project.html?id=sar", content: "<h1>SĀR Rise Collection</h1><p>Content coming soon.</p>" }
];
