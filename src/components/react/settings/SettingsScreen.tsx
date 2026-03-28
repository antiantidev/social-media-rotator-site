import {
  settingsFooterLinks,
  settingsPanelCopy,
  settingsPrimaryPlatformIds,
  settingsPrimaryPlatformLabels,
} from "../../../data/mockData";
import { useSettingsForm } from "../../../hooks/useSettingsForm";
import { MAX_ENCODED_SETTINGS_LENGTH } from "../../../lib/settingsLimits.ts";
import { sitePath } from "../../../lib/site.ts";
import { MonochromeHeader } from "../shared/MonochromeHeader";
import { MonochromeFooter } from "../shared/MonochromeFooter";
import { SettingsHeroSection } from "./SettingsHeroSection";
import {
  AppearancePresetCard,
  AppearanceSliderControl,
  AppearanceToggleControl,
  CornerStyleControl,
  MotionPresetCard,
  PlatformRow,
  SettingsPanel,
  TimingControl,
} from "./SettingsPanels";
import { SettingsPreviewPanel } from "./SettingsPreviewPanel";

export interface SettingsScreenProps extends Readonly<Record<string, never>> {}

function formatTimingLabel(valueMs: number) {
  return `${(valueMs / 1000).toFixed(1)}s`;
}

function formatPercentLabel(value: number) {
  return `${value}%`;
}

function formatPixelLabel(value: number) {
  return `${value}px`;
}

