import assert from "node:assert/strict";
import test from "node:test";

import {
  clearSavedSettings,
  loadSavedSettings,
  saveSettings,
} from "../src/lib/persistence.ts";
import { DEFAULT_OVERLAY_APPEARANCE } from "../src/lib/token.ts";

function createStorage() {
  const store = new Map<string, string>();

  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
  };
}

test("local persistence saves, loads, and clears normalized settings", () => {
  const previousWindow = globalThis.window;
  const localStorage = createStorage();

  try {
    globalThis.window = { localStorage } as Window & typeof globalThis;

    const settings = {
      platforms: [{ platform: "youtube", text: "@channel" }],
      holdTime: 9000,
      animInTime: 500,
      animOutTime: 500,
      appearance: DEFAULT_OVERLAY_APPEARANCE,
    };

    assert.deepEqual(saveSettings(settings), { ok: true });

    const loaded = loadSavedSettings();
    assert.ok(loaded);
    assert.deepEqual(loaded?.settings, settings);

    assert.deepEqual(clearSavedSettings(), { ok: true });
    assert.equal(loadSavedSettings(), null);
  } finally {
    globalThis.window = previousWindow;
  }
});
