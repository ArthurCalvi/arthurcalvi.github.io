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
  const resultCause = diagram.querySelector("[data-disturbance-result-cause]");
  const resultConfidence = diagram.querySelector("[data-disturbance-result-confidence]");
  const voteLedger = document.querySelector("[data-disturbance-vote-ledger]");
  const ledgerResult = voteLedger?.querySelector("[data-disturbance-ledger-result]");
  const sourceRows = voteLedger ? [...voteLedger.querySelectorAll("[data-disturbance-source-row]")] : [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clusterResults = {
    primary: {
      label: "Selected cluster 01",
      extent: "Cluster envelope",
      period: "2018–2020",
      cause: "Biotic",
      confidence: "76%",
      summary: "Biotic 76% · Drought 24%",
      sources: [
        { record: "Health · 2019", cause: "Biotic", reliability: "0.90", contribution: "+0.90" },
        { record: "Drought · 2018", cause: "Drought", reliability: "0.50", contribution: "+0.50" },
        { record: "Health · 2020", cause: "Biotic", reliability: "0.90", contribution: "+0.90" },
        { record: "Map · 2018", cause: "Biotic / drought", reliability: "0.70 × 0.30", contribution: "+0.21 split" },
      ],
    },
    secondary: {
      label: "Selected cluster 02",
      extent: "Cluster envelope",
      period: "2019–2020",
      cause: "Fire",
      confidence: "65%",
      summary: "Fire 65% · Drought 35%",
      sources: [
        { record: "Fire · 2020", cause: "Fire", reliability: "1.00", contribution: "+1.00" },
        { record: "Drought · 2019", cause: "Drought", reliability: "0.50", contribution: "+0.50" },
        { record: "Map · 2020", cause: "Fire / drought", reliability: "0.70 × 0.30", contribution: "+0.21 split" },
      ],
    },
  };

  const setInteractive = (enabled) => {
    diagram.classList.toggle("is-interactive", enabled);
    clusterButtons.forEach((cluster) => {
      cluster.setAttribute("tabindex", enabled ? "0" : "-1");
      cluster.setAttribute("aria-disabled", enabled ? "false" : "true");
    });
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
    resultCause.textContent = selectedResult.cause;
    resultConfidence.textContent = selectedResult.confidence;
    if (ledgerResult) {
      ledgerResult.textContent = selectedResult.summary;
    }
    result.setAttribute(
      "aria-label",
      `Output of ${selectedResult.label.toLowerCase()}: ${selectedResult.cause} ${selectedResult.confidence}`
    );
    voteLedger?.setAttribute(
      "aria-label",
      `Illustrative reliability-weighted vote for ${selectedResult.label.toLowerCase()}`
    );

    sourceRows.forEach((row, index) => {
      const source = selectedResult.sources[index];
      row.hidden = !source;
      if (!source) {
        return;
      }
      row.querySelector("[data-disturbance-source-record]").textContent = source.record;
      row.querySelector("[data-disturbance-source-cause]").textContent = source.cause;
      row.querySelector("[data-disturbance-source-reliability]").textContent = source.reliability;
      row.querySelector("[data-disturbance-source-contribution]").textContent = source.contribution;
    });

    result.classList.remove("is-updated");
    voteLedger?.classList.remove("is-updated");
    if (animate) {
      void result.offsetWidth;
      result.classList.add("is-updated");
      voteLedger?.classList.add("is-updated");
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
    setInteractive(true);
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
    setInteractive(false);
    selectCluster("primary", false);
    diagram.classList.remove("is-animated");
    void diagram.offsetWidth;
    diagram.classList.add("is-animated");
    interactiveTimer = window.setTimeout(() => {
      setInteractive(true);
    }, 5900);
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
