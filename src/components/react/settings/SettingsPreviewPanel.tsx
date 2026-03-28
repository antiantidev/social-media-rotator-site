import { useEffect, useRef, useState } from "react";

import { settingsPanelCopy } from "../../../data/mockData";
import type { OverlayAppearance } from "../../../lib/appearance.ts";
import { BrowserFrame } from "../shared/BrowserFrame";

export interface SettingsPreviewPanelProps extends Readonly<{
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
  displayedUrl: string;
  generatedToken: string | null;
  copyLabel: string;
  shareStats: Readonly<{
    tokenLength: number;
    urlLength: number;
    fullUrlLength: number;
    savings: number;
    savingsPercent: number;
  }> | null;
  canShare: boolean;
  copyError: string | null;
  shareError: string | null;
  onCopy: () => Promise<void>;
  onShare: () => Promise<void>;
}> {}

export function SettingsPreviewPanel({
  previewFrameUrl,
  previewUrl,
  previewPayload,
  displayedUrl,
  generatedToken,
  copyLabel,
  shareStats,
  canShare,
  copyError,
  shareError,
  onCopy,
  onShare,
}: SettingsPreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const lastPayloadRef = useRef<string | null>(null);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const urlStatusLabel = generatedToken ? "Generated snapshot" : "Live preview";

  function postPreviewPayload() {
    const targetWindow = iframeRef.current?.contentWindow;
    if (!targetWindow) return;

    const serializedPayload = JSON.stringify(previewPayload);
    if (lastPayloadRef.current === serializedPayload) return;

    lastPayloadRef.current = serializedPayload;
    targetWindow.postMessage(
      {
        type: "smr-preview-settings",
        settings: previewPayload,
      },
      window.location.origin,
    );
  }

  useEffect(() => {
    postPreviewPayload();
  }, [previewPayload]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "smr-preview-ready") return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      setIsPreviewReady(true);
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="space-y-8" title={previewUrl}>
      <BrowserFrame label={settingsPanelCopy.previewModeLabel}>
        <div className="relative aspect-video overflow-hidden bg-neutral-950">
          <iframe
            ref={iframeRef}
            src={previewFrameUrl}
            title="Live overlay preview"
            className={`h-full w-full border-0 bg-transparent transition-opacity duration-200 ${
              isPreviewReady ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => {
              setIsPreviewReady(false);
              lastPayloadRef.current = null;
              postPreviewPayload();
            }}
          />
          <div
            className={`absolute inset-0 grid place-items-center bg-neutral-950 transition-opacity duration-200 ${
              isPreviewReady ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
            }}
          >
            <div
              className="flex items-center gap-3 rounded-md bg-white/6 px-4 py-3 text-white/80 backdrop-blur-sm"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
                Loading Overlay
              </span>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] uppercase tracking-tighter text-white">
              {settingsPanelCopy.liveOutputLabel}
            </span>
          </div>
        </div>
      </BrowserFrame>

      <section className="surface-card p-6">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-soft)]">
          {settingsPanelCopy.streamSourceTitle}
        </h3>
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
              generatedToken
                ? "bg-emerald-500/15 text-emerald-700"
                : "bg-[var(--surface_container_highest)] text-[var(--text-soft)]"
            }`}
          >
            {urlStatusLabel}
          </span>
        </div>
        <div
          className="mb-4 overflow-hidden text-ellipsis whitespace-nowrap bg-[var(--surface_container_low)] p-4 font-mono text-sm text-[var(--text)]"
          title={displayedUrl}
        >
          {displayedUrl}
        </div>
        {shareStats ? (
          <div className="mb-4 space-y-1 text-xs text-[var(--text-muted)]">
            <div>Snapshot token length: {shareStats.tokenLength} characters</div>
            <div>
              Current URL length: {shareStats.urlLength} vs {shareStats.fullUrlLength} for the `data` URL
            </div>
            <div className="font-medium text-[var(--text)]">
              Saved {shareStats.savings} characters ({shareStats.savingsPercent}% shorter than `data`)
            </div>
          </div>
        ) : null}
        {copyError ? (
          <div className="mb-3 rounded-lg bg-red-500/10 p-3 text-xs text-red-700" aria-live="polite">
            {copyError}
          </div>
        ) : null}
        {shareError ? (
          <div className="mb-3 rounded-lg bg-red-500/10 p-3 text-xs text-red-700" aria-live="polite">
            {shareError}
          </div>
        ) : null}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCopy}
            disabled={!canShare}
            className="button-primary flex-1 py-2 text-xs font-bold uppercase tracking-[0.22em]"
          >
            {copyLabel}
          </button>
          <button
            type="button"
            onClick={onShare}
            disabled={!canShare}
            className="ghost-button px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]"
          >
            {settingsPanelCopy.shareButton}
          </button>
        </div>
      </section>
    </div>
  );
}