export function SettingsScreen(_: SettingsScreenProps) {
  const {
    platforms,
    timing,
    appearance,
    appearancePresets,
    animationPresets,
    generated,
    tokenInput,
    previewFrameUrl,
    previewUrl,
    previewPayload,
    activeQueue,
    copyLabel,
    shareStats,
    generateError,
    importError,
    copyError,
    shareError,
    tokenCopyLabel,
    tokenCopyError,
    localDraftStatus,
    localDraftMessage,
    canGenerate,
    canImport,
    canShare,
    canExportToken,
    setTokenInput,
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
  } = useSettingsForm();

  const primaryPlatformSet = new Set(settingsPrimaryPlatformIds);
  const primaryPlatforms = platforms.filter((platform) => primaryPlatformSet.has(platform.id));
  const displayedUrl = generated?.url ?? previewUrl;
  const generatedToken = generated?.token ?? null;
  const platformById = new Map(platforms.map((platform) => [platform.id, platform] as const));

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--text)]">
      <MonochromeHeader
        brand="Social Media Rotator"
        navLinks={[
          { label: "Home", href: sitePath("") },
          { label: "Settings", href: sitePath("settings/"), active: true },
          { label: "Overlay", href: sitePath("overlay/") },
        ]}
        actions={
          <a href={sitePath("overlay/")} className="button-secondary px-5 py-2.5 text-sm font-medium">
            Overlay
          </a>
        }
      />

      <main className="editorial-shell flex w-full flex-1 flex-col pb-20 pt-32">
        <SettingsHeroSection />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <SettingsPanel title={settingsPanelCopy.socialPlatformsTitle} icon="share">
              <div className="space-y-6">
                {settingsPrimaryPlatformIds.map((platformId) => {
                  const platform = platformById.get(platformId);

                  if (!platform) return null;

                  return (
                    <PlatformRow
                      key={platform.id}
                      platform={platform}
                      label={settingsPrimaryPlatformLabels[platform.id] ?? platform.label}
                      inputId={`platform-${platform.id}`}
                      onToggle={updatePlatformEnabled}
                      onChange={updatePlatformText}
                    />
                  );
                })}
              </div>
            </SettingsPanel>

            <SettingsPanel title={settingsPanelCopy.overlayStyleTitle} icon="palette">
              <div className="space-y-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                      {settingsPanelCopy.presetSectionLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      {settingsPanelCopy.overlayStyleDescription}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetAppearance}
                    className="ghost-button px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text)]"
                  >
                    {settingsPanelCopy.resetStyleButton}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                  {appearancePresets.map((preset) => (
                    <AppearancePresetCard
                      key={preset.id}
                      id={preset.id}
                      label={preset.label}
                      description={preset.description}
                      selected={appearance.preset === preset.id}
                      onSelect={updateAppearancePreset}
                    />
                  ))}
                </div>

                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                    {settingsPanelCopy.motionSectionLabel}
                  </p>
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {animationPresets.map((preset) => (
                      <MotionPresetCard
                        key={preset.id}
                        id={preset.id}
                        label={preset.label}
                        description={preset.description}
                        selected={appearance.motion.preset === preset.id}
                        onSelect={updateAppearanceMotionPreset}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <CornerStyleControl
                    value={appearance.layout.cornerStyle}
                    onChange={(value) => updateAppearanceLayout("cornerStyle", value)}
                    sharpLabel={settingsPanelCopy.sharpCorners}
                    softLabel={settingsPanelCopy.softCorners}
                  />
                </div>

                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                    {settingsPanelCopy.advancedSectionLabel}
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AppearanceSliderControl
                      id="appearance-card-width"
                      kicker="Layout Core"
                      label={settingsPanelCopy.cardWidth}
                      valueLabel={formatPixelLabel(appearance.layout.width)}
                      value={appearance.layout.width}
                      min={360}
                      max={720}
                      step={10}
                      onChange={(value) => updateAppearanceLayout("width", value)}
                    />
                    <AppearanceSliderControl
                      id="appearance-overall-scale"
                      kicker="Layout Core"
                      label={settingsPanelCopy.overallScale}
                      valueLabel={formatPercentLabel(appearance.layout.scale)}
                      value={appearance.layout.scale}
                      min={80}
                      max={140}
                      step={1}
                      onChange={(value) => updateAppearanceLayout("scale", value)}
                    />
                    <AppearanceSliderControl
                      id="appearance-inner-padding"
                      kicker="Layout Core"
                      label={settingsPanelCopy.innerPadding}
                      valueLabel={formatPixelLabel(appearance.layout.padding)}
                      value={appearance.layout.padding}
                      min={8}
                      max={28}
                      step={1}
                      onChange={(value) => updateAppearanceLayout("padding", value)}
                    />
                    <AppearanceSliderControl
                      id="appearance-safe-margin"
                      kicker="Layout Core"
                      label={settingsPanelCopy.safeMargin}
                      valueLabel={formatPixelLabel(appearance.layout.safeMargin)}
                      value={appearance.layout.safeMargin}
                      min={8}
                      max={48}
                      step={1}
                      onChange={(value) => updateAppearanceLayout("safeMargin", value)}
                    />
                    <AppearanceSliderControl
                      id="appearance-label-size"
                      kicker="Typography"
                      label={settingsPanelCopy.labelSize}
                      valueLabel={formatPixelLabel(appearance.typography.labelSize)}
                      value={appearance.typography.labelSize}
                      min={10}
                      max={18}
                      step={1}
                      onChange={(value) => updateAppearanceTypography("labelSize", value)}
                    />
                    <AppearanceSliderControl
                      id="appearance-text-size"
                      kicker="Typography"
                      label={settingsPanelCopy.textSize}
                      valueLabel={formatPixelLabel(appearance.typography.textSize)}
                      value={appearance.typography.textSize}
                      min={22}
                      max={40}
                      step={1}
                      onChange={(value) => updateAppearanceTypography("textSize", value)}
                    />
                    <AppearanceSliderControl
                      id="appearance-icon-size"
                      kicker="Media"
                      label={settingsPanelCopy.iconSize}
                      valueLabel={formatPixelLabel(appearance.media.iconSize)}
                      value={appearance.media.iconSize}
                      min={36}
                      max={80}
                      step={1}
                      onChange={(value) => updateAppearanceMedia("iconSize", value)}
                    />
                    <AppearanceSliderControl
                      id="appearance-cta-size"
                      kicker="Media"
                      label={settingsPanelCopy.ctaSize}
                      valueLabel={formatPixelLabel(appearance.media.ctaSize)}
                      value={appearance.media.ctaSize}
                      min={36}
                      max={80}
                      step={1}
                      onChange={(value) => updateAppearanceMedia("ctaSize", value)}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                    {settingsPanelCopy.contentSectionLabel}
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AppearanceToggleControl
                      kicker="Content"
                      label={settingsPanelCopy.showIcon}
                      description="Show the platform badge at the leading edge of the card."
                      checked={appearance.content.showIcon}
                      onChange={(checked) => updateAppearanceContent("showIcon", checked)}
                    />
                    <AppearanceToggleControl
                      kicker="Content"
                      label={settingsPanelCopy.showLabel}
                      description="Keep or hide the uppercase platform label above the main handle."
                      checked={appearance.content.showLabel}
                      onChange={(checked) => updateAppearanceContent("showLabel", checked)}
                    />
                    <AppearanceToggleControl
                      kicker="CTA"
                      label={settingsPanelCopy.showCta}
                      description="Show the CTA block at the end of the card."
                      checked={appearance.content.showCTA}
                      onChange={(checked) => updateAppearanceContent("showCTA", checked)}
                    />
                    <div className="space-y-3 bg-[var(--surface_container_low)] p-4">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                          CTA Copy
                        </div>
                        <div className="text-base font-semibold tracking-[-0.02em] text-[var(--text)]">
                          {settingsPanelCopy.customCtaText}
                        </div>
                        <p className="text-sm leading-6 text-[var(--text-muted)]">
                          Leave this empty to use each platform&apos;s built-in CTA text.
                        </p>
                      </div>
                      <input
                        type="text"
                        value={appearance.content.customCtaText}
                        maxLength={24}
                        onChange={(event) =>
                          updateAppearanceContent("customCtaText", event.currentTarget.value)
                        }
                        placeholder={settingsPanelCopy.customCtaPlaceholder}
                        className="w-full border border-black/8 bg-[var(--surface_container_low)] px-4 py-3 text-base font-medium tracking-[-0.02em] text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-soft)] focus:border-[var(--text-soft)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SettingsPanel>

            <SettingsPanel title={settingsPanelCopy.animationTimingTitle} icon="timer">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                <TimingControl
                  id="timing-hold-seconds"
                  label={settingsPanelCopy.displayDuration}
                  valueLabel={formatTimingLabel(timing.holdSeconds * 1000)}
                  value={timing.holdSeconds}
                  min={1}
                  max={15}
                  step={1}
                  onChange={(value) => updateTiming("holdSeconds", value)}
                />

                <TimingControl
                  id="timing-anim-in"
                  label={settingsPanelCopy.transitionSpeed}
                  valueLabel={`${timing.animInMs}ms`}
                  value={timing.animInMs}
                  min={100}
                  max={5000}
                  step={100}
                  onChange={(value) => updateTiming("animInMs", value)}
                />

                <TimingControl
                  id="timing-anim-out"
                  label={settingsPanelCopy.transitionOut}
                  valueLabel={`${timing.animOutMs}ms`}
                  value={timing.animOutMs}
                  min={100}
                  max={5000}
                  step={100}
                  onChange={(value) => updateTiming("animOutMs", value)}
                />
              </div>
            </SettingsPanel>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <section className="surface-card p-6">
                <h3 className="mb-4 font-display text-xl font-bold text-[var(--text)]">
                  {settingsPanelCopy.shareLinkTitle}
                </h3>
                <p className="mb-6 text-xs text-[var(--text-soft)]">
                  {settingsPanelCopy.shareLinkDescription}
                </p>
                <button
                  type="button"
                  onClick={generateShareLink}
                  disabled={!canGenerate}
                  className="button-primary w-full py-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {settingsPanelCopy.generateButton}
                </button>
                <p
                  className={`mt-3 text-xs ${generateError ? "text-red-600" : "text-[var(--text-muted)]"}`}
                  aria-live="polite"
                >
                  {generateError
                    ? generateError
                    : canGenerate
                    ? "The share URL updates from the current edits."
                    : "Enable at least one platform before generating a link."}
                </p>
              </section>

              <section className="surface-card p-6">
                <h3 className="mb-4 font-display text-xl font-bold text-[var(--text)]">
                  {settingsPanelCopy.tokenImportTitle}
                </h3>
                <div className="flex gap-2">
                  <input
                    aria-invalid={Boolean(importError)}
                    type="text"
                    value={tokenInput}
                    maxLength={MAX_ENCODED_SETTINGS_LENGTH}
                    onChange={(event) => setTokenInput(event.currentTarget.value)}
                    placeholder={settingsPanelCopy.tokenImportPlaceholder}
                    className={`min-w-0 flex-1 border bg-[var(--surface_container_low)] px-4 py-2 text-sm outline-none transition-colors placeholder:text-[var(--text-soft)] focus:border-[var(--text-soft)] ${
                      importError
                        ? "border-red-400 bg-red-500/5 text-red-700"
                        : "border-black/8 text-[var(--text)]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={importToken}
                    disabled={!canImport}
                    className="rounded-md bg-[var(--text)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--text-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {settingsPanelCopy.importButton}
                  </button>
                </div>
                <p
                  className={`mt-3 text-xs ${
                    importError ? "text-red-600" : "text-[var(--text-muted)]"
                  }`}
                  aria-live="polite"
                >
                  {importError ?? "Paste a token to restore a saved configuration."}
                </p>
                <div className="mt-5 space-y-3 border-t border-black/5 pt-4">
                  <button
                    type="button"
                    onClick={copyCurrentToken}
                    disabled={!canExportToken}
                    className="ghost-button w-full py-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {tokenCopyLabel}
                  </button>
                  <p
                    className={`text-xs ${tokenCopyError ? "text-red-600" : "text-[var(--text-muted)]"}`}
                    aria-live="polite"
                  >
                    {tokenCopyError ?? "Export the current settings as a reusable token."}
                  </p>
                </div>
                <div className="mt-5 space-y-3 border-t border-black/5 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                      Local Draft
                    </div>
                    <button
                      type="button"
                      onClick={clearLocalDraft}
                      className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-soft)] transition-colors hover:text-[var(--text)]"
                    >
                      Reset local draft
                    </button>
                  </div>
                  <p
                    className={`text-xs ${
                      localDraftStatus === "error"
                        ? "text-red-600"
                        : localDraftStatus === "saving"
                          ? "text-[var(--text)]"
                          : "text-[var(--text-muted)]"
                    }`}
                    aria-live="polite"
                  >
                    {localDraftMessage ?? "Your latest edits are saved on this device."}
                  </p>
                </div>
              </section>
            </div>

            <section className="surface-card p-6">
              <h3 className="mb-4 font-display text-xl font-bold text-[var(--text)]">
                {settingsPanelCopy.helpTitle}
              </h3>
              <div className="space-y-2 text-sm text-[var(--text-muted)]">
                <div>• {settingsPanelCopy.helpBullet1}</div>
                <div>• {settingsPanelCopy.helpBullet2}</div>
                <div>• {settingsPanelCopy.helpBullet3}</div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <SettingsPreviewPanel
              previewUrl={previewUrl}
              previewFrameUrl={previewFrameUrl}
              previewPayload={previewPayload}
              displayedUrl={displayedUrl}
              generatedToken={generatedToken}
              copyLabel={copyLabel}
              shareStats={shareStats}
              canShare={canShare}
              copyError={copyError}
              shareError={shareError}
              onCopy={copyShareLink}
              onShare={shareShareLink}
            />
          </div>
        </div>
      </main>

      <MonochromeFooter
        brand="Social Media Rotator"
        tagline="Made with ❤️ in Viet Nam"
        subline="For streamers, by a streamer."
        links={settingsFooterLinks}
        copyright="© 2026 Social Media Rotator"
        variant="settings"
      />
    </div>
  );
}
