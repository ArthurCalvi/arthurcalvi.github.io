(() => {
  const hero = document.querySelector(".home-hero");
  const layer = hero?.querySelector(".home-hero-parallax");

  if (!hero || !layer) return;

  const motionQuery = window.matchMedia(
    "(min-width: 901px) and (prefers-reduced-motion: no-preference)"
  );
  let frame = 0;

  const update = () => {
    frame = 0;

    if (!motionQuery.matches) {
      layer.style.removeProperty("--hero-parallax-y");
      document.body.style.removeProperty("--grid-shift-x");
      document.body.style.removeProperty("--grid-shift-y");
      return;
    }

    const distance = Math.max(0, window.scrollY);
    const progress = Math.min(1, distance / Math.max(hero.offsetHeight, 1));
    layer.style.setProperty("--hero-parallax-y", `${progress * 72}px`);
    document.body.style.setProperty("--grid-shift-x", `${(distance * 0.01) % 40}px`);
    document.body.style.setProperty("--grid-shift-y", `${(distance * 0.018) % 40}px`);
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", update);
  } else {
    motionQuery.addListener(update);
  }

  update();
})();
