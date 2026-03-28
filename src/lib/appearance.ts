export type AppearancePresetId = "gallery" | "studio" | "broadcast";

export type CornerStyle = "sharp" | "soft";
export type AnimationPresetId = "editorial" | "glide" | "punch" | "shutter";

export interface OverlayAppearance extends Readonly<{
  preset: AppearancePresetId;
  layout: Readonly<{
    width: number;
    scale: number;
    padding: number;
    cornerStyle: CornerStyle;
    safeMargin: number;
  }>;
  typography: Readonly<{
    labelSize: number;
    textSize: number;
  }>;
  media: Readonly<{
    iconSize: number;
    ctaSize: number;
  }>;
  motion: Readonly<{
    preset: AnimationPresetId;
  }>;
  content: Readonly<{
    showIcon: boolean;
    showLabel: boolean;
    showCTA: boolean;
    customCtaText: string;
  }>;
}> {}

export interface OverlayAppearancePreset extends Readonly<{
  id: AppearancePresetId;
  label: string;
  description: string;
  appearance: OverlayAppearance;
}> {}

export interface OverlayAnimationPreset extends Readonly<{
  id: AnimationPresetId;
  label: string;
  description: string;
}> {}

function clampInteger(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

const PRESET_APPEARANCES: Readonly<Record<AppearancePresetId, OverlayAppearance>> = {
  gallery: {
    preset: "gallery",
    layout: {
      width: 520,
      scale: 100,
      padding: 13,
      cornerStyle: "sharp",
      safeMargin: 20,
    },
    typography: {
      labelSize: 13,
      textSize: 28,
    },
    media: {
      iconSize: 58,
      ctaSize: 58,
    },
    motion: {
      preset: "editorial",
    },
    content: {
      showIcon: true,
      showLabel: true,
      showCTA: true,
      customCtaText: "",
    },
  },
  studio: {
    preset: "studio",
    layout: {
      width: 560,
      scale: 108,
      padding: 15,
      cornerStyle: "soft",
      safeMargin: 24,
    },
    typography: {
      labelSize: 14,
      textSize: 30,
    },
    media: {
      iconSize: 62,
      ctaSize: 60,
    },
    motion: {
      preset: "glide",
    },
    content: {
      showIcon: true,
      showLabel: true,
      showCTA: true,
      customCtaText: "",
    },
  },
  broadcast: {
    preset: "broadcast",
    layout: {
      width: 640,
      scale: 116,
      padding: 16,
      cornerStyle: "soft",
      safeMargin: 28,
    },
    typography: {
      labelSize: 15,
      textSize: 33,
    },
    media: {
      iconSize: 64,
      ctaSize: 64,
    },
    motion: {
      preset: "punch",
    },
    content: {
      showIcon: true,
      showLabel: true,
      showCTA: true,
      customCtaText: "",
    },
  },
} as const;

export const OVERLAY_APPEARANCE_PRESETS: readonly OverlayAppearancePreset[] = [
  {
    id: "gallery",
    label: "Gallery",
    description: "Sharp, restrained, and closest to the current editorial default.",
    appearance: PRESET_APPEARANCES.gallery,
  },
  {
    id: "studio",
    label: "Studio",
    description: "A little more lift and spacing for a polished full-screen layout.",
    appearance: PRESET_APPEARANCES.studio,
  },
  {
    id: "broadcast",
    label: "Broadcast",
    description: "Larger card proportions for louder stream-safe readability.",
    appearance: PRESET_APPEARANCES.broadcast,
  },
] as const;

export const OVERLAY_ANIMATION_PRESETS: readonly OverlayAnimationPreset[] = [
  {
    id: "editorial",
    label: "Editorial",
    description: "Soft vertical lift with a blurred handoff that matches the current rotator feel.",
  },
  {
    id: "glide",
    label: "Glide",
    description: "Sweeps sideways like a lower-third sliding into a polished broadcast scene.",
  },
  {
    id: "punch",
    label: "Punch",
    description: "Snappier scale-driven motion for louder, high-energy callouts on stream.",
  },
  {
    id: "shutter",
    label: "Shutter",
    description: "A clipped reveal that feels more graphic and poster-like than a standard fade.",
  },
] as const;

export const DEFAULT_OVERLAY_APPEARANCE = PRESET_APPEARANCES.gallery;

export function getAppearancePresetById(id: string | null | undefined): OverlayAppearancePreset {
  return (
    OVERLAY_APPEARANCE_PRESETS.find((preset) => preset.id === id) ??
    OVERLAY_APPEARANCE_PRESETS[0]
  );
}

export function cloneAppearance(appearance: OverlayAppearance): OverlayAppearance {
  return {
    preset: appearance.preset,
    layout: { ...appearance.layout },
    typography: { ...appearance.typography },
    media: { ...appearance.media },
    motion: { ...appearance.motion },
    content: { ...appearance.content },
  };
}

export function getPresetAppearance(id: AppearancePresetId): OverlayAppearance {
  return cloneAppearance(PRESET_APPEARANCES[id]);
}

export function normalizeAppearance(rawAppearance: unknown): OverlayAppearance {
  if (!rawAppearance || typeof rawAppearance !== "object") {
    return cloneAppearance(DEFAULT_OVERLAY_APPEARANCE);
  }

  const raw = rawAppearance as {
    preset?: string;
    layout?: Partial<OverlayAppearance["layout"]>;
    typography?: Partial<OverlayAppearance["typography"]>;
    media?: Partial<OverlayAppearance["media"]>;
    motion?: Partial<OverlayAppearance["motion"]>;
    content?: Partial<OverlayAppearance["content"]>;
  };

  const preset = getAppearancePresetById(raw.preset).id;
  const presetAppearance = PRESET_APPEARANCES[preset];
  const cornerStyle = raw.layout?.cornerStyle === "soft" ? "soft" : "sharp";
  const motionPreset = OVERLAY_ANIMATION_PRESETS.some(
    (candidate) => candidate.id === raw.motion?.preset,
  )
    ? (raw.motion?.preset as AnimationPresetId)
    : presetAppearance.motion.preset;
  return {
    preset,
    layout: {
      width: clampInteger(raw.layout?.width, presetAppearance.layout.width, 360, 720),
      scale: clampInteger(raw.layout?.scale, presetAppearance.layout.scale, 80, 140),
      padding: clampInteger(raw.layout?.padding, presetAppearance.layout.padding, 8, 28),
      cornerStyle,
      safeMargin: clampInteger(raw.layout?.safeMargin, presetAppearance.layout.safeMargin, 8, 48),
    },
    typography: {
      labelSize: clampInteger(raw.typography?.labelSize, presetAppearance.typography.labelSize, 10, 18),
      textSize: clampInteger(raw.typography?.textSize, presetAppearance.typography.textSize, 22, 40),
    },
    media: {
      iconSize: clampInteger(raw.media?.iconSize, presetAppearance.media.iconSize, 36, 80),
      ctaSize: clampInteger(raw.media?.ctaSize, presetAppearance.media.ctaSize, 36, 80),
    },
    motion: {
      preset: motionPreset,
    },
    content: {
      showIcon:
        typeof raw.content?.showIcon === "boolean"
          ? raw.content.showIcon
          : presetAppearance.content.showIcon,
      showLabel:
        typeof raw.content?.showLabel === "boolean"
          ? raw.content.showLabel
          : presetAppearance.content.showLabel,
      showCTA:
        typeof raw.content?.showCTA === "boolean"
          ? raw.content.showCTA
          : presetAppearance.content.showCTA,
      customCtaText:
        typeof raw.content?.customCtaText === "string"
          ? raw.content.customCtaText.trim().slice(0, 24)
          : presetAppearance.content.customCtaText,
    },
  };
}
