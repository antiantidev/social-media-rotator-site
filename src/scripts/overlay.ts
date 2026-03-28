import { animate } from "motion";
import {
  type AnimationPresetId,
  DEFAULT_OVERLAY_APPEARANCE,
} from "../lib/appearance.ts";
import {
  DEFAULT_ROTATION_DATA,
  DEFAULT_TIMING,
  PLATFORM_MAP,
} from "../lib/platforms.ts";
import { MAX_ENCODED_SETTINGS_LENGTH } from "../lib/settingsLimits.ts";
import { decodeSettingsTokenSafe, normalizeSettings } from "../lib/token.ts";

const DEFAULT_CONFIG = {
  BASE_CLASS: "overlay-card",
  TIMING: DEFAULT_TIMING,
  APPEARANCE: DEFAULT_OVERLAY_APPEARANCE,
};
const MINIMUM_LOADER_MS = 1500;
const PRELOAD_TIMEOUT_MS = 1000;

function animationDuration(milliseconds) {
  return Math.max(0.12, milliseconds / 1000);
}

function wait(milliseconds: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

async function waitForPreload(promise: Promise<unknown>) {
  await Promise.race([promise, wait(PRELOAD_TIMEOUT_MS)]);
}

function springOptions(stiffness: number, damping: number, mass = 0.9) {
  return {
    type: "spring",
    stiffness,
    damping,
    mass,
  };
}

function inertialSpring(
  stiffness: number,
  damping: number,
  mass: number,
  velocity: number,
) {
  return {
    ...springOptions(stiffness, damping, mass),
    velocity,
    restSpeed: 0.02,
    restDelta: 0.02,
  };
}

function getMotionSpec(preset: AnimationPresetId, phase: "in" | "out", milliseconds: number) {
  const duration = animationDuration(milliseconds);

  if (preset === "glide") {
    return phase === "in"
      ? {
          card: { keyframes: { opacity: [0, 1], x: [34, 0], scale: [0.982, 1], filter: ["blur(1px)", "blur(0px)"] }, options: { ...springOptions(240, 28, 0.95), opacity: { duration: duration * 0.72 } } },
          icon: { keyframes: { opacity: [0, 1], x: [22, 0] }, options: { ...springOptions(280, 26, 0.8), delay: duration * 0.06, opacity: { duration: duration * 0.5 } } },
          copy: { keyframes: { opacity: [0, 1], x: [16, 0] }, options: { ...springOptions(260, 28, 0.88), delay: duration * 0.1, opacity: { duration: duration * 0.56 } } },
          cta: { keyframes: { opacity: [0, 1], x: [20, 0] }, options: { ...springOptions(300, 28, 0.82), delay: duration * 0.14, opacity: { duration: duration * 0.48 } } },
        }
      : {
          card: { keyframes: { opacity: [1, 0], x: [0, -28], scale: [1, 0.988], filter: ["blur(0px)", "blur(1px)"] }, options: { ...inertialSpring(220, 30, 0.96, -1.8), opacity: { duration: duration * 0.4 } } },
          icon: { keyframes: { opacity: [1, 0], x: [0, -18] }, options: { ...inertialSpring(260, 28, 0.82, -1.5), opacity: { duration: duration * 0.28 } } },
          copy: { keyframes: { opacity: [1, 0], x: [0, -14] }, options: { ...inertialSpring(230, 30, 0.9, -1.3), opacity: { duration: duration * 0.32 } } },
          cta: { keyframes: { opacity: [1, 0], x: [0, -18] }, options: { ...inertialSpring(280, 28, 0.78, -1.6), opacity: { duration: duration * 0.24 } } },
        };
  }

  if (preset === "punch") {
    return phase === "in"
      ? {
          card: { keyframes: { opacity: [0, 1], y: [18, 0], scale: [0.9, 1.018], filter: ["blur(1px)", "blur(0px)"] }, options: { ...springOptions(340, 22, 0.82), opacity: { duration: duration * 0.42 } } },
          icon: { keyframes: { opacity: [0, 1], scale: [0.76, 1.02] }, options: { ...springOptions(360, 18, 0.68), delay: duration * 0.08, opacity: { duration: duration * 0.34 } } },
          copy: { keyframes: { opacity: [0, 1], y: [10, 0] }, options: { ...springOptions(300, 24, 0.8), delay: duration * 0.1, opacity: { duration: duration * 0.42 } } },
          cta: { keyframes: { opacity: [0, 1], scale: [0.8, 1.02] }, options: { ...springOptions(380, 18, 0.66), delay: duration * 0.14, opacity: { duration: duration * 0.32 } } },
        }
      : {
          card: { keyframes: { opacity: [1, 0], y: [0, -12], scale: [1, 1.028], filter: ["blur(0px)", "blur(1px)"] }, options: { ...inertialSpring(300, 22, 0.82, -2.4), opacity: { duration: duration * 0.26 } } },
          icon: { keyframes: { opacity: [1, 0], scale: [1, 0.88] }, options: { ...inertialSpring(340, 18, 0.68, 1.8), opacity: { duration: duration * 0.18 } } },
          copy: { keyframes: { opacity: [1, 0], y: [0, -8] }, options: { ...inertialSpring(280, 24, 0.8, -1.8), opacity: { duration: duration * 0.22 } } },
          cta: { keyframes: { opacity: [1, 0], scale: [1, 0.88] }, options: { ...inertialSpring(360, 18, 0.66, 1.9), opacity: { duration: duration * 0.16 } } },
        };
  }

  if (preset === "shutter") {
    return phase === "in"
      ? {
          card: { keyframes: { opacity: [0, 1], scaleX: [0.86, 1], y: [8, 0], filter: ["blur(0.8px)", "blur(0px)"] }, options: { ...springOptions(260, 24, 0.86), opacity: { duration: duration * 0.46 } } },
          icon: { keyframes: { opacity: [0, 1], x: [12, 0] }, options: { ...springOptions(280, 26, 0.78), delay: duration * 0.12, opacity: { duration: duration * 0.34 } } },
          copy: { keyframes: { opacity: [0, 1], x: [16, 0] }, options: { ...springOptions(250, 28, 0.84), delay: duration * 0.08, opacity: { duration: duration * 0.4 } } },
          cta: { keyframes: { opacity: [0, 1], x: [12, 0] }, options: { ...springOptions(300, 28, 0.76), delay: duration * 0.16, opacity: { duration: duration * 0.3 } } },
        }
      : {
          card: { keyframes: { opacity: [1, 0], scaleX: [1, 0.9], y: [0, -6], filter: ["blur(0px)", "blur(0.8px)"] }, options: { ...inertialSpring(240, 24, 0.88, -1.7), opacity: { duration: duration * 0.24 } } },
          icon: { keyframes: { opacity: [1, 0], x: [0, -10] }, options: { ...inertialSpring(260, 26, 0.78, -1.4), opacity: { duration: duration * 0.18 } } },
          copy: { keyframes: { opacity: [1, 0], x: [0, -12] }, options: { ...inertialSpring(230, 28, 0.84, -1.3), opacity: { duration: duration * 0.2 } } },
          cta: { keyframes: { opacity: [1, 0], x: [0, -10] }, options: { ...inertialSpring(280, 28, 0.76, -1.5), opacity: { duration: duration * 0.16 } } },
        };
  }

  return phase === "in"
    ? {
        card: { keyframes: { opacity: [0, 1], y: [14, 0], scale: [0.975, 1], filter: ["blur(1px)", "blur(0px)"] }, options: { ...springOptions(230, 26, 0.92), opacity: { duration: duration * 0.52 } } },
        icon: { keyframes: { opacity: [0, 1], y: [10, 0] }, options: { ...springOptions(260, 26, 0.78), delay: duration * 0.08, opacity: { duration: duration * 0.36 } } },
        copy: { keyframes: { opacity: [0, 1], y: [12, 0] }, options: { ...springOptions(220, 28, 0.9), delay: duration * 0.12, opacity: { duration: duration * 0.42 } } },
        cta: { keyframes: { opacity: [0, 1], y: [10, 0] }, options: { ...springOptions(280, 26, 0.76), delay: duration * 0.16, opacity: { duration: duration * 0.34 } } },
      }
    : {
        card: { keyframes: { opacity: [1, 0], y: [0, -10], scale: [1, 0.982], filter: ["blur(0px)", "blur(1px)"] }, options: { ...inertialSpring(210, 28, 0.94, -1.6), opacity: { duration: duration * 0.3 } } },
        icon: { keyframes: { opacity: [1, 0], y: [0, -8] }, options: { ...inertialSpring(240, 26, 0.78, -1.3), opacity: { duration: duration * 0.2 } } },
        copy: { keyframes: { opacity: [1, 0], y: [0, -8] }, options: { ...inertialSpring(200, 30, 0.9, -1.2), opacity: { duration: duration * 0.24 } } },
        cta: { keyframes: { opacity: [1, 0], y: [0, -8] }, options: { ...inertialSpring(260, 26, 0.76, -1.4), opacity: { duration: duration * 0.18 } } },
      };
}

function readTimingParam(value, fallback, min, max) {
  if (value === null) return fallback;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(max, Math.max(min, parsed));
}

function normalizeRawSettings(rawSettings, timingOverrides = {}, options = {}) {
  if (Array.isArray(rawSettings)) {
    return normalizeSettings(
      {
        platforms: rawSettings,
        ...timingOverrides,
      },
      options,
    );
  }

  if (!rawSettings || typeof rawSettings !== "object") {
    return null;
  }

  return normalizeSettings(
    {
      ...rawSettings,
      ...timingOverrides,
    },
    options,
  );
}

function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  const timing = {
    hold: readTimingParam(params.get("hold"), DEFAULT_TIMING.hold, 1000, 60000),
    in: readTimingParam(params.get("animIn"), DEFAULT_TIMING.in, 100, 5000),
    out: readTimingParam(params.get("animOut"), DEFAULT_TIMING.out, 100, 5000),
  };

  const token = params.get("t");
  if (token) {
    const settings = decodeSettingsTokenSafe(token);
    if (settings) {
      return {
        rotationData: settings.platforms,
        timing: {
          hold: settings.holdTime,
          in: settings.animInTime,
          out: settings.animOutTime,
        },
        appearance: settings.appearance,
      };
    }
  }

  const dataParam = params.get("data");
  if (dataParam) {
    if (dataParam.length > MAX_ENCODED_SETTINGS_LENGTH) {
      console.error("Failed to parse data param: payload too large");
      return {
        rotationData: DEFAULT_ROTATION_DATA,
        timing: {
          hold: timing.hold,
          in: timing.in,
          out: timing.out,
        },
        appearance: DEFAULT_OVERLAY_APPEARANCE,
      };
    }

    try {
      const parsedData = JSON.parse(dataParam);
      const settings = normalizeRawSettings(parsedData, {
        holdTime: timing.hold,
        animInTime: timing.in,
        animOutTime: timing.out,
      });

      if (settings) {
        return {
          rotationData: settings.platforms,
          timing: {
            hold: settings.holdTime,
            in: settings.animInTime,
            out: settings.animOutTime,
          },
          appearance: settings.appearance,
        };
      }
    } catch (error) {
      console.error("Failed to parse data param:", error);
    }
  }

  const fallbackSettings = normalizeSettings({
    platforms: DEFAULT_ROTATION_DATA,
    holdTime: timing.hold,
    animInTime: timing.in,
    animOutTime: timing.out,
  });

  return {
    rotationData: fallbackSettings?.platforms ?? DEFAULT_ROTATION_DATA,
    timing: {
      hold: fallbackSettings?.holdTime ?? timing.hold,
      in: fallbackSettings?.animInTime ?? timing.in,
      out: fallbackSettings?.animOutTime ?? timing.out,
    },
    appearance: fallbackSettings?.appearance ?? DEFAULT_OVERLAY_APPEARANCE,
  };
}

