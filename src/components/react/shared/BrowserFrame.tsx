import type { ReactNode } from "react";

export interface BrowserFrameProps extends Readonly<{
  label: string;
  children: ReactNode;
}> {}

export function BrowserFrame({ label, children }: BrowserFrameProps) {
  return (
    <div className="preview-shell overflow-hidden">
      <div className="window-chrome">
        <span className="window-dot" />
        <span className="window-dot" />
        <span className="window-dot" />
        <span className="window-label">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
