import { useEffect, useMemo, useRef, useState } from "react";

import {
  type AppearancePresetId,
  type AnimationPresetId,
  type CornerStyle,
  type OverlayAppearance,
  OVERLAY_APPEARANCE_PRESETS,
  OVERLAY_ANIMATION_PRESETS,
  cloneAppearance,
  DEFAULT_OVERLAY_APPEARANCE,
  getPresetAppearance,
} from "../lib/appearance.ts";
import {
  clearSavedSettings,
  loadSavedSettings,
  saveSettings,
} from "../lib/persistence.ts";
import { decodeSettingsTokenSafe, encodeSettingsToken } from "../lib/token.ts";
import { DEFAULT_TIMING, PLATFORM_DEFINITIONS } from "../lib/platforms.ts";
import { sanitizePlatformText } from "../lib/settingsLimits.ts";
import { sitePath } from "../lib/site.ts";

export interface SettingsPlatformState extends Readonly<{
  id: string;
  label: string;
  enabled: boolean;
  text: string;
  defaultText: string;
  placeholder: string;
  faIconClass: string;
  brandColor: string;
  iconPath: string;
}> {}

export interface SettingsTimingState extends Readonly<{
  holdSeconds: number;
  animInMs: number;
  animOutMs: number;
}> {}

export interface GeneratedShareState extends Readonly<{
  token: string;
  url: string;
}> {}

export interface AppearancePresetState extends Readonly<{
  id: AppearancePresetId;
  label: string;
  description: string;
}> {}

export interface AnimationPresetState extends Readonly<{
  id: AnimationPresetId;
  label: string;
  description: string;
}> {}

export interface ShareStatsState extends Readonly<{
  tokenLength: number;
  urlLength: number;
  fullUrlLength: number;
  savings: number;
  savingsPercent: number;
}> {}

export type LocalDraftStatus = "idle" | "saving" | "saved" | "error";

export interface SettingsFormState extends Readonly<{
  platforms: readonly SettingsPlatformState[];
  timing: SettingsTimingState;
  appearance: OverlayAppearance;
  appearancePresets: readonly AppearancePresetState[];
  animationPresets: readonly AnimationPresetState[];
  generated: GeneratedShareState | null;
  shareStats: ShareStatsState | null;
  tokenInput: string;
  previewFrameUrl: string;
  previewUrl: string;
  previewPayload: Readonly<{
    platforms: readonly Readonly<{
      platform: string;
      text: string;
    }>[];
    holdTime: number;
    animInTime: number;
    animOutTime: number;
    appearance: OverlayAppearance;
  }>;
  activeQueue: readonly SettingsPlatformState[];
  copyLabel: string;
  generateError: string | null;
  importError: string | null;
  copyError: string | null;
  shareError: string | null;
  tokenCopyLabel: string;
  tokenCopyError: string | null;
  localDraftStatus: LocalDraftStatus;
  localDraftMessage: string | null;
  canGenerate: boolean;
  canImport: boolean;
  canShare: boolean;
  canExportToken: boolean;
  setTokenInput: (value: string) => void;
  updatePlatformEnabled: (id: string, enabled: boolean) => void;
  updatePlatformText: (id: string, text: string) => void;
  updateTiming: (field: keyof SettingsTimingState, value: number) => void;
  updateAppearancePreset: (presetId: AppearancePresetId) => void;
  updateAppearanceMotionPreset: (presetId: AnimationPresetId) => void;
  updateAppearanceLayout: (
    field: keyof OverlayAppearance["layout"],
    value: number | CornerStyle,
  ) => void;
  updateAppearanceTypography: (
    field: keyof OverlayAppearance["typography"],
    value: number,
  ) => void;
  updateAppearanceMedia: (field: keyof OverlayAppearance["media"], value: number) => void;
  updateAppearanceContent: (
    field: keyof OverlayAppearance["content"],
    value: boolean | string,
  ) => void;
  resetAppearance: () => void;
  generateShareLink: () => void;
  copyShareLink: () => Promise<void>;
  shareShareLink: () => Promise<void>;
  copyCurrentToken: () => Promise<void>;
  importToken: () => void;
  clearLocalDraft: () => void;
}> {}

