(function () {
  const demo = document.querySelector("[data-guetteur-demo]");
  if (!demo) return;

  const form = demo.querySelector("[data-guetteur-form]");
  const track = demo.querySelector("[data-guetteur-track]");
  const viewport = demo.querySelector("[data-guetteur-viewport]");
  const summary = demo.querySelector("[data-guetteur-summary]");
  const position = demo.querySelector("[data-guetteur-position]");
  const previous = demo.querySelector("[data-guetteur-previous]");
  const next = demo.querySelector("[data-guetteur-next]");
  const mapFrame = demo.querySelector("[data-guetteur-map-frame]");
  const mapTiles = demo.querySelector("[data-guetteur-map-tiles]");
  const mapLines = demo.querySelector("[data-guetteur-map-lines]");
  const mapMarkers = demo.querySelector("[data-guetteur-map-markers]");
  const mapLegend = demo.querySelector("[data-guetteur-map-legend]");
  const mapDeparture = demo.querySelector("[data-guetteur-map-departure]");
  const mapCount = demo.querySelector("[data-guetteur-map-count]");
  const mapOtherCount = demo.querySelector("[data-guetteur-map-other-count]");
  const source = demo.dataset.source;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let snapshot = null;
  let cards = [];
  let activeIndex = 0;
  let currentMapArea = null;
  let currentMapOpportunities = [];
  let mapResizeFrame = null;

  const availabilityLabels = {
    afternoon: "afternoon",
    after_work: "after-work",
    morning: "early-morning",
  };
  const levelLabels = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  const svgNamespace = "http://www.w3.org/2000/svg";
  const mapTileSize = 256;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function metric(label, value) {
    const wrapper = element("div");
    wrapper.append(element("dt", null, label), element("dd", null, value));
    return wrapper;
  }

  function svgElement(tag, attributes, text) {
    const node = document.createElementNS(svgNamespace, tag);
    Object.entries(attributes || {}).forEach(([name, value]) => {
      node.setAttribute(name, String(value));
    });
    if (text != null) node.textContent = text;
    return node;
  }

  function potentialTier(score) {
    if (score >= 85) return "excellent";
    if (score >= 70) return "good";
    if (score >= 50) return "watch";
    return "low";
  }

  function potentialColor(score) {
    if (score >= 85) return "#1d6a4a";
    if (score >= 70) return "#5f7d46";
    if (score >= 50) return "#c99237";
    return "#b95c3e";
  }

  function mapWorldPixel(point, zoom) {
    const latitude = Math.max(-85.05112878, Math.min(85.05112878, point.lat));
    const sine = Math.sin((latitude * Math.PI) / 180);
    const scale = mapTileSize * 2 ** zoom;
    return {
      x: ((point.lng + 180) / 360) * scale,
      y:
        (0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)) *
        scale,
    };
  }

  function mapProjection(area, opportunities, width, height) {
    const points = [
      area.departurePoint,
      ...opportunities.map((opportunity) => opportunity.coordinates),
    ].filter(
      (point) =>
        Number.isFinite(point?.lat) && Number.isFinite(point?.lng),
    );
    if (!points.length) return null;

    const paddingX = Math.min(52, Math.max(28, width * 0.06));
    const paddingY = Math.min(30, Math.max(22, height * 0.14));
    let zoom = 13;
    let projected = [];
    for (; zoom >= 5; zoom -= 1) {
      projected = points.map((point) => mapWorldPixel(point, zoom));
      const xValues = projected.map((point) => point.x);
      const yValues = projected.map((point) => point.y);
      const spanX = Math.max(...xValues) - Math.min(...xValues);
      const spanY = Math.max(...yValues) - Math.min(...yValues);
      if (
        spanX <= width - paddingX * 2 &&
        spanY <= height - paddingY * 2
      ) {
        break;
      }
    }

    const xValues = projected.map((point) => point.x);
    const yValues = projected.map((point) => point.y);
    const centerX = (Math.min(...xValues) + Math.max(...xValues)) / 2;
    const centerY = (Math.min(...yValues) + Math.max(...yValues)) / 2;
    const originX = centerX - width / 2;
    const originY = centerY - height / 2;
    return {
      height,
      originX,
      originY,
      points: projected.map((point) => ({
        x: point.x - originX,
        y: point.y - originY,
      })),
      width,
      zoom,
    };
  }

  function mapTileSource(template, zoom, x, y) {
    return template
      .replace("{z}", String(zoom))
      .replace("{x}", String(x))
      .replace("{y}", String(y));
  }

  function updateMapSelection(index) {
    if (!mapMarkers || !mapLines) return;
    mapMarkers
      .querySelectorAll("[data-guetteur-map-index]")
      .forEach((marker) => {
        marker.classList.toggle(
          "is-active",
          Number(marker.dataset.guetteurMapIndex) === index,
        );
      });
    mapLines
      .querySelectorAll("[data-guetteur-map-index]")
      .forEach((line) => {
        line.classList.toggle(
          "is-active",
          Number(line.dataset.guetteurMapIndex) === index,
        );
      });
  }

  function renderOpportunityMap(area, opportunities) {
    if (
      !mapFrame ||
      !mapTiles ||
      !mapLines ||
      !mapMarkers ||
      !snapshot?.mapTiles ||
      !area?.departurePoint
    ) {
      return;
    }

    currentMapArea = area;
    currentMapOpportunities = opportunities;
    const width = Math.round(mapFrame.clientWidth);
    const height = Math.round(mapFrame.clientHeight);
    if (!width || !height) return;

    const hasCoordinates = (spot) =>
      Number.isFinite(spot?.coordinates?.lat) &&
      Number.isFinite(spot?.coordinates?.lng);
    const proposedEntries = opportunities
      .map((opportunity, carouselIndex) => ({
        carouselIndex,
        opportunity,
      }))
      .filter(({ opportunity }) => hasCoordinates(opportunity));
    const proposedNames = new Set(
      opportunities.map((opportunity) => opportunity.spot),
    );
    const seenOtherNames = new Set();
    const otherSpots = [
      ...(area.opportunities || []).filter(
        (opportunity) => !proposedNames.has(opportunity.spot),
      ),
      ...(area.contextSpots || []),
    ].filter((spot) => {
      if (
        !spot?.spot ||
        !hasCoordinates(spot) ||
        proposedNames.has(spot.spot) ||
        seenOtherNames.has(spot.spot)
      ) {
        return false;
      }
      seenOtherNames.add(spot.spot);
      return true;
    });
    const mapInventory = [
      ...proposedEntries.map(({ opportunity }) => opportunity),
      ...otherSpots,
    ];
    const geometry = mapProjection(area, mapInventory, width, height);
    if (!geometry) return;

    const maximumTile = 2 ** geometry.zoom;
    const firstTileX = Math.floor(geometry.originX / mapTileSize);
    const lastTileX = Math.floor(
      (geometry.originX + geometry.width) / mapTileSize,
    );
    const firstTileY = Math.floor(geometry.originY / mapTileSize);
    const lastTileY = Math.floor(
      (geometry.originY + geometry.height) / mapTileSize,
    );
    const tileFragment = document.createDocumentFragment();

    for (let tileY = firstTileY; tileY <= lastTileY; tileY += 1) {
      if (tileY < 0 || tileY >= maximumTile) continue;
      for (let tileX = firstTileX; tileX <= lastTileX; tileX += 1) {
        const wrappedX = ((tileX % maximumTile) + maximumTile) % maximumTile;
        const image = element("img", "guetteur-map-tile");
        image.alt = "";
        image.decoding = "async";
        image.draggable = false;
        image.loading = "lazy";
        image.src = mapTileSource(
          snapshot.mapTiles.urlTemplate,
          geometry.zoom,
          wrappedX,
          tileY,
        );
        image.style.left = `${tileX * mapTileSize - geometry.originX}px`;
        image.style.top = `${tileY * mapTileSize - geometry.originY}px`;
        tileFragment.append(image);
      }
    }
    mapTiles.replaceChildren(tileFragment);

    mapLines.setAttribute(
      "viewBox",
      `0 0 ${geometry.width} ${geometry.height}`,
    );
    const departurePosition = geometry.points[0];
    const lineFragment = document.createDocumentFragment();
    proposedEntries.forEach(({ carouselIndex }, positionIndex) => {
      const position = geometry.points[positionIndex + 1];
      if (!position) return;
      const line = svgElement("line", {
        class: `guetteur-map-route${carouselIndex === activeIndex ? " is-active" : ""}`,
        "data-guetteur-map-index": carouselIndex,
        x1: departurePosition.x,
        x2: position.x,
        y1: departurePosition.y,
        y2: position.y,
      });
      lineFragment.append(line);
    });
    mapLines.replaceChildren(lineFragment);

    const markerFragment = document.createDocumentFragment();
    const departureMarker = element(
      "div",
      "guetteur-map-marker is-departure",
    );
    departureMarker.style.left = `${departurePosition.x}px`;
    departureMarker.style.top = `${departurePosition.y}px`;
    departureMarker.append(
      element("span", "guetteur-map-marker-label", area.departure),
    );
    markerFragment.append(departureMarker);

    proposedEntries.forEach(
      ({ carouselIndex, opportunity }, positionIndex) => {
        const position = geometry.points[positionIndex + 1];
        if (!position) return;
        const marker = element(
          "button",
          `guetteur-map-marker is-opportunity is-${potentialTier(opportunity.potential)}${carouselIndex === activeIndex ? " is-active" : ""}`,
        );
        marker.type = "button";
        marker.dataset.guetteurMapIndex = String(carouselIndex);
        marker.setAttribute(
          "aria-label",
          `Show ${opportunity.spot}, potential ${opportunity.potential} out of 100`,
        );
        marker.style.left = `${position.x}px`;
        marker.style.top = `${position.y}px`;
        marker.append(
          element(
            "span",
            "guetteur-map-marker-label",
            `${opportunity.spot} · ${opportunity.potential}`,
          ),
        );
        marker.addEventListener("click", () => goTo(carouselIndex));
        markerFragment.append(marker);
      },
    );

    otherSpots.forEach((spot, index) => {
      const position = geometry.points[proposedEntries.length + index + 1];
      if (!position) return;
      const marker = element(
        "span",
        "guetteur-map-marker is-unavailable",
      );
      marker.setAttribute("aria-hidden", "true");
      marker.title = `${spot.spot} · not proposed for this search`;
      marker.style.left = `${position.x}px`;
      marker.style.top = `${position.y}px`;
      markerFragment.append(marker);
    });
    mapMarkers.replaceChildren(markerFragment);

    mapDeparture.textContent = area.departure;
    mapCount.textContent = `${opportunities.length} proposed`;
    mapOtherCount.textContent = `${otherSpots.length} not proposed`;
    mapLegend.setAttribute(
      "aria-label",
      `${area.departure} departure area, ${opportunities.length} proposed ${opportunities.length === 1 ? "spot" : "spots"}, ${otherSpots.length} other known ${otherSpots.length === 1 ? "spot" : "spots"} not proposed for this search`,
    );
    const proposedDescription = opportunities.length
      ? `Proposed spots: ${opportunities.map((opportunity) => opportunity.spot).join(", ")}.`
      : "No spots proposed.";
    const otherDescription = otherSpots.length
      ? `Other known spots not proposed for this search: ${otherSpots.map((spot) => spot.spot).join(", ")}.`
      : "";
    mapFrame.setAttribute(
      "aria-label",
      `Departure area ${area.departure}. ${proposedDescription} ${otherDescription}`.trim(),
    );
  }

  function opportunityPhoto(opportunity, index) {
    const photo = opportunity.photo;
    if (!photo || !snapshot?.photoBaseUrl) return null;

    const figure = element("figure", "guetteur-opportunity-media");
    figure.style.setProperty(
      "--guetteur-photo-position",
      photo.position || "50% 50%",
    );

    const image = element("img");
    image.src = `${snapshot.photoBaseUrl.replace(/\/$/, "")}/${photo.path}`;
    image.alt = photo.alt || `Surf conditions at ${opportunity.spot}`;
    image.width = Number(photo.width) || 1200;
    image.height = Number(photo.height) || 800;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";

    const caption = element("figcaption");
    const credit = element(
      "a",
      null,
      `${photo.credit || "Contributor"} · Google Maps`,
    );
    credit.href = photo.creditUrl || "https://maps.google.com/";
    credit.target = "_blank";
    credit.rel = "noreferrer";
    caption.append("Photo · ", credit);
    figure.append(image, caption);
    return figure;
  }

  function monotonePath(points) {
    if (!points.length) return "";
    if (points.length === 1) return `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

    const dx = [];
    const slopes = [];
    for (let index = 0; index < points.length - 1; index += 1) {
      dx[index] = points[index + 1].x - points[index].x;
      slopes[index] = (points[index + 1].y - points[index].y) / (dx[index] || 1e-6);
    }

    const tangents = new Array(points.length);
    tangents[0] = slopes[0];
    tangents[points.length - 1] = slopes[slopes.length - 1];
    for (let index = 1; index < points.length - 1; index += 1) {
      if (slopes[index - 1] * slopes[index] <= 0) {
        tangents[index] = 0;
      } else {
        const firstWeight = 2 * dx[index] + dx[index - 1];
        const secondWeight = dx[index] + 2 * dx[index - 1];
        tangents[index] =
          (firstWeight + secondWeight) /
          (firstWeight / slopes[index - 1] + secondWeight / slopes[index]);
      }
    }

    let path = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let index = 0; index < points.length - 1; index += 1) {
      const third = dx[index] / 3;
      path +=
        ` C${(points[index].x + third).toFixed(1)},${(points[index].y + tangents[index] * third).toFixed(1)}` +
        ` ${(points[index + 1].x - third).toFixed(1)},${(points[index + 1].y - tangents[index + 1] * third).toFixed(1)}` +
        ` ${points[index + 1].x.toFixed(1)},${points[index + 1].y.toFixed(1)}`;
    }
    return path;
  }

  function timelineDate(startDate, offset) {
    const date = new Date(`${startDate}T12:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + offset);
    return date;
  }

  function timelineData(opportunity) {
    const timeline = opportunity.potentialTimeline;
    const scores = timeline?.scores?.map((score) =>
      Math.max(0, Math.min(100, Number(score) || 0)),
    );
    if (!timeline || !scores?.length) return null;

    const selectedIndex = Math.max(
      0,
      Math.min(timeline.selectedIndex ?? 0, scores.length - 1),
    );
    const dates = scores.map((_, index) => timelineDate(timeline.startDate, index));
    const formatter = new Intl.DateTimeFormat("en", {
      weekday: "short",
      timeZone: "UTC",
    });
    const selectedDay = formatter.format(dates[selectedIndex]);
    const bestScore = Math.max(...scores);
    return {
      bestScore,
      dates,
      formatter,
      isBestDay: scores[selectedIndex] === bestScore,
      scores,
      selectedDay,
      selectedIndex,
    };
  }

  function timelineFigure(
    opportunity,
    data = timelineData(opportunity),
    cardIndex = 0,
  ) {
    if (!data) return null;
    const {
      dates,
      formatter,
      isBestDay,
      scores,
      selectedDay,
      selectedIndex,
    } = data;
    const threshold = snapshot?.timelinePresentation?.threshold ?? 70;
    const xFor = (index) =>
      scores.length === 1 ? 50 : 4 + (index / (scores.length - 1)) * 92;
    const yFor = (score) => 92 - score * 0.82;
    const points = scores.map((score, index) => ({
      score,
      x: xFor(index),
      y: yFor(score),
    }));

    const figure = element("figure", "guetteur-opportunity-timeline");
    figure.setAttribute(
      "aria-label",
      `Potential over seven days: ${scores
        .map((score, index) => `${formatter.format(dates[index])} ${score} out of 100`)
        .join(", ")}. ${isBestDay ? "Best" : "Selected"} window ${selectedDay}, ${opportunity.window}.`,
    );

    const caption = element("figcaption", "guetteur-timeline-head");
    caption.append(
      element("span", null, "Potential · 7 days"),
      element(
        "strong",
        null,
        opportunity.potential <= 0
          ? "No viable day"
          : `${isBestDay ? "Best day" : "Selected"} · ${selectedDay}`,
      ),
    );

    const plot = element("div", "guetteur-timeline-plot");
    const svg = svgElement("svg", {
      "aria-hidden": "true",
      preserveAspectRatio: "none",
      viewBox: "0 0 100 100",
    });
    const gradientId = `guetteur-timeline-gradient-${cardIndex}`;
    const definitions = svgElement("defs");
    const gradient = svgElement("linearGradient", {
      gradientUnits: "userSpaceOnUse",
      id: gradientId,
      x1: 4,
      x2: 96,
      y1: 0,
      y2: 0,
    });
    points.forEach((point) => {
      gradient.append(
        svgElement("stop", {
          offset: `${((point.x - 4) / 92) * 100}%`,
          "stop-color": potentialColor(point.score),
        }),
      );
    });
    definitions.append(gradient);
    svg.append(
      definitions,
      svgElement("line", {
        class: "guetteur-timeline-threshold",
        x1: 4,
        x2: 96,
        y1: yFor(threshold),
        y2: yFor(threshold),
      }),
      svgElement("path", {
        class: "guetteur-timeline-line",
        d: monotonePath(points),
        style: `stroke: url(#${gradientId})`,
      }),
    );

    const maximumIndex = scores.indexOf(Math.max(...scores));
    const labelled = new Set([maximumIndex, selectedIndex]);
    const scoreLabels = [];
    points.forEach((point, index) => {
      if (labelled.has(index)) {
        const label = element(
          "span",
          `guetteur-timeline-score-label${index === selectedIndex ? " is-selected" : ""}${index === 0 ? " is-first" : index === points.length - 1 ? " is-last" : ""}`,
          index === selectedIndex ? `${point.score}/100` : String(point.score),
        );
        label.style.setProperty("--timeline-x", `${point.x}%`);
        label.style.setProperty("--timeline-y", `${Math.max(7, point.y - 6)}%`);
        label.style.setProperty(
          "--timeline-score-color",
          potentialColor(point.score),
        );
        scoreLabels.push(label);
      }
    });
    plot.append(svg, ...scoreLabels);

    const days = element("ol", "guetteur-timeline-days");
    dates.forEach((date, index) => {
      days.append(
        element(
          "li",
          index === selectedIndex ? "is-selected" : null,
          formatter.format(date),
        ),
      );
    });

    figure.append(caption, plot, days);
    return figure;
  }

  function opportunityCard(opportunity, index, selectedAvailability, selectedLevel) {
    const exactWindow = opportunity.availability === selectedAvailability;
    const timelineInfo = timelineData(opportunity);
    const selectedDay = timelineInfo?.selectedDay || "Selected day";
    const article = element(
      "article",
      `guetteur-opportunity${index === 0 ? " is-active" : ""}`,
    );
    article.dataset.cardIndex = String(index);
    article.dataset.state = opportunity.state;
    article.setAttribute(
      "aria-label",
      `${opportunity.spot}, ${opportunity.potential} out of 100, ${selectedDay} ${opportunity.window}, ${levelLabels[selectedLevel]} level`,
    );
    const media = opportunityPhoto(opportunity, index);

    const heading = element("div", "guetteur-opportunity-heading");
    const title = element("h3", null, opportunity.spot);
    const score = element(
      "div",
      `guetteur-opportunity-score is-${potentialTier(opportunity.potential)}`,
    );
    score.append(
      element("strong", null, String(opportunity.potential)),
      element("span", null, "/100"),
    );
    heading.append(title, score);

    const recommendation = element(
      "dl",
      "guetteur-opportunity-recommendation",
    );
    recommendation.append(
      metric(
        exactWindow ? "Go" : "Closest window",
        `${selectedDay} · ${opportunity.window}`,
      ),
      metric("Level", levelLabels[selectedLevel]),
    );

    const timeline = timelineFigure(opportunity, timelineInfo, index);
    const conditions = element(
      "section",
      "guetteur-opportunity-conditions",
    );
    conditions.setAttribute(
      "aria-label",
      `Conditions on ${selectedDay}, ${opportunity.snapshotDate}`,
    );
    const conditionsHead = element(
      "div",
      "guetteur-opportunity-conditions-head",
    );
    conditionsHead.append(
      element("span", null, "Conditions that day"),
      element("span", null, opportunity.snapshotDate),
    );
    const conditionMetrics = element(
      "dl",
      "guetteur-opportunity-conditions-grid",
    );
    conditionMetrics.append(
      metric("Waves", `${opportunity.waveHeightM} m`),
      metric("Period", `${opportunity.periodS} s`),
      metric("Wind", `${opportunity.windKmh} km/h`),
      metric("Tide", opportunity.tide),
      metric("Water", `${opportunity.waterTempC} °C`),
    );
    conditions.append(conditionsHead, conditionMetrics);

    if (media) article.append(media);
    article.append(heading, recommendation);
    if (timeline) article.append(timeline);
    article.append(conditions);
    return article;
  }

  function updateNavigation(index) {
    activeIndex = Math.max(0, Math.min(index, cards.length - 1));
    cards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === activeIndex);
    });
    updateMapSelection(activeIndex);
    position.textContent = cards.length
      ? `${activeIndex + 1} / ${cards.length}`
      : "0 / 0";
    previous.disabled = activeIndex <= 0;
    next.disabled = activeIndex >= cards.length - 1;
  }

  function cardOffset(index) {
    const card = cards[index];
    if (!card) return 0;
    return card.offsetLeft - track.offsetLeft;
  }

  function goTo(index) {
    const bounded = Math.max(0, Math.min(index, cards.length - 1));
    viewport.scrollTo({
      left: cardOffset(bounded),
      behavior: reduceMotion ? "auto" : "smooth",
    });
    updateNavigation(bounded);
  }

  function render() {
    if (!snapshot) return;
    const data = new FormData(form);
    const level = data.get("level");
    const availability = data.get("availability");
    const areaKey = data.get("area");
    const area = snapshot.areas[areaKey];
    if (!area) return;

    const eligible = area.opportunities
      .filter((opportunity) => opportunity.levels.includes(level))
      .sort((left, right) => {
        const leftExact = left.availability === availability ? 1 : 0;
        const rightExact = right.availability === availability ? 1 : 0;
        return rightExact - leftExact || right.potential - left.potential;
      });
    const exactCount = eligible.filter(
      (opportunity) => opportunity.availability === availability,
    ).length;

    track.replaceChildren(
      ...eligible.map((opportunity, index) =>
        opportunityCard(opportunity, index, availability, level),
      ),
    );
    cards = Array.from(track.querySelectorAll(".guetteur-opportunity"));
    viewport.scrollLeft = 0;
    renderOpportunityMap(area, eligible);
    updateNavigation(0);

    if (exactCount > 0) {
      summary.textContent = `${exactCount} ${exactCount === 1 ? "window matches" : "windows match"} near ${area.departure}. ${eligible.length} level-compatible ${eligible.length === 1 ? "spot" : "spots"} in the snapshot.`;
    } else {
      summary.textContent = `No stored ${availabilityLabels[availability]} window near ${area.departure}. Showing ${eligible.length} level-compatible ${eligible.length === 1 ? "alternative" : "alternatives"}.`;
    }
  }

  form.addEventListener("change", (event) => {
    if (event.target instanceof HTMLSelectElement) render();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  previous.addEventListener("click", () => goTo(activeIndex - 1));
  next.addEventListener("click", () => goTo(activeIndex + 1));

  window.addEventListener(
    "resize",
    () => {
      if (mapResizeFrame) cancelAnimationFrame(mapResizeFrame);
      mapResizeFrame = requestAnimationFrame(() => {
        if (currentMapArea) {
          renderOpportunityMap(currentMapArea, currentMapOpportunities);
          updateMapSelection(activeIndex);
        }
      });
    },
    { passive: true },
  );

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  });

  let scrollFrame = null;
  viewport.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        if (!cards.length) return;
        const nearest = cards.reduce(
          (best, card, index) => {
            const distance = Math.abs(cardOffset(index) - viewport.scrollLeft);
            return distance < best.distance ? { distance, index } : best;
          },
          { distance: Number.POSITIVE_INFINITY, index: 0 },
        );
        updateNavigation(nearest.index);
      });
    },
    { passive: true },
  );

  fetch(source, { headers: { Accept: "application/json" } })
    .then((response) => {
      if (!response.ok) throw new Error(`Snapshot request failed: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      snapshot = data;
      render();
    })
    .catch(() => {
      summary.textContent = "The stored snapshot could not be loaded. The example below remains available.";
      cards = Array.from(track.querySelectorAll(".guetteur-opportunity"));
      updateNavigation(0);
    });
})();