function buildControllerFromSettings(settings) {
  return new OverlayController(settings.rotationData, {
    ...DEFAULT_CONFIG,
    TIMING: settings.timing,
    APPEARANCE: settings.appearance,
  });
}

function notifyPreviewReady() {
  if (window.parent === window) return;

  window.parent.postMessage(
    {
      type: "smr-preview-ready",
    },
    window.location.origin,
  );
}

class OverlayController {
  constructor(rotationData, config) {
    this.rotationData = rotationData;
    this.config = config;
    this.currentIndex = 0;
    this.rotationTimeoutId = null;
    this.rotationSessionId = 0;
    this.loadNonce = 0;
    this.activeCardClass = null;
    this.activeCtaClasses = [];
    this.motionControls = [];
    this.elements = this.cacheElements();
  }

  cacheElements() {
    return {
      card: document.getElementById("card"),
      cardFrame: document.getElementById("cardFrame"),
      loader: document.getElementById("overlayLoader"),
      emptyState: document.getElementById("overlayEmptyState"),
      stage: document.querySelector(".overlay-stage"),
      icon: document.getElementById("icon"),
      iconWrap: document.querySelector(".overlay-card__iconWrap"),
      label: document.getElementById("label"),
      text: document.getElementById("text"),
      ctaBox: document.getElementById("ctaBox"),
      ctaIcon: document.getElementById("ctaIcon"),
      ctaText: document.getElementById("ctaText"),
    };
  }

