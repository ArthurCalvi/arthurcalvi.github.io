(() => {
  "use strict";

  const AUTO_ADVANCE_DELAY = 2000;
  const HISTOGRAM_BIN_COUNT = 32;
  const MASK_CUE_DURATION = 720;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const preloadCache = new Map();
  const histogramCache = new Map();
  const controllers = [];
  let controllerSequence = 0;
  const wait = (duration) =>
    new Promise((resolve) => window.setTimeout(resolve, duration));

  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  };

  const requiredElement = (root, selector) => {
    const element = root.querySelector(selector);

    if (!element) {
      throw new Error(`Missing required replay element: ${selector}`);
    }

    return element;
  };

  const requiredText = (value, field) => {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`Missing required manifest text: ${field}`);
    }

    return value;
  };

  const parseExampleIds = (value) => {
    const source = (value || "").trim();

    if (!source) return [];

    if (source.startsWith("[")) {
      const parsed = JSON.parse(source);

      if (!Array.isArray(parsed)) {
        throw new Error("data-example-ids must be an array or a separated list.");
      }

      return parsed.map(String).map((id) => id.trim()).filter(Boolean);
    }

    return source.split(/[\s,]+/).map((id) => id.trim()).filter(Boolean);
  };

  const decodeImage = async (image) => {
    if (image.complete) {
      if (image.naturalWidth === 0) {
        throw new Error(`Could not decode replay image: ${image.currentSrc || image.src}`);
      }

      if (typeof image.decode === "function") {
        await image.decode().catch(() => {});
      }

      return;
    }

    const loaded = new Promise((resolve, reject) => {
      const cleanUp = () => {
        image.removeEventListener("load", handleLoad);
        image.removeEventListener("error", handleError);
      };
      const handleLoad = () => {
        cleanUp();
        resolve();
      };
      const handleError = () => {
        cleanUp();
        reject(new Error(`Could not load replay image: ${image.currentSrc || image.src}`));
      };

      image.addEventListener("load", handleLoad, { once: true });
      image.addEventListener("error", handleError, { once: true });
    });

    if (typeof image.decode === "function") {
      try {
        await image.decode();
      } catch (error) {
        await loaded;
      }
    } else {
      await loaded;
    }

    if (image.naturalWidth === 0) {
      throw new Error(`Could not decode replay image: ${image.currentSrc || image.src}`);
    }
  };

  const setImage = async (image, source, alt) => {
    image.decoding = "async";
    image.draggable = false;
    image.src = source;
    image.alt = alt;
    await decodeImage(image);
  };

  const preloadImage = (source) => {
    if (!source) return Promise.resolve();
    if (preloadCache.has(source)) return preloadCache.get(source);

    const promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener(
        "error",
        () => reject(new Error(`Could not preload replay image: ${source}`)),
        { once: true }
      );
      image.src = source;
    });

    preloadCache.set(source, promise);
    return promise;
  };

  const computeLuminanceHistogram = (source) => {
    if (histogramCache.has(source)) return histogramCache.get(source);

    const promise = (async () => {
      const image = new Image();
      image.decoding = "async";
      image.src = source;
      await decodeImage(image);

      const longestEdge = 224;
      const scale = Math.min(
        1,
        longestEdge / Math.max(image.naturalWidth, image.naturalHeight)
      );
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        throw new Error("Could not create the luminance histogram.");
      }

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);

      const pixels = context.getImageData(0, 0, width, height).data;
      const bins = new Array(HISTOGRAM_BIN_COUNT).fill(0);

      for (let offset = 0; offset < pixels.length; offset += 4) {
        const alpha = pixels[offset + 3] / 255;
        if (alpha === 0) continue;

        const luminance =
          0.2126 * pixels[offset] +
          0.7152 * pixels[offset + 1] +
          0.0722 * pixels[offset + 2];
        const bin = Math.min(
          HISTOGRAM_BIN_COUNT - 1,
          Math.floor((luminance / 256) * HISTOGRAM_BIN_COUNT)
        );
        bins[bin] += alpha;
      }

      const peak = Math.max(1, ...bins);
      return bins.map((value) => Math.max(0.025, Math.pow(value / peak, 0.72)));
    })();

    histogramCache.set(source, promise);
    promise.catch(() => histogramCache.delete(source));
    return promise;
  };

  const normalizeManifest = (rawManifest, manifestUrl) => {
    if (!rawManifest || !Array.isArray(rawManifest.examples)) {
      throw new Error("The Silver AI replay manifest has no examples.");
    }

    const resolveImage = (path, field) => {
      const source = requiredText(path, field);
      return new URL(source, manifestUrl).href;
    };

    const examples = rawManifest.examples.map((example, exampleIndex) => {
      const id = requiredText(example.id, `examples[${exampleIndex}].id`);
      const steps = Array.isArray(example.steps)
        ? example.steps.map((step, stepIndex) => {
            const evidence =
              step.evidence && typeof step.evidence === "object"
                ? step.evidence
                : {};
            const maskImage =
              typeof evidence.mask_image === "string" &&
              evidence.mask_image.trim() !== ""
                ? resolveImage(
                    evidence.mask_image,
                    `${id}.steps[${stepIndex}].evidence.mask_image`
                  )
                : "";

            return {
              index: Number.isFinite(Number(step.index))
                ? Number(step.index)
                : stepIndex + 1,
              title: requiredText(step.title, `${id}.steps[${stepIndex}].title`),
              turn: Number.isFinite(Number(step.turn)) ? Number(step.turn) : 1,
              toolUse: requiredText(
                step.tool_use,
                `${id}.steps[${stepIndex}].tool_use`
              ),
              reasoning: requiredText(
                step.reasoning_summary,
                `${id}.steps[${stepIndex}].reasoning_summary`
              ),
              image: resolveImage(step.image, `${id}.steps[${stepIndex}].image`),
              alt: requiredText(step.alt, `${id}.steps[${stepIndex}].alt`),
              evidence: {
                callout:
                  typeof evidence.callout === "string"
                    ? evidence.callout.trim()
                    : "",
                focusLabel:
                  typeof evidence.focus_label === "string"
                    ? evidence.focus_label.trim()
                    : "",
                maskImage,
              },
            };
          })
        : [];

      if (steps.length === 0) {
        throw new Error(`The replay example "${id}" has no steps.`);
      }

      const normalized = {
        id,
        title: requiredText(example.title, `${id}.title`),
        sceneId: typeof example.scene_id === "string" ? example.scene_id : "",
        choicePrompt: typeof example.choice_prompt === "string" ? example.choice_prompt : "",
        selectedPrompt:
          typeof example.selected_prompt === "string" ? example.selected_prompt : "",
        prompts: Array.isArray(example.prompts)
          ? example.prompts.filter((prompt) => typeof prompt === "string")
          : [],
        openingCommentary: requiredText(
          example.opening_commentary,
          `${id}.opening_commentary`
        ),
        turnOutputs: Array.isArray(example.turn_outputs)
          ? example.turn_outputs.filter((output) => typeof output === "string")
          : [],
        originalImage: resolveImage(example.original_image, `${id}.original_image`),
        originalAlt: requiredText(example.original_alt, `${id}.original_alt`),
        finalImage: resolveImage(example.final_image, `${id}.final_image`),
        finalAlt: requiredText(example.final_alt, `${id}.final_alt`),
        finalText: requiredText(example.final_text, `${id}.final_text`),
        steps,
      };

      normalized.frames = [
        {
          type: "original",
          title: "Original photograph",
          image: normalized.originalImage,
          alt: normalized.originalAlt,
          turn: 1,
        },
        ...steps.map((step) => ({
          type: "step",
          title: step.title,
          image: step.image,
          alt: step.alt,
          turn: step.turn,
          stepIndex: step.index,
          toolUse: step.toolUse,
          reasoning: step.reasoning,
          evidence: step.evidence,
        })),
        {
          type: "final",
          title: "Final photograph",
          image: normalized.finalImage,
          alt: normalized.finalAlt,
          turn: Math.max(1, ...steps.map((step) => step.turn)),
        },
      ];

      return normalized;
    });

    return new Map(examples.map((example) => [example.id, example]));
  };

  const loadManifest = async (source) => {
    const manifestUrl = new URL(source, document.baseURI);
    const response = await fetch(manifestUrl.href, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Could not load the Silver AI replay manifest (${response.status}).`);
    }

    const manifest = await response.json();
    return normalizeManifest(manifest, manifestUrl);
  };

  class SilverReplay {
    constructor(root, exampleCatalog) {
      this.root = root;
      this.exampleCatalog = exampleCatalog;
      this.kind = (root.dataset.kind || "").toLowerCase();
      this.exampleIds = parseExampleIds(root.dataset.exampleIds);
      this.examples = this.exampleIds.map((id) => {
        const example = exampleCatalog.get(id);

        if (!example) {
          throw new Error(`Unknown Silver AI replay example: ${id}`);
        }

        return example;
      });

      if (this.examples.length === 0) {
        throw new Error("A Silver AI replay needs at least one example.");
      }

      this.fallback = requiredElement(root, "[data-replay-fallback]");
      this.enhanced = requiredElement(root, "[data-replay-enhanced]");
      this.player = requiredElement(this.enhanced, "[data-player]");
      this.storyTitle = requiredElement(this.player, "[data-story-title]");
      this.stage = requiredElement(this.player, "[data-stage]");
      this.imageA = requiredElement(this.stage, '[data-image-layer="a"]');
      this.imageB = requiredElement(this.stage, '[data-image-layer="b"]');
      this.maskCue = requiredElement(this.player, "[data-mask-cue]");
      this.maskImage = requiredElement(this.maskCue, "[data-mask-image]");
      this.maskLabel = requiredElement(this.maskCue, "[data-mask-label]");
      this.toneOverlay = requiredElement(this.player, "[data-tone-overlay]");
      this.histogram = requiredElement(this.toneOverlay, "[data-histogram-bars]");
      this.toneCallout = requiredElement(
        this.toneOverlay,
        "[data-tone-callout]"
      );
      this.agentActivity = requiredElement(this.player, "[data-agent-activity]");
      this.agentProgress = requiredElement(this.agentActivity, "[data-agent-progress]");
      this.agentSpeaker = requiredElement(this.agentActivity, "[data-agent-speaker]");
      this.agentPrompt = requiredElement(this.agentActivity, "[data-agent-prompt]");
      this.agentResponse = requiredElement(this.agentActivity, "[data-agent-response]");
      this.agentTool = requiredElement(this.agentActivity, "[data-agent-tool]");
      this.status = requiredElement(this.player, "[data-status]");
      this.playButton = requiredElement(this.player, "[data-play]");
      this.comparison = requiredElement(this.player, "[data-comparison]");
      this.compareBefore = requiredElement(this.comparison, "[data-compare-before]");
      this.compareAfter = requiredElement(this.comparison, "[data-compare-after]");
      this.compareControl = requiredElement(this.comparison, "[data-compare-control]");

      this.selectedExample = null;
      this.frames = [];
      this.currentIndex = 0;
      this.targetIndex = 0;
      this.renderToken = 0;
      this.selectionToken = 0;
      this.activeLayer = null;
      this.playing = false;
      this.playTimer = 0;
      this.activityRenderToken = 0;
      this.histogramBars = [];
      this.failed = false;
      this.ready = false;
      this.observer = null;
      this.controllerId = ++controllerSequence;
    }

    async init() {
      this.enhanced.hidden = true;
      this.fallback.hidden = false;
      this.player.hidden = true;
      this.comparison.hidden = true;
      this.maskCue.classList.remove("is-visible");
      this.toneOverlay.classList.remove("is-visible");
      this.root.classList.toggle("is-reduced-motion", reducedMotion.matches);

      this.imageA.loading = "eager";
      this.imageB.loading = "eager";
      this.imageA.alt = "";
      this.imageB.alt = "";
      this.imageA.setAttribute("aria-hidden", "true");
      this.imageB.setAttribute("aria-hidden", "true");
      this.maskImage.alt = "";
      this.maskImage.setAttribute("aria-hidden", "true");
      this.stage.setAttribute("role", "img");
      this.status.setAttribute("aria-live", "polite");
      this.status.setAttribute("aria-atomic", "true");
      this.storyTitle.setAttribute("tabindex", "-1");
      if (!this.storyTitle.id) {
        this.storyTitle.id = `silver-ai-replay-title-${this.controllerId}`;
      }
      this.player.setAttribute("role", "region");
      this.player.setAttribute("aria-labelledby", this.storyTitle.id);

      this.buildHistogram();
      this.bindPlayerControls();
      this.bindComparison();
      this.bindVisibilityObserver();

      if (this.kind === "suggestions" || this.kind === "suggestion") {
        await this.initSuggestions();
      } else if (this.kind === "surprise" || this.kind === "direct") {
        await this.initStartView();
      } else {
        throw new Error(`Unsupported Silver AI replay kind: ${this.kind || "(empty)"}`);
      }

      this.ready = true;
      this.fallback.hidden = true;
      this.enhanced.hidden = false;
      this.root.classList.add("is-enhanced");
    }

    async initSuggestions() {
      this.suggestionView = requiredElement(this.enhanced, "[data-suggestion-view]");
      this.directionPicker = requiredElement(
        this.suggestionView,
        "[data-direction-picker]"
      );
      this.directionPicker.setAttribute("role", "group");
      const original = this.examples[0];

      this.examples.forEach((example) => {
        if (example.originalImage !== original.originalImage) {
          throw new Error("Suggestion directions must share the same original image.");
        }
      });

      let prompt = this.suggestionView.querySelector("[data-suggestion-prompt]");
      if (!prompt) {
        prompt = document.createElement("p");
        prompt.className = "silver-ai-suggestion-prompt";
        prompt.dataset.suggestionPrompt = "";
        this.directionPicker.before(prompt);
      }
      prompt.textContent = original.choicePrompt;

      this.buildDirectionPicker();
      this.suggestionView.hidden = false;
      this.directionButtons[0]?.setAttribute("aria-pressed", "true");
      await this.startExample(original, false, false);
      this.status.textContent = reducedMotion.matches
        ? "Ready. Choose a direction or press Next edit."
        : "Ready. Choose a direction or press Play.";
    }

    async initStartView() {
      if (this.examples.length !== 1) {
        throw new Error(`${this.kind} replays must reference exactly one example.`);
      }

      this.startView = requiredElement(this.enhanced, "[data-start-view]");
      this.startPrompt = requiredElement(this.startView, "[data-start-prompt]");
      this.startReplayButton = requiredElement(this.startView, "[data-start-replay]");

      const example = this.examples[0];
      const firstPrompt = example.prompts[0] || example.selectedPrompt;

      this.startPrompt.textContent = firstPrompt;
      this.startReplayButton.textContent = "Play";

      this.startReplayButton.addEventListener("click", () => {
        this.player.classList.remove("is-awaiting-start");
        this.handleAsync(this.startExample(example, true));
      });

      await this.startExample(example, false, false);
      this.player.classList.add("is-awaiting-start");
      this.storyTitle.textContent = "Original photograph";
      this.startView.hidden = false;
      this.status.textContent = "Ready to replay.";
      preloadImage(example.frames[1]?.image).catch(() => {});
    }

    buildDirectionPicker() {
      let buttons = Array.from(
        this.directionPicker.querySelectorAll(
          "button[data-example-id], button[data-direction-id]"
        )
      );

      if (buttons.length === 0) {
        const fragment = document.createDocumentFragment();

        this.examples.forEach((example) => {
          const button = document.createElement("button");
          const title = document.createElement("span");
          const summary = document.createElement("span");

          button.type = "button";
          button.className = "silver-ai-direction-card";
          button.dataset.exampleId = example.id;
          button.setAttribute("aria-pressed", "false");
          title.className = "silver-ai-direction-card-title";
          title.textContent = example.title;
          summary.className = "silver-ai-direction-card-summary";
          summary.textContent = example.selectedPrompt;
          button.append(title, summary);
          fragment.append(button);
        });

        this.directionPicker.append(fragment);
        buttons = Array.from(
          this.directionPicker.querySelectorAll("button[data-example-id]")
        );
      }

      buttons.forEach((button) => {
        const id = button.dataset.exampleId || button.dataset.directionId;
        const example = this.exampleCatalog.get(id);

        if (!example || !this.exampleIds.includes(example.id)) {
          button.disabled = true;
          return;
        }

        button.addEventListener("click", () => {
          buttons.forEach((item) => item.setAttribute("aria-pressed", "false"));
          button.setAttribute("aria-pressed", "true");
          this.handleAsync(this.startExample(example, true));
        });
      });

      this.directionButtons = buttons;
    }

    buildHistogram() {
      const fragment = document.createDocumentFragment();

      for (let index = 0; index < HISTOGRAM_BIN_COUNT; index += 1) {
        const bar = document.createElement("span");
        bar.className = "silver-ai-histogram-bar";
        bar.style.setProperty("--histogram-value", "0.025");
        bar.style.setProperty("--histogram-index", String(index));
        fragment.append(bar);
        this.histogramBars.push(bar);
      }

      this.histogram.replaceChildren(fragment);
    }

    bindPlayerControls() {
      this.playButton.addEventListener("click", (event) => {
        if (event.detail > 0) this.playButton.blur();

        if (this.playing) {
          this.pause();
        } else {
          this.handleAsync(this.play());
        }
      });
    }

    bindComparison() {
      if (this.compareControl instanceof HTMLInputElement) {
        this.compareControl.type = "range";
        this.compareControl.min = "0";
        this.compareControl.max = "100";
        this.compareControl.step = "1";
      }

      if (!this.compareControl.hasAttribute("aria-label")) {
        this.compareControl.setAttribute(
          "aria-label",
          "Reveal the edited photograph"
        );
      }

      this.compareControl.addEventListener("input", () => {
        this.updateComparisonPosition();
      });
    }

    bindVisibilityObserver() {
      if (!("IntersectionObserver" in window)) return;

      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting && this.playing) {
            this.pause("Paused while this replay is off screen.");
          }
        },
        { threshold: 0.05 }
      );
      this.observer.observe(this.root);
    }

    async startExample(example, shouldAutoplay, shouldFocus = true) {
      this.pause();
      const selectionToken = ++this.selectionToken;
      this.selectedExample = example;
      this.frames = example.frames;
      this.currentIndex = 0;
      this.targetIndex = 0;
      this.activeLayer = null;
      this.renderToken += 1;
      this.storyTitle.textContent = example.title;
      this.hideMaskCue();
      this.hideToneEvidence();

      if (this.startView) this.startView.hidden = true;
      this.player.hidden = false;
      this.comparison.hidden = true;

      const rendered = await this.goTo(0, true);
      if (
        !rendered ||
        selectionToken !== this.selectionToken ||
        this.selectedExample !== example
      ) {
        return;
      }

      if (shouldFocus) this.storyTitle.focus({ preventScroll: true });

      if (shouldAutoplay) {
        await this.play();
      } else if (reducedMotion.matches) {
        this.status.textContent = "Ready. Press Next edit to advance without animation.";
      }
    }

    async goTo(requestedIndex, force = false) {
      if (!this.selectedExample || this.frames.length === 0) return false;

      const lastIndex = this.frames.length - 1;
      const nextIndex = Math.max(0, Math.min(lastIndex, requestedIndex));

      if (!force && nextIndex === this.currentIndex && this.activeLayer) {
        this.targetIndex = nextIndex;
        this.renderDetails(nextIndex);
        return true;
      }

      this.targetIndex = nextIndex;
      const token = ++this.renderToken;
      const frame = this.frames[nextIndex];

      this.stage.setAttribute("aria-busy", "true");
      this.comparison.hidden = true;
      this.renderAgentActivity(nextIndex);

      try {
        const histogramPromise =
          frame.type === "final"
            ? Promise.resolve(null)
            : computeLuminanceHistogram(frame.image);

        if (frame.type === "step" && this.playing && !reducedMotion.matches) {
          await wait(240);
          if (token !== this.renderToken) return false;
        }

        if (frame.type === "step" && frame.evidence?.maskImage) {
          await this.renderMaskCue(frame, token);
          if (token !== this.renderToken) return false;
        }

        const rendered = await this.renderImage(frame, token);
        if (!rendered || token !== this.renderToken) return false;

        this.currentIndex = nextIndex;
        this.renderDetails(nextIndex, true);

        if (frame.type === "final") {
          this.hideMaskCue();
          this.hideToneEvidence();
          await this.prepareComparison(token);
          if (token !== this.renderToken) return false;
          this.comparison.hidden = false;
        } else {
          await this.renderToneEvidence(frame, histogramPromise, token);
          if (token !== this.renderToken) return false;
        }

        const nextFrame = this.frames[nextIndex + 1];
        if (nextFrame) {
          preloadImage(nextFrame.image).catch(() => {});
          if (nextFrame.type !== "final") {
            computeLuminanceHistogram(nextFrame.image).catch(() => {});
          }
          if (nextFrame.evidence?.maskImage) {
            preloadImage(nextFrame.evidence.maskImage).catch(() => {});
          }
        }

        if (nextIndex === lastIndex && this.playing) {
          this.pause();
        }

        return true;
      } catch (error) {
        if (token !== this.renderToken) return false;
        throw error;
      } finally {
        if (token === this.renderToken) {
          this.stage.setAttribute("aria-busy", "false");
        }
      }
    }

    async renderImage(frame, token) {
      const layers = { a: this.imageA, b: this.imageB };

      if (!this.activeLayer) {
        const initial = layers.a;

        try {
          await setImage(initial, frame.image, "");
        } catch (error) {
          if (token !== this.renderToken) return false;
          throw error;
        }

        if (token !== this.renderToken) return false;

        initial.classList.add("is-active");
        initial.setAttribute("aria-hidden", "true");
        layers.b.classList.remove("is-active");
        layers.b.setAttribute("aria-hidden", "true");
        this.activeLayer = "a";
        this.stage.dataset.activeLayer = "a";
        return true;
      }

      const current = layers[this.activeLayer];
      if (current.getAttribute("src") === frame.image) {
        current.alt = "";
        return true;
      }

      const nextLayerName = this.activeLayer === "a" ? "b" : "a";
      const next = layers[nextLayerName];

      next.classList.remove("is-active");
      next.setAttribute("aria-hidden", "true");

      try {
        await setImage(next, frame.image, "");
      } catch (error) {
        if (token !== this.renderToken) return false;
        throw error;
      }

      if (token !== this.renderToken) return false;

      current.classList.remove("is-active");
      current.setAttribute("aria-hidden", "true");
      next.classList.add("is-active");
      next.setAttribute("aria-hidden", "true");
      this.activeLayer = nextLayerName;
      this.stage.dataset.activeLayer = nextLayerName;
      return true;
    }

    async renderMaskCue(frame, token) {
      const maskImage = frame.evidence?.maskImage;
      const focusLabel = frame.evidence?.focusLabel;

      if (!maskImage || !focusLabel) return;

      this.hideMaskCue();

      try {
        await setImage(this.maskImage, maskImage, "");
      } catch (error) {
        if (token === this.renderToken) {
          console.warn("[Silver AI replay] Could not show area selection.", error);
        }
        return;
      }

      if (token !== this.renderToken) return;

      this.maskLabel.textContent = focusLabel;
      this.maskCue.dataset.focus = focusLabel;
      this.maskCue.classList.add("is-visible");

      await wait(reducedMotion.matches ? 480 : MASK_CUE_DURATION);
      if (token !== this.renderToken) return;

      this.maskCue.classList.remove("is-visible");
      if (!reducedMotion.matches) await wait(160);
      if (token === this.renderToken) this.hideMaskCue();
    }

    hideMaskCue() {
      this.maskCue.classList.remove("is-visible");
      this.maskCue.removeAttribute("data-focus");
      this.maskLabel.textContent = "";
    }

    async renderToneEvidence(frame, histogramPromise, token) {
      let values;

      try {
        values = await histogramPromise;
      } catch (error) {
        if (token === this.renderToken) this.hideToneEvidence();
        return;
      }

      if (token !== this.renderToken || !Array.isArray(values)) return;

      values.forEach((value, index) => {
        const bar = this.histogramBars[index];
        if (!bar) return;
        bar.style.setProperty("--histogram-value", value.toFixed(4));
      });

      const callout =
        frame.type === "original"
          ? "Original tones"
          : frame.evidence?.callout || frame.title;

      this.toneOverlay.dataset.frameType = frame.type;
      this.toneOverlay.classList.add("is-visible");
      this.toneCallout.classList.remove("is-visible");
      this.toneCallout.textContent = callout;

      if (reducedMotion.matches) {
        this.toneCallout.classList.add("is-visible");
      } else {
        window.requestAnimationFrame(() => {
          if (token !== this.renderToken) return;
          this.toneCallout.classList.add("is-visible");
        });
      }
    }

    hideToneEvidence() {
      this.toneOverlay.classList.remove("is-visible");
      this.toneOverlay.removeAttribute("data-frame-type");
      this.toneCallout.classList.remove("is-visible");
    }

    renderDetails(frameIndex, activityAlreadyRendered = false) {
      const frame = this.frames[frameIndex];
      const progress =
        frame.type === "step"
          ? `${frame.stepIndex} of ${this.selectedExample.steps.length}`
          : frame.type === "original"
            ? "Original"
            : "Final";

      this.stage.setAttribute("aria-label", frame.alt);
      if (!activityAlreadyRendered) this.renderAgentActivity(frameIndex);
      this.updatePlayButton();

      const playingPrefix = this.playing ? "Playing. " : "";
      const toolSuffix = frame.type === "step" ? ` Tool: ${frame.toolUse}.` : "";
      this.status.textContent =
        `${playingPrefix}${progress}: ${frame.title}.${toolSuffix}`;
    }

    renderAgentActivity(frameIndex) {
      const frame = this.frames[frameIndex];
      const isEditStep = frame?.type === "step";
      const activityToken = ++this.activityRenderToken;

      this.agentActivity.classList.remove("is-visible");
      this.agentActivity.setAttribute("aria-hidden", String(!isEditStep));

      if (!isEditStep) {
        this.agentSpeaker.textContent = "";
        this.agentPrompt.textContent = "";
        this.agentProgress.textContent = "";
        this.agentResponse.textContent = "";
        this.agentTool.textContent = "";
        return;
      }

      const previousFrame = this.frames[frameIndex - 1];
      const startsTurn =
        previousFrame?.type !== "step" || previousFrame.turn !== frame.turn;
      const turnPrompt = this.selectedExample.prompts[frame.turn - 1];
      const speaker = turnPrompt
        ? frame.turn > 1
          ? "Arthur · follow-up"
          : "Arthur"
        : "Arthur · direction";
      const prompt =
        turnPrompt ||
        this.selectedExample.selectedPrompt ||
        this.selectedExample.title;
      const response =
        startsTurn && frame.turn === 1
          ? this.selectedExample.openingCommentary
          : frame.reasoning;

      this.agentProgress.textContent =
        `${frame.stepIndex} / ${this.selectedExample.steps.length}`;
      this.agentSpeaker.textContent = speaker;
      this.agentPrompt.textContent = prompt;
      this.agentResponse.textContent = response;
      this.agentTool.textContent = frame.toolUse;

      const showActivity = () => {
        if (activityToken !== this.activityRenderToken) return;
        this.agentActivity.classList.add("is-visible");
      };

      if (reducedMotion.matches) {
        showActivity();
      } else {
        window.requestAnimationFrame(showActivity);
      }
    }

    async prepareComparison(token) {
      this.compareControl.value = "50";
      this.updateComparisonPosition();

      this.compareBefore.loading = "eager";
      this.compareAfter.loading = "eager";

      try {
        await Promise.all([
          setImage(
            this.compareBefore,
            this.selectedExample.originalImage,
            this.selectedExample.originalAlt
          ),
          setImage(
            this.compareAfter,
            this.selectedExample.finalImage,
            this.selectedExample.finalAlt
          ),
        ]);
      } catch (error) {
        if (token !== this.renderToken) return;
        throw error;
      }
    }

    updateComparisonPosition() {
      const value = Math.max(0, Math.min(100, Number(this.compareControl.value) || 0));
      this.comparison.style.setProperty("--comparison-position", `${value}%`);
      this.compareControl.setAttribute(
        "aria-valuetext",
        `Divider at ${value}%. Original on the left and edited photograph on the right.`
      );
    }

    async play() {
      if (!this.selectedExample || this.frames.length === 0) return;

      if (reducedMotion.matches) {
        if (this.currentIndex === this.frames.length - 1) {
          await this.goTo(0);
        } else {
          await this.goTo(this.currentIndex + 1);
        }
        return;
      }

      if (this.currentIndex === this.frames.length - 1) {
        const example = this.selectedExample;
        const rendered = await this.goTo(0);
        if (!rendered || this.selectedExample !== example) return;
      }

      this.playing = true;
      this.updatePlayButton();
      const advanced = await this.goTo(this.currentIndex + 1);
      if (advanced && this.playing) this.schedulePlayback();
    }

    schedulePlayback() {
      window.clearTimeout(this.playTimer);
      if (!this.playing) return;

      const delay = Number(this.root.dataset.replayInterval) || AUTO_ADVANCE_DELAY;

      this.playTimer = window.setTimeout(async () => {
        if (!this.playing) return;

        try {
          await this.goTo(this.currentIndex + 1);
          if (this.playing) this.schedulePlayback();
        } catch (error) {
          this.fail(error);
        }
      }, delay);
    }

    pause(message) {
      this.playing = false;
      window.clearTimeout(this.playTimer);
      this.playTimer = 0;
      this.updatePlayButton();

      if (message && !this.player.hidden) {
        this.status.textContent = message;
      } else if (
        this.selectedExample &&
        this.frames[this.currentIndex] &&
        !this.player.hidden
      ) {
        this.status.textContent = `${this.frames[this.currentIndex].title}.`;
      }
    }

    updatePlayButton() {
      const atEnd =
        this.frames.length > 0 && this.currentIndex === this.frames.length - 1;
      let state = "play";

      if (reducedMotion.matches && atEnd) {
        state = "replay";
        this.playButton.textContent = "Replay";
        this.playButton.setAttribute("aria-label", "Return to the original photograph");
      } else if (reducedMotion.matches) {
        state = "next";
        this.playButton.textContent = "Next edit";
        this.playButton.setAttribute("aria-label", "Show the next edit step");
      } else if (this.playing) {
        state = "pause";
        this.playButton.textContent = "Pause";
        this.playButton.setAttribute("aria-label", "Pause the replay");
      } else if (atEnd) {
        state = "replay";
        this.playButton.textContent = "Replay";
        this.playButton.setAttribute("aria-label", "Replay from the original photograph");
      } else {
        state = this.currentIndex === 0 ? "play" : "resume";
        this.playButton.textContent = "Play";
        this.playButton.setAttribute("aria-label", "Play the replay");
      }

      this.playButton.dataset.state = state;
      this.playButton.setAttribute("aria-pressed", String(this.playing));
    }

    handleAsync(promise) {
      Promise.resolve(promise).catch((error) => this.fail(error));
    }

    handleReducedMotionChange() {
      this.root.classList.toggle("is-reduced-motion", reducedMotion.matches);

      if (reducedMotion.matches && this.playing) {
        this.pause("Paused because reduced motion is enabled.");
      }

      this.updatePlayButton();
    }

    fail(error) {
      if (this.failed) return;
      this.failed = true;
      this.pause();
      this.renderToken += 1;
      this.selectionToken += 1;
      this.hideMaskCue();
      this.hideToneEvidence();
      this.enhanced.hidden = true;
      this.fallback.hidden = false;
      this.root.classList.remove("is-enhanced");
      console.error("[Silver AI replay]", error);
    }
  }

  ready(async () => {
    const page = document.querySelector("[data-silver-ai-page]");
    if (!page) return;
    if (page.dataset.replayInitialized === "true") return;
    page.dataset.replayInitialized = "true";

    const roots = Array.from(page.querySelectorAll("[data-silver-replay]"));
    if (roots.length === 0) return;

    roots.forEach((root) => {
      const enhanced = root.querySelector("[data-replay-enhanced]");
      const fallback = root.querySelector("[data-replay-fallback]");
      if (enhanced) enhanced.hidden = true;
      if (fallback) fallback.hidden = false;
    });

    const manifestSource = page.dataset.manifestUrl;
    if (!manifestSource) {
      console.error("[Silver AI replay] Missing data-manifest-url.");
      return;
    }

    let exampleCatalog;

    try {
      exampleCatalog = await loadManifest(manifestSource);
    } catch (error) {
      console.error("[Silver AI replay]", error);
      return;
    }

    await Promise.all(
      roots.map(async (root) => {
        try {
          const controller = new SilverReplay(root, exampleCatalog);
          await controller.init();
          controllers.push(controller);
        } catch (error) {
          const enhanced = root.querySelector("[data-replay-enhanced]");
          const fallback = root.querySelector("[data-replay-fallback]");
          if (enhanced) enhanced.hidden = true;
          if (fallback) fallback.hidden = false;
          console.error("[Silver AI replay]", error);
        }
      })
    );

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) return;

      controllers.forEach((controller) => {
        if (controller.playing) {
          controller.pause("Paused while this page is in the background.");
        }
      });
    });

    const handleMotionChange = () => {
      controllers.forEach((controller) => controller.handleReducedMotionChange());
    };

    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", handleMotionChange);
    } else {
      reducedMotion.addListener(handleMotionChange);
    }
  });
})();
