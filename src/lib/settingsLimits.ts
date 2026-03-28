export const MAX_PLATFORM_TEXT_LENGTH = 160;
export const MAX_ENCODED_SETTINGS_LENGTH = 8192;

export function sanitizePlatformText(value: string) {
  return value.trim().slice(0, MAX_PLATFORM_TEXT_LENGTH);
}