  setEmptyStateVisible(visible) {
    if (this.elements.emptyState instanceof HTMLElement) {
      this.elements.emptyState.hidden = !visible;
      this.elements.emptyState.setAttribute("aria-hidden", visible ? "false" : "true");
    }
  }

  stopRotation() {
    if (this.rotationTimeoutId !== null) {
      window.clearTimeout(this.rotationTimeoutId);
      this.rotationTimeoutId = null;
    }
    this.rotationSessionId += 1;
  }

  destroy() {
    this.stopRotation();
    this.cancelAnimations();
    if (this.elements.loader instanceof HTMLElement) {
      this.elements.loader.classList.remove("is-hidden");
    }
    this.loadNonce += 1;
  }

  showLoader() {
    if (this.elements.loader instanceof HTMLElement) {
      this.elements.loader.classList.remove("is-hidden");
    }
  }

  hideLoader() {
    if (this.elements.loader instanceof HTMLElement) {
      this.elements.loader.classList.add("is-hidden");
    }
  }

  cancelAnimations() {
    this.motionControls.forEach((control) => {
      control.stop?.();
      control.cancel?.();
    });
    this.motionControls = [];
  }

  collectMotionTargets() {
    const { card, iconWrap, label, text, ctaBox } = this.elements;
    if (!(card instanceof HTMLElement)) {
      return null;
    }

    const copy = text instanceof HTMLElement ? text.closest(".overlay-copy") : null;

    return {
      card,
      icon: iconWrap instanceof HTMLElement && !iconWrap.hidden ? iconWrap : null,
      copy: copy instanceof HTMLElement ? copy : null,
      cta: ctaBox instanceof HTMLElement && !ctaBox.hidden ? ctaBox : null,
      label: label instanceof HTMLElement && !label.hidden ? label : null,
      text: text instanceof HTMLElement ? text : null,
    };
  }