function buildInitialPlatforms(): SettingsPlatformState[] {
  return PLATFORM_DEFINITIONS.map((platform) => ({
    id: platform.id,
    label: platform.label,
    enabled: platform.defaultEnabled,
    text: platform.defaultValue,
    defaultText: platform.defaultText,
    placeholder: platform.placeholder,
    faIconClass: platform.faIconClass,
    brandColor: platform.brandColor,
    iconPath: platform.iconPath,
  }));
}

function buildSettingsFromNormalized(settings: NonNullable<ReturnType<typeof decodeSettingsTokenSafe>>) {
  const platformMap = new Map(settings.platforms.map((item) => [item.platform, item.text] as const));

  return {
    platforms: PLATFORM_DEFINITIONS.map((platform) => {
      const text = platformMap.get(platform.id);
      return {
        id: platform.id,
        label: platform.label,
        enabled: Boolean(text),
        text: text ?? platform.defaultValue,
        defaultText: platform.defaultText,
        placeholder: platform.placeholder,
        faIconClass: platform.faIconClass,
        brandColor: platform.brandColor,
        iconPath: platform.iconPath,
      };
    }),
    timing: {
      holdSeconds: Math.max(1, Math.round(settings.holdTime / 1000)),
      animInMs: settings.animInTime,
      animOutMs: settings.animOutTime,
    },
    appearance: cloneAppearance(settings.appearance),
  };
}

function buildOverlayBaseUrl(absolute = false) {
  const overlayPath = sitePath("overlay/");
  if (!absolute) {
    return overlayPath;
  }

  if (typeof window === "undefined") {
    return overlayPath;
  }

  return new URL(overlayPath, window.location.origin).href;
}

function buildOverlayUrlFromPayload(payload: unknown, absolute = false) {
  const settings = payload as { platforms?: readonly unknown[] } | null;

  if (!settings?.platforms?.length) {
    return buildOverlayBaseUrl(absolute);
  }

  const token = encodeSettingsToken(payload as Parameters<typeof encodeSettingsToken>[0]);
  return token ? `${buildOverlayBaseUrl(absolute)}?t=${token}` : buildOverlayBaseUrl(absolute);
}

function buildOverlayDataUrlFromPayload(payload: unknown, absolute = false) {
  const settings = payload as { platforms?: readonly unknown[] } | null;

  if (!settings?.platforms?.length) {
    return buildOverlayBaseUrl(absolute);
  }

  const data = encodeURIComponent(JSON.stringify(payload));
  return `${buildOverlayBaseUrl(absolute)}?data=${data}`;
}

