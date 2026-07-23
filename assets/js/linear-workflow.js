(() => {
  const workflow = document.querySelector("[data-linear-workflow]");

  if (
    !workflow ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        return;
      }

      workflow.classList.add("is-animated");
      observer.disconnect();
    },
    { threshold: 0.25 }
  );

  observer.observe(workflow);
})();