  async runMotionPhase(phase) {
    const targets = this.collectMotionTargets();
    if (!targets) return;

    this.cancelAnimations();

    const preset = this.config.APPEARANCE.motion.preset;
    const spec = getMotionSpec(
      preset,
      phase,
      phase === "in" ? this.config.TIMING.in : this.config.TIMING.out,
    );

    if (preset === "shutter") {
      targets.card.style.transformOrigin = "left center";
    } else {
      targets.card.style.transformOrigin = "center";
    }

    const animations = [
      animate(targets.card, spec.card.keyframes, spec.card.options),
      targets.icon ? animate(targets.icon, spec.icon.keyframes, spec.icon.options) : null,
      targets.copy ? animate(targets.copy, spec.copy.keyframes, spec.copy.options) : null,
      targets.cta ? animate(targets.cta, spec.cta.keyframes, spec.cta.options) : null,
    ].filter(Boolean);

    this.motionControls = animations;
    await Promise.all(
      animations.map((control) => control.finished?.catch(() => undefined) ?? Promise.resolve()),
    );

    this.motionControls = [];
  }

  applyAppearance() {
    const { APPEARANCE: appearance } = this.config;
    const { card, cardFrame, stage } = this.elements;

    if (stage instanceof HTMLElement) {
      stage.style.setProperty("--overlay-safe-margin", `${appearance.layout.safeMargin}px`);
    }

    if (cardFrame instanceof HTMLElement) {
      cardFrame.style.setProperty("--overlay-scale", `${appearance.layout.scale / 100}`);
    }

    if (!(card instanceof HTMLElement)) {
      return;
    }

    card.dataset.motionPreset = appearance.motion.preset;
    card.style.setProperty("--overlay-card-width", `${appearance.layout.width}px`);
    card.style.setProperty("--overlay-card-padding", `${appearance.layout.padding}px`);
    card.style.setProperty(
      "--overlay-card-radius",
      appearance.layout.cornerStyle === "soft" ? "0.375rem" : "0rem",
    );
    card.style.setProperty("--overlay-icon-wrap-size", `${appearance.media.iconSize}px`);
    card.style.setProperty("--overlay-icon-size", `${Math.max(18, Math.round(appearance.media.iconSize * 0.55))}px`);
    card.style.setProperty("--overlay-cta-size", `${appearance.media.ctaSize}px`);
    card.style.setProperty("--overlay-cta-icon-size", `${Math.max(16, Math.round(appearance.media.ctaSize * 0.32))}px`);
    card.style.setProperty("--overlay-label-size", `${appearance.typography.labelSize}px`);
    card.style.setProperty("--overlay-text-size", `${appearance.typography.textSize}px`);
  }