export function useSettingsForm(): SettingsFormState {
  const [platforms, setPlatforms] = useState<SettingsPlatformState[]>(buildInitialPlatforms);
  const [timing, setTiming] = useState<SettingsTimingState>({
    holdSeconds: DEFAULT_TIMING.hold / 1000,
    animInMs: DEFAULT_TIMING.in,
    animOutMs: DEFAULT_TIMING.out,
  });
  const [appearance, setAppearance] = useState<OverlayAppearance>(() =>
    cloneAppearance(DEFAULT_OVERLAY_APPEARANCE),
  );
  const [generated, setGenerated] = useState<GeneratedShareState | null>(null);
  const [tokenInput, setTokenInputValue] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy URL");
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [tokenCopyLabel, setTokenCopyLabel] = useState("Copy Token");
  const [tokenCopyError, setTokenCopyError] = useState<string | null>(null);
  const [localDraftStatus, setLocalDraftStatus] = useState<LocalDraftStatus>("idle");
  const [localDraftMessage, setLocalDraftMessage] = useState<string | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const copyLabelTimeoutRef = useRef<number | null>(null);
  const tokenCopyLabelTimeoutRef = useRef<number | null>(null);
  const appearancePresets = useMemo<readonly AppearancePresetState[]>(
    () =>
      OVERLAY_APPEARANCE_PRESETS.map((preset) => ({
        id: preset.id,
        label: preset.label,
        description: preset.description,
      })),
    [],
  );
  const animationPresets = useMemo<readonly AnimationPresetState[]>(
    () =>
      OVERLAY_ANIMATION_PRESETS.map((preset) => ({
        id: preset.id,
        label: preset.label,
        description: preset.description,
      })),
    [],
  );

  const activeQueue = useMemo(
    () => platforms.filter((platform) => platform.enabled && platform.text.trim()),
    [platforms],
  );

  const currentPayload = useMemo(
    () => ({
      platforms: activeQueue.map((platform) => ({
        platform: platform.id,
        text: sanitizePlatformText(platform.text),
      })),
      holdTime: timing.holdSeconds * 1000,
      animInTime: timing.animInMs,
      animOutTime: timing.animOutMs,
      appearance,
    }),
    [activeQueue, appearance, timing],
  );

  const previewUrl = useMemo(() => buildOverlayUrlFromPayload(currentPayload, true), [currentPayload]);
  const previewFrameUrl = useMemo(
    () => `${buildOverlayBaseUrl(true)}?preview=1`,
    [],
  );
  const currentToken = useMemo(
    () => encodeSettingsToken(currentPayload),
    [currentPayload],
  );

  const shareStats = useMemo<ShareStatsState | null>(() => {
    if (!generated) return null;

    const fullUrl = buildOverlayDataUrlFromPayload(currentPayload, true);
    const urlLength = generated.url.length;
    const savings = fullUrl.length - urlLength;
    const savingsPercent = Math.round((savings / fullUrl.length) * 100);

    return {
      tokenLength: generated.token.length,
      urlLength,
      fullUrlLength: fullUrl.length,
      savings,
      savingsPercent,
    };
  }, [currentPayload, generated]);

  function invalidateGeneratedState() {
    if (copyLabelTimeoutRef.current !== null) {
      window.clearTimeout(copyLabelTimeoutRef.current);
      copyLabelTimeoutRef.current = null;
    }
    if (tokenCopyLabelTimeoutRef.current !== null) {
      window.clearTimeout(tokenCopyLabelTimeoutRef.current);
      tokenCopyLabelTimeoutRef.current = null;
    }
    setGenerated(null);
    setCopyLabel("Copy URL");
    setTokenCopyLabel("Copy Token");
    setGenerateError(null);
  }

  async function tryCopyToClipboard(url: string) {
    if (!navigator.clipboard?.writeText) {
      return "Clipboard access is unavailable in this browser.";
    }

    try {
      await navigator.clipboard.writeText(url);
      return null;
    } catch {
      return "Unable to copy the URL. Check browser permissions.";
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("t");
    if (token) {
      const settings = decodeSettingsTokenSafe(token);
      if (settings) {
        const nextState = buildSettingsFromNormalized(settings);
        setPlatforms(nextState.platforms);
        setTiming(nextState.timing);
        setAppearance(nextState.appearance);
        const saved = saveSettings(settings);
        setLocalDraftStatus(saved.ok ? "saved" : "error");
        setLocalDraftMessage(
          saved.ok ? "Saved locally" : saved.error ?? "Could not save settings on this device.",
        );
        return;
      }

      setImportError("That token in the URL is invalid. Falling back to your local draft.");
    }

    const savedSettings = loadSavedSettings();
    if (!savedSettings) return;

    const nextState = buildSettingsFromNormalized(savedSettings.settings);
    setPlatforms(nextState.platforms);
    setTiming(nextState.timing);
    setAppearance(nextState.appearance);
    setLocalDraftStatus("saved");
    setLocalDraftMessage("Loaded your last local draft");
  }, []);

  useEffect(
    () => () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      if (copyLabelTimeoutRef.current !== null) {
        window.clearTimeout(copyLabelTimeoutRef.current);
        copyLabelTimeoutRef.current = null;
      }

      if (tokenCopyLabelTimeoutRef.current !== null) {
        window.clearTimeout(tokenCopyLabelTimeoutRef.current);
        tokenCopyLabelTimeoutRef.current = null;
      }
    },
    [],
  );

  useEffect(() => {
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (activeQueue.length === 0) {
      saveTimeoutRef.current = window.setTimeout(() => {
        const cleared = clearSavedSettings();
        setLocalDraftStatus(cleared.ok ? "idle" : "error");
        setLocalDraftMessage(
          cleared.ok ? "Local draft cleared" : cleared.error ?? "Could not clear saved settings on this device.",
        );
        saveTimeoutRef.current = null;
      }, 350);

      return () => {
        if (saveTimeoutRef.current !== null) {
          window.clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = null;
        }
      };
    }

    setLocalDraftStatus("saving");
    setLocalDraftMessage("Saving locally...");

    saveTimeoutRef.current = window.setTimeout(() => {
      const result = saveSettings(currentPayload);
      setLocalDraftStatus(result.ok ? "saved" : "error");
      setLocalDraftMessage(
        result.ok ? "Saved locally" : result.error ?? "Could not save settings on this device.",
      );
      saveTimeoutRef.current = null;
    }, 400);

    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [activeQueue.length, currentPayload]);

  function updatePlatformEnabled(id: string, enabled: boolean) {
    invalidateGeneratedState();
    setPlatforms((current) =>
      current.map((platform) => {
        if (platform.id !== id) {
          return platform;
        }

        if (enabled && !platform.text.trim()) {
          return { ...platform, enabled, text: platform.defaultText };
        }

        return { ...platform, enabled };
      }),
    );
  }

  function updatePlatformText(id: string, text: string) {
    invalidateGeneratedState();
    setPlatforms((current) =>
      current.map((platform) =>
        platform.id === id ? { ...platform, text: sanitizePlatformText(text) } : platform,
      ),
    );
  }

  function updateTiming(field: keyof SettingsTimingState, value: number) {
    invalidateGeneratedState();
    setTiming((current) => ({ ...current, [field]: value }));
  }

  function updateAppearancePreset(presetId: AppearancePresetId) {
    invalidateGeneratedState();
    setAppearance(getPresetAppearance(presetId));
  }

  function updateAppearanceMotionPreset(presetId: AnimationPresetId) {
    invalidateGeneratedState();
    setAppearance((current) => ({
      ...current,
      motion: {
        ...current.motion,
        preset: presetId,
      },
    }));
  }

  function updateAppearanceLayout(
    field: keyof OverlayAppearance["layout"],
    value: number | CornerStyle,
  ) {
    invalidateGeneratedState();
    setAppearance((current) => ({
      ...current,
      layout: {
        ...current.layout,
        [field]: value,
      },
    }));
  }

  function updateAppearanceTypography(
    field: keyof OverlayAppearance["typography"],
    value: number,
  ) {
    invalidateGeneratedState();
    setAppearance((current) => ({
      ...current,
      typography: {
        ...current.typography,
        [field]: value,
      },
    }));
  }

  function updateAppearanceMedia(field: keyof OverlayAppearance["media"], value: number) {
    invalidateGeneratedState();
    setAppearance((current) => ({
      ...current,
      media: {
        ...current.media,
        [field]: value,
      },
    }));
  }

  function updateAppearanceContent(
    field: keyof OverlayAppearance["content"],
    value: boolean | string,
  ) {
    invalidateGeneratedState();
    setAppearance((current) => ({
      ...current,
      content: {
        ...current.content,
        [field]: value,
      },
    }));
  }

  function resetAppearance() {
    invalidateGeneratedState();
    setAppearance(cloneAppearance(DEFAULT_OVERLAY_APPEARANCE));
  }

  function generateShareLink() {
    setGenerateError(null);

    const payload = currentPayload;

    if (payload.platforms.length === 0) {
      setGenerated(null);
      setGenerateError("Enable at least one platform before generating a share URL.");
      return;
    }

    const token = encodeSettingsToken(payload);
    if (!token) {
      setGenerated(null);
      setGenerateError("Could not encode the current settings into a share URL.");
      return;
    }

    setGenerated({
      token,
      url: `${buildOverlayBaseUrl(true)}?t=${token}`,
    });
    setCopyLabel("Copy URL");
  }

  async function copyShareLink() {
    const url = generated?.url ?? previewUrl;
    setCopyError(null);

    const error = await tryCopyToClipboard(url);
    if (error) {
      setCopyError(error);
      return;
    }

    if (copyLabelTimeoutRef.current !== null) {
      window.clearTimeout(copyLabelTimeoutRef.current);
    }
    setCopyLabel("Copied! ✓");
    copyLabelTimeoutRef.current = window.setTimeout(() => {
      setCopyLabel("Copy URL");
      copyLabelTimeoutRef.current = null;
    }, 2000);
  }

  async function shareShareLink() {
    const url = generated?.url ?? previewUrl;
    setShareError(null);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "OBS Overlay URL",
          text: "Check out this overlay configuration",
          url,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setShareError("Sharing was cancelled or blocked by the browser.");
      }
      return;
    }

    const error = await tryCopyToClipboard(url);
    if (error) {
      setShareError(error);
      setCopyError(error);
      return;
    }

    if (copyLabelTimeoutRef.current !== null) {
      window.clearTimeout(copyLabelTimeoutRef.current);
    }
    setCopyLabel("Copied! ✓");
    copyLabelTimeoutRef.current = window.setTimeout(() => {
      setCopyLabel("Copy URL");
      copyLabelTimeoutRef.current = null;
    }, 2000);
  }

  async function copyCurrentToken() {
    setTokenCopyError(null);

    if (!currentToken || activeQueue.length === 0) {
      setTokenCopyError("Enable at least one platform before exporting a token.");
      return;
    }

    const error = await tryCopyToClipboard(currentToken);
    if (error) {
      setTokenCopyError(error);
      return;
    }

    if (tokenCopyLabelTimeoutRef.current !== null) {
      window.clearTimeout(tokenCopyLabelTimeoutRef.current);
    }
    setTokenCopyLabel("Copied! ✓");
    tokenCopyLabelTimeoutRef.current = window.setTimeout(() => {
      setTokenCopyLabel("Copy Token");
      tokenCopyLabelTimeoutRef.current = null;
    }, 2000);
  }

  function importToken() {
    const token = tokenInput.trim();
    setImportError(null);

    if (!token) {
      setImportError("Paste a token before loading settings.");
      return;
    }

    const settings = decodeSettingsTokenSafe(token);
    if (!settings) {
      setImportError("That token is invalid or unsupported.");
      return;
    }

    invalidateGeneratedState();

    const nextState = buildSettingsFromNormalized(settings);
    setPlatforms(nextState.platforms);

    setTiming(nextState.timing);
    setAppearance(nextState.appearance);
  }

  function clearLocalDraft() {
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    const cleared = clearSavedSettings();
    setLocalDraftStatus(cleared.ok ? "idle" : "error");
    setLocalDraftMessage(
      cleared.ok ? "Local draft cleared" : cleared.error ?? "Could not clear saved settings on this device.",
    );
  }

  return {
    platforms,
    timing,
    appearance,
    appearancePresets,
    animationPresets,
    generated,
    shareStats,
    tokenInput,
    previewFrameUrl,
    previewUrl,
    previewPayload: currentPayload,
    activeQueue,
    copyLabel,
    generateError,
    importError,
    copyError,
    shareError,
    tokenCopyLabel,
    tokenCopyError,
    localDraftStatus,
    localDraftMessage,
    canGenerate: activeQueue.length > 0,
    canImport: tokenInput.trim().length > 0,
    canShare: activeQueue.length > 0,
    canExportToken: Boolean(currentToken && activeQueue.length > 0),
    setTokenInput: (value: string) => {
      setTokenInputValue(value);
      setImportError(null);
    },
    updatePlatformEnabled,
    updatePlatformText,
    updateTiming,
    updateAppearancePreset,
    updateAppearanceMotionPreset,
    updateAppearanceLayout,
    updateAppearanceTypography,
    updateAppearanceMedia,
    updateAppearanceContent,
    resetAppearance,
    generateShareLink,
    copyShareLink,
    shareShareLink,
    copyCurrentToken,
    importToken,
    clearLocalDraft,
  };
}
