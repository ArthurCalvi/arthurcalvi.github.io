(() => {
  const diagram = document.querySelector("[data-disturbance-graph]");

  if (!diagram) {
    return;
  }

  const replay = diagram.querySelector("[data-disturbance-replay]");
  const clusterButtons = [...diagram.querySelectorAll("[data-disturbance-cluster]")];
  const voteFlows = [...diagram.querySelectorAll("[data-disturbance-vote-flows]")];
  const targets = [...diagram.querySelectorAll("[data-disturbance-target]")];
  const result = diagram.querySelector(".disturbance-graph-result");
  const resultKicker = diagram.querySelector("[data-disturbance-result-kicker]");
  const resultExtent = diagram.querySelector("[data-disturbance-result-extent]");
  const resultPeriod = diagram.querySelector("[data-disturbance-result-period]");
  const voteResult = diagram.querySelector(".disturbance-vote-result");
  const voteRows = [...diagram.querySelectorAll("[data-disturbance-vote-row]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clusterResults = {
    primary: {
      label: "Selected cluster 01",
      extent: "Cluster envelope",
      period: "2018–2020",
      votes: [
        { label: "Biotic", note: "Most support", tone: "accent", width: "88%" },
        { label: "Drought", note: "Alternative", tone: "rust", width: "43%" },
        { label: "Unknown", note: "Uncertainty kept", tone: "muted", width: "18%" },
      ],
    },
    secondary: {
      label: "Selected cluster 02",
      extent: "Cluster envelope",
      period: "2019–2020",
      votes: [
        { label: "Fire", note: "Most support", tone: "rust", width: "86%" },
        { label: "Drought", note: "Alternative", tone: "accent", width: "39%" },
        { label: "Unknown", note: "Uncertainty kept", tone: "muted", width: "16%" },
      ],
    },
  };

  const selectCluster = (key, animate = true) => {
    const selectedResult = clusterResults[key];

    if (!selectedResult) {
      return;
    }

    clusterButtons.forEach((cluster) => {
      const selected = cluster.dataset.disturbanceCluster === key;
      cluster.classList.toggle("is-selected", selected);
      cluster.setAttribute("aria-pressed", selected ? "true" : "false");
    });

    voteFlows.forEach((flow) => {
      flow.classList.toggle("is-selected", flow.dataset.disturbanceVoteFlows === key);
    });

    targets.forEach((target) => {
      target.classList.toggle("is-selected-target", target.dataset.disturbanceTarget === key);
    });

    resultKicker.textContent = selectedResult.label;
    resultExtent.textContent = selectedResult.extent;
    resultPeriod.textContent = selectedResult.period;
    result.setAttribute("aria-label", `Output of ${selectedResult.label.toLowerCase()}`);
    voteResult.setAttribute(
      "aria-label",
      `Illustrative reliability-weighted cause vote for ${selectedResult.label.toLowerCase()}`
    );

    voteRows.forEach((row, index) => {
      const vote = selectedResult.votes[index];
      row.querySelector("[data-disturbance-vote-label]").textContent = vote.label;
      row.querySelector("[data-disturbance-vote-note]").textContent = vote.note;
      row.dataset.tone = vote.tone;
      row.style.setProperty("--vote-width", vote.width);
    });

    result.classList.remove("is-updated");
    if (animate) {
      void result.offsetWidth;
      result.classList.add("is-updated");
    }
  };

  clusterButtons.forEach((cluster) => {
    const choose = () => {
      if (!diagram.classList.contains("is-interactive")) {
        return;
      }
      selectCluster(cluster.dataset.disturbanceCluster);
    };

    cluster.addEventListener("click", choose);
    cluster.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      choose();
    });
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    diagram.classList.add("is-interactive");
    selectCluster("primary", false);
    return;
  }

  diagram.classList.add("is-ready");
  if (replay) {
    replay.hidden = false;
  }

  let interactiveTimer;
  const play = () => {
    window.clearTimeout(interactiveTimer);
    diagram.classList.remove("is-interactive");
    selectCluster("primary", false);
    diagram.classList.remove("is-animated");
    void diagram.offsetWidth;
    diagram.classList.add("is-animated");
    interactiveTimer = window.setTimeout(() => {
      diagram.classList.add("is-interactive");
    }, 5650);
  };

  replay?.addEventListener("click", () => {
    play();
    replay.focus({ preventScroll: true });
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        return;
      }

      play();
      observer.disconnect();
    },
    { threshold: 0.25 }
  );

  observer.observe(diagram);
})();
