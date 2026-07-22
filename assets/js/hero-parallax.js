(() => {
  const hero = document.querySelector(".home-hero");
  const layer = hero?.querySelector(".home-hero-parallax");

  if (!hero || !layer) return;

  const motionQuery = window.matchMedia(
    "(min-width: 761px) and (prefers-reduced-motion: no-preference)"
  );
  let frame = 0;

  const update = () => {
    frame = 0;

    if (!motionQuery.matches) {
      layer.style.removeProperty("--hero-parallax-y");
      return;
    }

    const distance = Math.max(0, -hero.getBoundingClientRect().top);
    const progress = Math.min(1, distance / Math.max(hero.offsetHeight, 1));
    layer.style.setProperty("--hero-parallax-y", `${progress * 48}px`);
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
