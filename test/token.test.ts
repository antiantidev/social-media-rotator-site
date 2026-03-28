import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_OVERLAY_APPEARANCE } from "../src/lib/token.ts";
import { DEFAULT_ROTATION_DATA } from "../src/lib/platforms.ts";
import {
  decodeSettingsTokenSafe,
  normalizeSettings,
  encodeSettingsToken,
} from "../src/lib/token.ts";
import { MAX_PLATFORM_TEXT_LENGTH } from "../src/lib/settingsLimits.ts";

test("token round-trips valid settings", () => {
  const settings = {
    platforms: [{ platform: "tiktok", text: "@nguyennhatlinh.official" }],
    holdTime: 9000,
    animInTime: 1000,
    animOutTime: 1000,
  };

  const token = encodeSettingsToken(settings);
  assert.ok(token);
  assert.deepEqual(decodeSettingsTokenSafe(token), {
    ...settings,
    appearance: DEFAULT_OVERLAY_APPEARANCE,
  });
});

test("token normalization rejects empty or invalid platform payloads", () => {
  const emptyToken = encodeSettingsToken({
    platforms: [],
    holdTime: 9000,
    animInTime: 1000,
    animOutTime: 1000,
  });

  assert.equal(decodeSettingsTokenSafe(emptyToken), null);

  const normalized = normalizeSettings({
    platforms: [
      { platform: "bad", text: "x" },
      { platform: "discord", text: "discord.gg/xunAChFVkc" },
    ],
    holdTime: "abc",
    animInTime: -1,
    animOutTime: 100000,
  });

  assert.deepEqual(normalized, {
    platforms: [{ platform: "discord", text: "discord.gg/xunAChFVkc" }],
    holdTime: 9000,
    animInTime: 100,
    animOutTime: 5000,
    appearance: DEFAULT_OVERLAY_APPEARANCE,
  });
});

test("token normalization truncates oversized platform text", () => {
  const longText = `@${"a".repeat(MAX_PLATFORM_TEXT_LENGTH + 50)}`;

  const normalized = normalizeSettings({
    platforms: [{ platform: "tiktok", text: longText }],
    holdTime: 9000,
    animInTime: 1000,
    animOutTime: 1000,
  });

  assert.ok(normalized);
  assert.equal(normalized?.platforms[0]?.text.length, MAX_PLATFORM_TEXT_LENGTH);
});

test("default rotation data stays aligned with the enabled platforms", () => {
  assert.deepEqual(
    DEFAULT_ROTATION_DATA.map((platform) => platform.platform),
    ["tiktok", "discord", "youtube"],
  );
});
