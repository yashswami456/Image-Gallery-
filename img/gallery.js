/* ============================================================
   Contact Sheet — gallery logic
   - renders frames from DATA
   - category filtering
   - lightbox with prev/next, keyboard, swipe, click-outside-to-close
   ============================================================ */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. DATA
     Swap these objects for your own images. `src` can be any
     local path (e.g. "images/01.jpg") or remote URL.
     `size` controls the masonry row-span: "tall" | "med" | "short"
  --------------------------------------------------------- */
  const DATA = [
    { id: 1,  title: "Glass & Grid",        category: "architecture", size: "tall",  src: "https://picsum.photos/id/164/700/950" },
    { id: 2,  title: "Concrete Hours",       category: "architecture", size: "med",   src: "https://picsum.photos/id/1031/700/780" },
    { id: 3,  title: "Stairwell Study",      category: "architecture", size: "short", src: "https://picsum.photos/id/1048/700/620" },
    { id: 4,  title: "Quiet Ridge",          category: "nature",       size: "tall",  src: "https://picsum.photos/id/1018/700/950" },
    { id: 5,  title: "Low Tide",             category: "nature",       size: "short", src: "https://picsum.photos/id/1043/700/620" },
    { id: 6,  title: "Fern Light",           category: "nature",       size: "med",   src: "https://picsum.photos/id/15/700/780" },
    { id: 7,  title: "Crosswalk, 5pm",       category: "street",       size: "med",   src: "https://picsum.photos/id/1011/700/780" },
    { id: 8,  title: "Corner Store",         category: "street",       size: "tall",  src: "https://picsum.photos/id/1015/700/950" },
    { id: 9,  title: "Wet Pavement",         category: "street",       size: "short", src: "https://picsum.photos/id/1025/700/620" },
    { id: 10, title: "Half-Light",           category: "portrait",     size: "tall",  src: "https://picsum.photos/id/64/700/950" },
    { id: 11, title: "Window Seat",          category: "portrait",     size: "med",   src: "https://picsum.photos/id/91/700/780" },
    { id: 12, title: "Held Still",           category: "portrait",     size: "short", src: "https://picsum.photos/id/177/700/620" },
  ];

  /* ---------------------------------------------------------
     2. RENDER FRAMES
  --------------------------------------------------------- */
  const wall = document.getElementById("wall");

  function frameMarkup(item, index) {
    const num = String(index + 1).padStart(2, "0");
    return `
      <button class="frame" type="button"
              data-size="${item.size}"
              data-category="${item.category}"
              data-index="${index}"
              style="animation-delay:${Math.min(index * 45, 400)}ms"
              aria-label="Open ${item.title} in viewer">
        <div class="frame__img-wrap">
          <img src="${item.src}" alt="${item.title}" loading="lazy">
        </div>
        <div class="frame__meta">
          <span class="frame__title">${item.title}</span>
          <span class="frame__index">${num}</span>
        </div>
      </button>
    `;
  }

  function renderWall() {
    wall.innerHTML = DATA.map(frameMarkup).join("");
  }

  renderWall();

  /* ---------------------------------------------------------
     3. FILTERING
  --------------------------------------------------------- */
  const filterBtns = document.querySelectorAll(".filters__btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.dataset.filter;
      document.querySelectorAll(".frame").forEach((frame) => {
        const match = filter === "all" || frame.dataset.category === filter;
        frame.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------------------------------------------------------
     4. LIGHTBOX
  --------------------------------------------------------- */
  const lightbox      = document.getElementById("lightbox");
  const lightboxImg   = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCat   = document.getElementById("lightboxCategory");
  const frameIndexEl  = document.getElementById("frameIndex");
  const prevBtn        = document.getElementById("prevBtn");
  const nextBtn        = document.getElementById("nextBtn");

  let currentIndex = 0;
  let lastFocusedFrame = null;

  function visibleItems() {
    // Navigation should respect the active filter, so prev/next only
    // move through frames currently shown on the wall.
    const visibleFrames = [...document.querySelectorAll(".frame:not(.is-hidden)")];
    return visibleFrames.map((f) => DATA[Number(f.dataset.index)]);
  }

  function openLightbox(globalIndex) {
    const items = visibleItems();
    const item = DATA[globalIndex];
    const posInVisible = items.findIndex((i) => i.id === item.id);
    currentIndex = posInVisible >= 0 ? posInVisible : 0;

    renderLightbox(false);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function renderLightbox(animateSwap) {
    const items = visibleItems();
    const item = items[currentIndex];
    if (!item) return;

    const setContent = () => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
      lightboxTitle.textContent = item.title;
      lightboxCat.textContent = item.category;
      const total = String(items.length).padStart(2, "0");
      const pos = String(currentIndex + 1).padStart(2, "0");
      frameIndexEl.textContent = `frame_${pos} / ${total}`;
    };

    if (animateSwap) {
      lightboxImg.classList.add("is-switching");
      setTimeout(() => {
        setContent();
        lightboxImg.classList.remove("is-switching");
      }, 140);
    } else {
      setContent();
    }
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedFrame) lastFocusedFrame.focus();
  }

  function step(delta) {
    const items = visibleItems();
    if (!items.length) return;
    currentIndex = (currentIndex + delta + items.length) % items.length;
    renderLightbox(true);
  }

  // open on frame click
  wall.addEventListener("click", (e) => {
    const frame = e.target.closest(".frame");
    if (!frame) return;
    lastFocusedFrame = frame;
    openLightbox(Number(frame.dataset.index));
  });

  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  document.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeLightbox)
  );

  // keyboard controls
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  // touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) < 40) return;
    dx > 0 ? step(-1) : step(1);
  }, { passive: true });

})();
