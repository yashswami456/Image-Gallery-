# Image-Gallery-
A responsive image gallery built using HTML, CSS, and JavaScript.
Contact Sheet — Image Gallery
A responsive image gallery with category filtering and a lightbox viewer, built with plain HTML, CSS, and JavaScript (no frameworks, no build step).

Live demo — replace with your GitHub Pages link after deploying (see below).

Features
Masonry-style grid gallery laid out like a contact sheet on a gallery wall
Category filters (Architecture / Nature / Street / Portrait — edit freely)
Lightbox viewer with:
Next / previous buttons
Keyboard navigation (← → to move, Esc to close)
Touch swipe support on mobile
A film-frame style counter (frame_04 / 12)
Hover lift + zoom effect on each frame, smooth crossfade between lightbox images
Fully responsive (4 → 3 → 2 column grid, adjusted spacing/typography at each breakpoint)
Respects prefers-reduced-motion
No dependencies — just three files
Files
.
├── index.html     # markup + lightbox structure
├── style.css      # all styling, responsive rules
├── gallery.js     # rendering, filtering, lightbox logic
└── README.md
Using your own images
Open gallery.js and edit the DATA array near the top:

const DATA = [
  { id: 1, title: "Glass & Grid", category: "architecture", size: "tall", src: "images/01.jpg" },
  // ...
];
src — path to your image. Can be a local file (e.g. images/01.jpg, put the file in an images/ folder next to index.html) or a remote URL.
category — must match one of the data-filter values in index.html's <nav class="filters">, or add your own filter button there.
size — "tall", "med", or "short". Controls how much vertical space the frame takes in the masonry grid. Mix them up for a natural-looking wall.
To add or remove filter categories, edit the <nav class="filters"> block in index.html to match.

Running locally
No build tools needed. Either:

Open index.html directly in a browser, or
Serve it locally (recommended, avoids any local file-loading quirks):
python3 -m http.server 8000
then visit http://localhost:8000
Deploying to GitHub Pages
Push this folder to a GitHub repository.
Go to Settings → Pages.
Under "Build and deployment", set Source to Deploy from a branch, choose your default branch and / (root).
Save — your gallery will be live at https://<username>.github.io/<repo-name>/ within a minute or two.
Browser support
Works in all modern browsers (Chrome, Firefox, Safari, Edge). Uses CSS custom properties, CSS Grid, and backdrop-filter (the lightbox blur gracefully degrades to a plain dark overlay where unsupported).
