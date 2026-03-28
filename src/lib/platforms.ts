import {
  settingsPlatformData as PLATFORM_DEFINITIONS,
} from "../data/mockData.ts";
import { sitePath } from "./site.ts";

export { PLATFORM_DEFINITIONS };

export const PLATFORM_MAP = Object.fromEntries(
  PLATFORM_DEFINITIONS.map((platform) => [platform.id, platform]),
);

export const DEFAULT_ROTATION_DATA = PLATFORM_DEFINITIONS.filter(
  (platform) => platform.defaultEnabled,
).map((platform) => ({
  platform: platform.id,
  text: platform.defaultText,
}));

export const DEFAULT_TIMING = {
  hold: 9000,
  in: 500,
  out: 500,
};

export { sitePath };
