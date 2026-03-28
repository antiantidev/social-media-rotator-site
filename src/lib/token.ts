import type { OverlayAppearance } from "./appearance.ts";
import { DEFAULT_OVERLAY_APPEARANCE, normalizeAppearance } from "./appearance.ts";
import { DEFAULT_TIMING, PLATFORM_MAP } from "./platforms.ts";
import { MAX_ENCODED_SETTINGS_LENGTH, sanitizePlatformText } from "./settingsLimits.ts";

export interface NormalizeSettingsOptions extends Readonly<{
  allowEmptyPlatforms?: boolean;
}> {}

function encodeBase64Url(text) {
  const utf8Bytes = new TextEncoder().encode(text);
  let binary = "";

  utf8Bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function decodeBase64Url(token) {
  let base64 = token.replace(/-/g, "+").replace(/_/g, "/");

  while (base64.length % 4) {
    base64 += "=";
  }

  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function clampInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function normalizePlatformEntry(entry) {
  if (!entry || typeof entry !== "object") return null;

  const platform = typeof entry.platform === "string" ? entry.platform.trim() : "";
  const text = typeof entry.text === "string" ? sanitizePlatformText(entry.text) : "";

  if (!platform || !PLATFORM_MAP[platform] || !text) {
    return null;
  }

  return {
    platform,
    text,
  };
}

export function encodeSettingsToken(settings) {
  try {
    return encodeBase64Url(JSON.stringify(settings));
  } catch (error) {
    console.error("Token encode error:", error);
    return null;
  }
}

export function decodeSettingsToken(token) {
  if (typeof token !== "string" || token.length > MAX_ENCODED_SETTINGS_LENGTH) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(token));
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}

export function normalizeSettings(rawSettings, options: NormalizeSettingsOptions = {}) {
  if (!rawSettings || typeof rawSettings !== "object") {
    return null;
  }

  const allowEmptyPlatforms = options.allowEmptyPlatforms === true;

  const platforms = Array.isArray(rawSettings.platforms)
    ? rawSettings.platforms
        .map((entry) => normalizePlatformEntry(entry))
        .filter(Boolean)
    : [];

  if (platforms.length === 0 && !allowEmptyPlatforms) {
    return null;
  }

  return {
    platforms,
    holdTime: clampInteger(rawSettings.holdTime, DEFAULT_TIMING.hold, 1000, 60000),
    animInTime: clampInteger(rawSettings.animInTime, DEFAULT_TIMING.in, 100, 5000),
    animOutTime: clampInteger(rawSettings.animOutTime, DEFAULT_TIMING.out, 100, 5000),
    appearance: normalizeAppearance(rawSettings.appearance),
  };
}

export function decodeSettingsTokenSafe(token) {
  return normalizeSettings(decodeSettingsToken(token));
}

export type NormalizedSettings = Readonly<{
  platforms: readonly Readonly<{
    platform: string;
    text: string;
  }>[];
  holdTime: number;
  animInTime: number;
  animOutTime: number;
  appearance: OverlayAppearance;
}>;

export { DEFAULT_OVERLAY_APPEARANCE };
