import type { ReactNode } from "react";

import type {
  AnimationPresetId,
  AppearancePresetId,
  CornerStyle,
} from "../../../lib/appearance.ts";
import { MAX_PLATFORM_TEXT_LENGTH } from "../../../lib/settingsLimits.ts";
import type { SettingsPlatformState } from "../../../hooks/useSettingsForm";

export interface SettingsPanelProps extends Readonly<{
  title: string;
  icon: string;
  children: ReactNode;
}> {}

export interface PlatformRowProps extends Readonly<{
  platform: SettingsPlatformState;
  label: string;
  inputId: string;
  onToggle: (id: string, enabled: boolean) => void;
  onChange: (id: string, text: string) => void;
}> {}

export interface TimingControlProps extends Readonly<{
  id: string;
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}> {}

export interface AppearancePresetCardProps extends Readonly<{
  id: AppearancePresetId;
  label: string;
  description: string;
  selected: boolean;
  onSelect: (id: AppearancePresetId) => void;
}> {}

export interface MotionPresetCardProps extends Readonly<{
  id: AnimationPresetId;
  label: string;
  description: string;
  selected: boolean;
  onSelect: (id: AnimationPresetId) => void;
}> {}

export interface AppearanceSliderControlProps extends Readonly<{
  id: string;
  kicker: string;
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}> {}

export interface CornerStyleControlProps extends Readonly<{
  value: CornerStyle;
  onChange: (value: CornerStyle) => void;
  sharpLabel: string;
  softLabel: string;
}> {}

export interface AppearanceToggleControlProps extends Readonly<{
  kicker: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> {}

export function SettingsPanel({ title, icon, children }: SettingsPanelProps) {
  return (
    <section className="surface-card p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-[var(--text)]" aria-hidden="true">
          {icon}
        </span>
        <h2 className="font-display text-xl font-bold tracking-tight text-[var(--text)]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function PlatformRow({ platform, label, inputId, onToggle, onChange }: PlatformRowProps) {
  const enabled = platform.enabled;

  return (
    <div
      className={`group space-y-4 p-4 transition-all duration-200 ${
        enabled
          ? "bg-[var(--surface_container_lowest)] shadow-[0_20px_40px_rgba(26,28,28,0.04)]"
          : "bg-[var(--surface_container_low)]"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center transition-opacity"
          style={{
            backgroundColor: platform.brandColor,
            opacity: enabled ? 1 : 0.45,
          }}
        >
          <span
            aria-hidden="true"
            className={`${platform.faIconClass} text-lg text-white`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={inputId}
              className={`block text-base font-semibold tracking-[-0.02em] ${
                enabled ? "text-[var(--text)]" : "text-[var(--text-muted)]"
              }`}
            >
              {label}
            </label>
            <span
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                enabled
                  ? "bg-[var(--text)] text-white"
                  : "bg-[var(--surface_container_high)] text-[var(--text-soft)]"
              }`}
            >
              {enabled ? "Live" : "Draft"}
            </span>
          </div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
            {platform.label}
          </div>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={platform.enabled}
            onChange={(event) => onToggle(platform.id, event.currentTarget.checked)}
            className="peer sr-only"
            aria-label={`${enabled ? "Disable" : "Enable"} ${label}`}
          />
          <span className="relative h-11 w-24 bg-[var(--surface_container)] transition-colors duration-200 peer-checked:bg-[var(--text)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--primary)]">
            <span className="absolute inset-y-[3px] left-[3px] flex w-[calc(50%-3px)] items-center justify-center bg-[var(--surface_container_lowest)] text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text)] transition-transform duration-200 peer-checked:translate-x-full peer-checked:bg-[var(--surface)]">
              {enabled ? "Live" : "Off"}
            </span>
          </span>
        </label>
      </div>

      <input
        id={inputId}
        type="text"
        value={platform.text}
        maxLength={MAX_PLATFORM_TEXT_LENGTH}
        placeholder={platform.placeholder}
        onChange={(event) => onChange(platform.id, event.currentTarget.value)}
        aria-disabled={!enabled}
        className={`w-full border px-4 py-3 text-lg font-medium tracking-[-0.02em] outline-none transition-colors placeholder:text-[var(--text-soft)] focus:border-[var(--text-soft)] ${
          enabled
            ? "border-black/8 bg-[var(--surface)] text-[var(--text)]"
            : "border-transparent bg-[var(--surface_container)] text-[var(--text-soft)]"
        }`}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-soft)]">
        <span>{enabled ? "Visible in the live rotation queue" : "Saved here until you enable it"}</span>
        <span className="uppercase tracking-[0.18em]">
          {enabled ? "Included" : "Excluded"}
        </span>
      </div>
    </div>
  );
}

export function TimingControl({ id, label, valueLabel, value, min, max, step, onChange }: TimingControlProps) {
  return (
    <div className="space-y-4 bg-[var(--surface_container_low)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
            Timing Control
          </label>
          <div className="text-base font-semibold tracking-[-0.02em] text-[var(--text)]">
            {label}
          </div>
        </div>
        <span className="bg-[var(--surface_container_lowest)] px-3 py-2 font-mono text-sm font-bold text-[var(--text)] shadow-[0_10px_24px_rgba(26,28,28,0.035)]">
          {valueLabel}
        </span>
      </div>
      <div className="space-y-3 bg-[var(--surface_container_lowest)] px-4 py-4 shadow-[0_20px_40px_rgba(26,28,28,0.04)]">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
          className="settings-range w-full cursor-pointer appearance-none bg-transparent"
        />
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-soft)]">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}

