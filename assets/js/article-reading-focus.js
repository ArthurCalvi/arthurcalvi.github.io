(() => {
  const page = document.querySelector("[data-reading-focus-page]");
  const blocks = [...document.querySelectorAll("[data-reading-focus]")];

  if (!page || !blocks.length || !("IntersectionObserver" in window)) return;

  const motionQuery = window.matchMedia(
    "(min-width: 901px) and (prefers-reduced-motion: no-preference)"
  );
  let isObserving = false;

  const syncPageState = () => {
    page.classList.toggle(
      "has-reading-focus",
      blocks.some((block) => block.classList.contains("is-reading-focus"))
    );
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-reading-focus", entry.isIntersecting);
      });
      syncPageState();
    },
    { rootMargin: "-30% 0px -30% 0px", threshold: 0.2 }
  );

  const updateMode = () => {
    if (motionQuery.matches && !isObserving) {
      blocks.forEach((block) => observer.observe(block));
      isObserving = true;
      return;
    }

    if (!motionQuery.matches) {
      observer.disconnect();
      isObserving = false;
      blocks.forEach((block) => block.classList.remove("is-reading-focus"));
      syncPageState();
    }
  };

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", updateMode);
  } else {
    motionQuery.addListener(updateMode);
  }

  updateMode();
})();
