(() => {
  document.querySelectorAll("[data-image-comparison]").forEach((comparison) => {
    const control = comparison.querySelector(".image-comparison-control");
    const leftLabel = comparison.querySelector(".image-comparison-label-before");
    const rightLabel = comparison.querySelector(".image-comparison-label-after");

    if (!control) return;

    const update = () => {
      const value = Number(control.value);
      comparison.style.setProperty("--comparison-position", `${value}%`);
      control.setAttribute("aria-valuetext", `${value}% segmentation visible`);
    };

    const moveWithKeyboard = (event) => {
      const current = Number(control.value);
      const minimum = Number(control.min);
      const maximum = Number(control.max);
      const step = Number(control.step) || 1;
      let next = null;

      if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = current - step;
      if (event.key === "ArrowRight" || event.key === "ArrowUp") next = current + step;
      if (event.key === "PageDown") next = current - (step * 10);
      if (event.key === "PageUp") next = current + (step * 10);
      if (event.key === "Home") next = minimum;
      if (event.key === "End") next = maximum;
      if (next === null) return;

      event.preventDefault();
      control.value = Math.min(maximum, Math.max(minimum, next));
      update();
    };

    comparison.classList.add("is-enhanced");
    if (leftLabel) leftLabel.textContent = "Segmentation";
    if (rightLabel) rightLabel.textContent = "Satellite";
    control.addEventListener("input", update);
    control.addEventListener("keydown", moveWithKeyboard);
    update();
  });
})();