export function AppearancePresetCard({
  id,
  label,
  description,
  selected,
  onSelect,
}: AppearancePresetCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`space-y-3 p-4 text-left transition-colors ${
        selected
          ? "bg-[var(--text)] text-white shadow-[0_20px_40px_rgba(26,28,28,0.08)]"
          : "bg-[var(--surface_container_low)] text-[var(--text)] hover:bg-[var(--surface_container)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`text-[10px] font-bold uppercase tracking-[0.24em] ${selected ? "text-white/70" : "text-[var(--text-soft)]"}`}>
          Preset Theme
        </span>
        <span
          className={`px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
            selected ? "bg-white text-[var(--text)]" : "bg-[var(--surface_container_lowest)] text-[var(--text-soft)]"
          }`}
        >
          {selected ? "Active" : "Apply"}
        </span>
      </div>
      <div className="text-lg font-semibold tracking-[-0.02em]">{label}</div>
      <p className={`text-sm leading-6 ${selected ? "text-white/80" : "text-[var(--text-muted)]"}`}>
        {description}
      </p>
    </button>
  );
}

export function MotionPresetCard({
  id,
  label,
  description,
  selected,
  onSelect,
}: MotionPresetCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`space-y-3 p-4 text-left transition-colors ${
        selected
          ? "bg-[var(--text)] text-white shadow-[0_20px_40px_rgba(26,28,28,0.08)]"
          : "bg-[var(--surface_container_low)] text-[var(--text)] hover:bg-[var(--surface_container)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.24em] ${
            selected ? "text-white/70" : "text-[var(--text-soft)]"
          }`}
        >
          Motion Preset
        </span>
        <span
          className={`px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
            selected
              ? "bg-white text-[var(--text)]"
              : "bg-[var(--surface_container_lowest)] text-[var(--text-soft)]"
          }`}
        >
          {selected ? "Active" : "Apply"}
        </span>
      </div>
      <div className="text-lg font-semibold tracking-[-0.02em]">{label}</div>
      <p className={`text-sm leading-6 ${selected ? "text-white/80" : "text-[var(--text-muted)]"}`}>
        {description}
      </p>
    </button>
  );
}

export function AppearanceSliderControl({
  id,
  kicker,
  label,
  valueLabel,
  value,
  min,
  max,
  step,
  onChange,
}: AppearanceSliderControlProps) {
  return (
    <div className="space-y-4 bg-[var(--surface_container_low)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
            {kicker}
          </label>
          <div className="text-base font-semibold tracking-[-0.02em] text-[var(--text)]">{label}</div>
        </div>
        <span className="bg-[var(--surface_container_lowest)] px-3 py-2 font-mono text-sm font-bold text-[var(--text)] shadow-[0_10px_24px_rgba(26,28,28,0.035)]">
          {valueLabel}
        </span>
      </div>
      <div className="space-y-3 bg-[var(--surface_container_lowest)] px-4 py-4 shadow-[0_20px_40px_rgba(26,28,28,0.04)]">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
          className="settings-range w-full cursor-pointer appearance-none bg-transparent"
        />
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-soft)]">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}

export function CornerStyleControl({
  value,
  onChange,
  sharpLabel,
  softLabel,
}: CornerStyleControlProps) {
  return (
    <div className="space-y-4 bg-[var(--surface_container_low)] p-4">
      <div className="space-y-1">
        <div className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Layout Finish
        </div>
        <div className="text-base font-semibold tracking-[-0.02em] text-[var(--text)]">
          Corner Style
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 bg-[var(--surface_container_lowest)] p-3 shadow-[0_20px_40px_rgba(26,28,28,0.04)]">
        <button
          type="button"
          onClick={() => onChange("sharp")}
          className={`px-3 py-4 text-sm font-semibold tracking-[-0.02em] ${
            value === "sharp"
              ? "bg-[var(--text)] text-white"
              : "bg-[var(--surface_container_low)] text-[var(--text)]"
          }`}
        >
          {sharpLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange("soft")}
          className={`px-3 py-4 text-sm font-semibold tracking-[-0.02em] ${
            value === "soft"
              ? "bg-[var(--text)] text-white"
              : "bg-[var(--surface_container_low)] text-[var(--text)]"
          }`}
        >
          {softLabel}
        </button>
      </div>
    </div>
  );
}

export function AppearanceToggleControl({
  kicker,
  label,
  description,
  checked,
  onChange,
}: AppearanceToggleControlProps) {
  return (
    <div className="flex items-center justify-between gap-4 bg-[var(--surface_container_low)] p-4">
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-soft)]">
          {kicker}
        </div>
        <div className="mt-1 text-base font-semibold tracking-[-0.02em] text-[var(--text)]">
          {label}
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      </div>
      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.currentTarget.checked)}
          className="peer sr-only"
          aria-label={label}
        />
        <span className="relative h-11 w-24 bg-[var(--surface_container)] transition-colors duration-200 peer-checked:bg-[var(--text)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--primary)]">
          <span className="absolute inset-y-[3px] left-[3px] flex w-[calc(50%-3px)] items-center justify-center bg-[var(--surface_container_lowest)] text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text)] transition-transform duration-200 peer-checked:translate-x-full peer-checked:bg-[var(--surface)]">
            {checked ? "On" : "Off"}
          </span>
        </span>
      </label>
    </div>
  );
}