  async preloadPlatformAssets(platform) {
    const loadImage = (src) =>
      new Promise((resolve) => {
        if (!src) {
          resolve();
          return;
        }

        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = src;

        if (image.decode) {
          image.decode().then(resolve).catch(() => resolve());
        }
      });

    await Promise.all([loadImage(platform.overlay.ctaIconPath)]);
  }

  updateContent(item) {
    const platform = PLATFORM_MAP[item.platform];
    if (!platform) return;

    const { icon, iconWrap, label, text, ctaBox, ctaIcon, ctaText } = this.elements;
    if (!icon || !label || !text) return;

    icon.className = `overlay-card__iconGlyph ${platform.faIconClass}`;
    if (iconWrap instanceof HTMLElement) {
      iconWrap.style.setProperty("--overlay-icon-wrap-bg", platform.brandColor);
    }
    label.textContent = platform.label.toUpperCase();
    text.textContent = item.text;

    const ctaCopy = this.config.APPEARANCE.content.customCtaText.trim();

    if (ctaIcon) {
      ctaIcon.src = platform.overlay.ctaIconPath;
    }

    if (ctaText) {
      ctaText.textContent = ctaCopy;
      ctaText.hidden = ctaCopy.length === 0;
    }

    if (iconWrap instanceof HTMLElement) {
      iconWrap.hidden = !this.config.APPEARANCE.content.showIcon;
    }

    if (label instanceof HTMLElement) {
      label.hidden = !this.config.APPEARANCE.content.showLabel;
    }

    if (ctaBox instanceof HTMLElement) {
      ctaBox.hidden = !this.config.APPEARANCE.content.showCTA;
      ctaBox.dataset.hasText = ctaCopy.length > 0 ? "true" : "false";
    }
  }

  updateBackground(platform) {
    const { card, ctaBox } = this.elements;
    if (!(card instanceof HTMLElement)) return;

    if (this.activeCardClass) {
      card.classList.remove(this.activeCardClass);
    }

    card.classList.add(platform.overlay.cardClass);
    this.activeCardClass = platform.overlay.cardClass;

    if (!(ctaBox instanceof HTMLElement)) return;

    if (this.activeCtaClasses.length > 0) {
      ctaBox.classList.remove(...this.activeCtaClasses);
    }

    const nextCtaClasses = platform.overlay.ctaClass.split(/\s+/).filter(Boolean);
    ctaBox.classList.add(...nextCtaClasses);
    this.activeCtaClasses = nextCtaClasses;
  }

  async animate(item) {
    const platform = PLATFORM_MAP[item.platform];
    if (!platform || !this.elements.card) return;
    const nonce = ++this.loadNonce;

    await this.runMotionPhase("out");
    if (nonce !== this.loadNonce) return;
    await this.preloadPlatformAssets(platform);
    if (nonce !== this.loadNonce) return;

    this.updateContent(item);
    this.updateBackground(platform);
    this.applyAppearance();
    await this.runMotionPhase("in");
    if (nonce !== this.loadNonce) return;
  }

