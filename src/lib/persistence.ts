import type { NormalizedSettings } from "./token.ts";
import { normalizeSettings } from "./token.ts";

const SETTINGS_STORAGE_KEY = "smr:settings:v1";

interface StoredSettingsRecord extends Readonly<{
  savedAt: string;
  settings: NormalizedSettings;
}> {}

function readStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadSavedSettings(): StoredSettingsRecord | null {
  const storage = readStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { savedAt?: unknown; settings?: unknown };
    const normalized = normalizeSettings(parsed?.settings);
    if (!normalized) return null;

    return {
      savedAt:
        typeof parsed.savedAt === "string" && parsed.savedAt
          ? parsed.savedAt
          : new Date(0).toISOString(),
      settings: normalized,
    };
  } catch {
    return null;
  }
}

export function saveSettings(settings: NormalizedSettings): { ok: boolean; error?: string } {
  const storage = readStorage();
  if (!storage) {
    return { ok: false, error: "Local storage is unavailable in this browser." };
  }

  try {
    const record: StoredSettingsRecord = {
      savedAt: new Date().toISOString(),
      settings,
    };
    storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(record));
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not save settings on this device." };
  }
}

export function clearSavedSettings(): { ok: boolean; error?: string } {
  const storage = readStorage();
  if (!storage) {
    return { ok: false, error: "Local storage is unavailable in this browser." };
  }

  try {
    storage.removeItem(SETTINGS_STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not clear saved settings on this device." };
  }
}