  async init() {
    const firstItem = this.rotationData[0];
    const platform = firstItem ? PLATFORM_MAP[firstItem.platform] : null;
    const nonce = this.loadNonce;
    const loadStartedAt = performance.now();

    try {
      if (!firstItem || !platform) {
        this.setEmptyStateVisible(true);
        if (this.elements.card instanceof HTMLElement) {
          this.elements.card.style.visibility = "hidden";
        }
        this.hideLoader();
        notifyPreviewReady();
        return;
      }

      if (!this.elements.card) return;

      this.setEmptyStateVisible(false);
      this.showLoader();
      this.elements.card.style.visibility = "hidden";
      this.updateContent(firstItem);
      this.updateBackground(platform);
      this.applyAppearance();
      await waitForPreload(this.preloadPlatformAssets(platform));
      if (nonce !== this.loadNonce) return;
      const elapsed = performance.now() - loadStartedAt;
      if (elapsed < MINIMUM_LOADER_MS) {
        await wait(MINIMUM_LOADER_MS - elapsed);
      }
      if (nonce !== this.loadNonce) return;
      this.elements.card.style.visibility = "visible";
      this.setEmptyStateVisible(false);
      this.hideLoader();
      await this.runMotionPhase("in");
      if (nonce !== this.loadNonce) return;
      notifyPreviewReady();
    } catch (error) {
      console.error("Overlay init failed:", error);
      if (this.elements.card instanceof HTMLElement) {
        this.elements.card.style.visibility = "visible";
      }
      this.setEmptyStateVisible(false);
      this.hideLoader();
      notifyPreviewReady();
    }
  }

  async updatePreview(nextSettings) {
    this.cancelAnimations();
    this.stopRotation();
    const nonce = ++this.loadNonce;

    this.rotationData = nextSettings.rotationData;
    this.config = {
      ...this.config,
      TIMING: nextSettings.timing,
      APPEARANCE: nextSettings.appearance,
    };

    if (!this.elements.card) {
      return;
    }

    try {
      if (this.rotationData.length === 0) {
        this.currentIndex = 0;
        this.setEmptyStateVisible(true);
        this.elements.card.style.visibility = "hidden";
        this.hideLoader();
        notifyPreviewReady();
        return;
      }

      if (this.currentIndex >= this.rotationData.length) {
        this.currentIndex = 0;
      }

      const currentItem = this.rotationData[this.currentIndex] ?? this.rotationData[0];
      const platform = PLATFORM_MAP[currentItem.platform];
      if (!platform) return;

      this.elements.card.style.visibility = "visible";
      this.setEmptyStateVisible(false);
      this.hideLoader();
      await waitForPreload(this.preloadPlatformAssets(platform));
      if (nonce !== this.loadNonce) return;
      this.updateContent(currentItem);
      this.updateBackground(platform);
      this.applyAppearance();
      if (nonce !== this.loadNonce) return;
      notifyPreviewReady();
      this.start();
    } catch (error) {
      console.error("Overlay preview update failed:", error);
      if (this.elements.card instanceof HTMLElement) {
        this.elements.card.style.visibility = "visible";
      }
      this.setEmptyStateVisible(false);
      this.hideLoader();
      notifyPreviewReady();
    }
  }

  start() {
    if (this.rotationData.length < 2) return;

    this.stopRotation();
    const sessionId = this.rotationSessionId;

    const queueNext = () => {
      if (sessionId !== this.rotationSessionId || this.rotationData.length < 2) return;

      this.rotationTimeoutId = window.setTimeout(async () => {
        if (sessionId !== this.rotationSessionId || this.rotationData.length < 2) return;

        this.currentIndex = (this.currentIndex + 1) % this.rotationData.length;
        await this.animate(this.rotationData[this.currentIndex]);
        if (sessionId !== this.rotationSessionId || this.rotationData.length < 2) return;
        queueNext();
      }, this.config.TIMING.hold);
    };

    queueNext();
  }
}

if (typeof document !== "undefined") {
  const boot = () => {
    const params = new URLSearchParams(window.location.search);
    const isPreview = params.get("preview") === "1";

    const mountController = (settings) => {
      window.__socialMediaRotatorOverlayController?.destroy?.();
      const controller = buildControllerFromSettings(settings);
      window.__socialMediaRotatorOverlayController = controller;
      Promise.resolve(controller.init()).then(() => controller.start());
    };

    if (isPreview) {
      window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type !== "smr-preview-settings") return;

        const settings = normalizeRawSettings(event.data.settings, {}, { allowEmptyPlatforms: true });
        if (!settings) return;

        const nextSettings = {
          rotationData: settings.platforms,
          timing: {
            hold: settings.holdTime,
            in: settings.animInTime,
            out: settings.animOutTime,
          },
          appearance: settings.appearance,
        };

        const existingController = window.__socialMediaRotatorOverlayController;
        if (existingController) {
          void existingController.updatePreview(nextSettings);
          return;
        }

        mountController(nextSettings);
      });
      return;
    }

    mountController(parseURLParams());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}
