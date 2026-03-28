import { sitePath } from "../lib/site.ts";

export interface ReadonlyLink extends Readonly<{
  label: string;
  href: string;
  active?: boolean;
}> {}

export interface ReadonlyLandingFeedCard extends Readonly<{
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  meta: string;
  status: string;
  icon: string;
}> {}

export interface ReadonlyLandingFeatureCard extends Readonly<{
  title: string;
  description: string;
  icon: string;
}> {}

export interface ReadonlyLandingDemoCard extends Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  meta: string;
  accent: string;
}> {}

export interface ReadonlySettingsRow extends Readonly<{
  id: string;
  label: string;
  placeholder: string;
  icon: string;
}> {}

export interface ReadonlyPlatform extends Readonly<{
  id: string;
  label: string;
  defaultEnabled: boolean;
  defaultValue: string;
  defaultText: string;
  placeholder: string;
  faIconClass: string;
  brandColor: string;
  iconPath: string;
  overlay: Readonly<{
    cardClass: string;
    ctaText: string;
    ctaClass: string;
    ctaIconPath: string;
  }>;
}> {}

export const landingNavLinks: readonly ReadonlyLink[] = [
  { label: "Home", href: "", active: true },
  { label: "Settings", href: "/settings/" },
  { label: "Overlay", href: "/overlay/" },
];

export const landingHero = {
  eyebrow: "Built For OBS Browser Sources",
  titleLead: "Social Media",
  titleHighlight: "Rotator",
  subtitle: "A shareable browser overlay for rotating your social links on stream",
  body:
    "Configure your handles, tune motion and timing, then copy one overlay URL into OBS. No account, no backend, and no dashboard bloat.",
  primaryCta: "Configure Overlay",
  secondaryCta: "Open Live Overlay",
  metrics: [
    { value: "7", label: "Platforms Ready" },
    { value: "1 URL", label: "OBS Browser Source" },
    { value: "0 Account", label: "Setup Friction" },
  ],
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC4MCqPfjnkbHD6Y8zyap_b14q9LutJu_4GrXamRQUEHk_KBD3_86kAY1LvRTJtj7sIiVEJ-BSJzrnfvXXYA3rPZXu1eexZJRkC_7Vt06wSBWKJsD4gMywkUQb8bEzRWWSplONfhRrbBOFZIUbAK958g4SWRjBr78cwhireJK1x43n61Q3bfl8pu1lqSxsSkKtif5Q8uJIeiizZllOJWMIUWiMbCMexkbxJn03ANwqGsx67Ky8p5p7JijxwtamvLDe07N8yWXQa9vc",
  imageAlt:
    "Minimalist workspace with a clean white desk, a single tablet showing abstract art, and soft morning shadows",
  badgeTitle: "Live Overlay Toolkit",
  badgeSubtitle: "Motion, Timing, Token, Preview",
};

export const landingFeatureCards: readonly ReadonlyLandingFeatureCard[] = [
  {
    title: "OBS-Ready URL",
    description:
      "Copy one browser-source URL into OBS and the overlay is ready to run on stream.",
    icon: "tv",
  },
  {
    title: "Rotating Social Queue",
    description:
      "Cycle through TikTok, Discord, YouTube, Twitch, Facebook, Instagram, and X with adjustable timing.",
    icon: "sync",
  },
  {
    title: "Live Visual Preview",
    description:
      "Adjust layout, motion presets, sizing, CTA, and spacing while watching the overlay update live.",
    icon: "visibility",
  },
  {
    title: "Shareable Config",
    description:
      "Export by URL or token, reload local drafts, and move your setup without rebuilding it from scratch.",
    icon: "link",
  },
];

export const landingDemoCards: readonly ReadonlyLandingDemoCard[] = [
  {
    eyebrow: "Social Input Flow",
    title: "Enable a platform, then drop in the handle you actually want on stream.",
    description:
      "The settings page is built for speed: switch a network on, paste the channel or invite link, and the rotator queue updates without forcing a save step.",
    imageUrl: sitePath("assets/demos/social-platform-flow.gif"),
    imageAlt:
      "Animated demo of enabling a social platform and entering the social handle inside the settings page.",
    meta: "Draft to active in one pass",
    accent: "Social Platforms",
  },
  {
    eyebrow: "Style And Export Flow",
    title: "Tune the card feel, adjust the scale, then copy the final OBS-ready URL.",
    description:
      "Visual controls stay connected to the live preview, so shape, scale, and export all happen in one continuous workflow instead of a separate design step.",
    imageUrl: sitePath("assets/demos/overlay-style-flow.gif"),
    imageAlt:
      "Animated demo of changing the corner style, adjusting overall scale, and copying the generated overlay URL.",
    meta: "Preview, refine, copy, ship",
    accent: "Overlay Style",
  },
];

export const landingHowItWorks = {
  eyebrow: "How It Works",
  title: "From settings panel to live stream in three steps",
  steps: [
    {
      number: "1",
      title: "Set Your Platforms",
      description:
        "Add the handles, pages, or invite links you want to rotate and decide which platforms stay active.",
    },
    {
      number: "2",
      title: "Tune The Overlay",
      description:
        "Adjust timing, motion preset, card sizing, icon treatment, CTA behavior, and preview everything live.",
    },
    {
      number: "3",
      title: "Drop It Into OBS",
      description:
        "Generate the overlay URL, paste it into an OBS browser source, and your social rotation is live.",
    },
  ],
};

export const landingCta = {
  title: "Ready To Put Your Links On Stream?",
  subtitle:
    "Open the settings page, build your rotator, and ship it to OBS in a few minutes.",
  primaryCta: "Open Settings",
  secondaryCta: "Preview Overlay",
};

export const landingFooterLinks: readonly ReadonlyLink[] = [
  { label: "GitHub", href: "https://github.com/antiantidev/social-media-rotator" },
  { label: "TikTok", href: "https://www.tiktok.com/@nguyennhatlinh.official" },
  { label: "YouTube", href: "https://www.youtube.com/@dayum.studio" },
  { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/chokernguyen" },
  { label: "PayPal", href: "https://paypal.me/chokernguyen" },
  { label: "Ko-fi", href: "https://ko-fi.com/chokernguyen" },
  { label: "Zypage", href: "https://zypage.com/chokernguyen" },
];

export const settingsNavLinks: readonly ReadonlyLink[] = [
  { label: "Home", href: "/" },
  { label: "Settings", href: "/settings/", active: true },
  { label: "Overlay", href: "/overlay/" },
];

export const settingsPrimaryPlatformIds = [
  "tiktok",
  "discord",
  "youtube",
  "twitch",
  "facebook",
  "instagram",
  "x",
] as const;

export const settingsPrimaryPlatformLabels: Readonly<Record<string, string>> = {
  x: "X (Twitter)",
  instagram: "Instagram Handle",
  tiktok: "TikTok Handle",
  discord: "Discord Server",
  youtube: "YouTube Channel",
  twitch: "Twitch Channel",
  facebook: "Facebook Page",
};

export const settingsHero = {
  title: "Social Media Rotator Settings",
  subtitle:
    "Shareable Overlay • No Account • No Storage",
  banner: "Hoang Sa & Truong Sa belong to Vietnam",
  supportCopy: "Helping your stream? You can support me here",
  homeCta: "Overlay",
  overlayCta: "Overlay",
};

export const settingsPanelCopy = {
  socialPlatformsTitle: "Social Platforms",
  animationTimingTitle: "Animation Timing",
  overlayStyleTitle: "Overlay Style",
  overlayStyleDescription: "Pick a visual preset, choose a motion language, then fine-tune the live card.",
  resetStyleButton: "Reset Style",
  presetSectionLabel: "Preset Themes",
  motionSectionLabel: "Motion Presets",
  advancedSectionLabel: "Advanced Controls",
  contentSectionLabel: "Content & CTA",
  cardWidth: "Card Width",
  overallScale: "Overall Scale",
  innerPadding: "Inner Padding",
  safeMargin: "Safe Margin",
  labelSize: "Label Size",
  textSize: "Text Size",
  iconSize: "Icon Size",
  ctaSize: "CTA Size",
  cornerStyle: "Corner Style",
  sharpCorners: "Sharp",
  softCorners: "Soft",
  showIcon: "Show Icon",
  showLabel: "Show Label",
  showCta: "Show CTA",
  customCtaText: "Custom CTA Text",
  customCtaPlaceholder: "Leave blank to use platform CTA",
  displayDuration: "Display Duration (seconds)",
  transitionSpeed: "Animation In (ms)",
  transitionOut: "Animation Out (ms)",
  shareLinkTitle: "Generate overlay URL",
  shareLinkDescription: "Generate overlay URL",
  generateButton: "Generate overlay URL",
  tokenImportTitle: "Load from Token",
  tokenImportPlaceholder: "Paste token...",
  importButton: "Load Settings",
  previewModeLabel: "LIVE OVERLAY",
  streamSourceTitle: "Overlay Preview",
  copyButton: "Copy URL",
  shareButton: "Share",
  nextSlotLabel: "Settings encoded in URL (Base64)",
  liveOutputLabel: "LIVE",
  tokenLabel: "Token (Base64)",
  helpTitle: "How it works",
  helpBullet1: "Settings encoded in URL (Base64)",
  helpBullet2: "No storage needed, share anywhere",
  helpBullet3: "Token is URL-safe and reversible",
} as const;

export const settingsFooterLinks: readonly ReadonlyLink[] = [
  { label: "GitHub", href: "https://github.com/antiantidev/social-media-rotator" },
  { label: "Tiktok", href: "https://www.tiktok.com/@nguyennhatlinh.official" },
  { label: "Youtube", href: "https://www.youtube.com/@dayum.studio" },
  { label: "Website", href: sitePath("") },
];

export const settingsPlatformData: readonly ReadonlyPlatform[] = [
  {
    id: "tiktok",
    label: "TikTok",
    defaultEnabled: true,
    defaultText: "@rotatordigital",
    defaultValue: "@rotatordigital",
    placeholder: "@username",
    faIconClass: "fa-brands fa-tiktok",
    brandColor: "#010101",
    iconPath: sitePath("assets/icons8-tiktok-480.png"),
    overlay: {
      cardClass: "overlay-card--tiktok",
      ctaText: "Follow",
      ctaClass: "overlay-cta overlay-cta--tiktok",
      ctaIconPath: sitePath("assets/icons8-heart-90-black.png"),
    },
  },
  {
    id: "instagram",
    label: "Instagram",
    defaultEnabled: false,
    defaultText: "rotator_studio",
    defaultValue: "rotator_studio",
    placeholder: "@username",
    faIconClass: "fa-brands fa-instagram",
    brandColor: "#e4405f",
    iconPath: sitePath("assets/icons8-instagram-480.png"),
    overlay: {
      cardClass: "overlay-card--instagram",
      ctaText: "Follow",
      ctaClass: "overlay-cta overlay-cta--instagram",
      ctaIconPath: sitePath("assets/icons8-heart-90-black.png"),
    },
  },
  {
    id: "discord",
    label: "Discord",
    defaultEnabled: true,
    defaultText: "discord.gg/xunAChFVkc",
    defaultValue: "discord.gg/xunAChFVkc",
    placeholder: "discord.gg/invite",
    faIconClass: "fa-brands fa-discord",
    brandColor: "#5865f2",
    iconPath: sitePath("assets/icons8-discord-480.png"),
    overlay: {
      cardClass: "overlay-card--discord",
      ctaText: "Join",
      ctaClass: "overlay-cta overlay-cta--discord",
      ctaIconPath: sitePath("assets/icons8-heart-90-black.png"),
    },
  },
  {
    id: "youtube",
    label: "YouTube",
    defaultEnabled: true,
    defaultText: "@chokernguyen",
    defaultValue: "@chokernguyen",
    placeholder: "@channel",
    faIconClass: "fa-brands fa-youtube",
    brandColor: "#ff0000",
    iconPath: sitePath("assets/icons8-youtube-480.png"),
    overlay: {
      cardClass: "overlay-card--youtube",
      ctaText: "Subscribe",
      ctaClass: "overlay-cta overlay-cta--youtube",
      ctaIconPath: sitePath("assets/icons8-heart-90-black.png"),
    },
  },
  {
    id: "twitch",
    label: "Twitch",
    defaultEnabled: false,
    defaultText: "@username",
    defaultValue: "",
    placeholder: "@username",
    faIconClass: "fa-brands fa-twitch",
    brandColor: "#9146ff",
    iconPath: sitePath("assets/icons8-twitch-480.png"),
    overlay: {
      cardClass: "overlay-card--twitch",
      ctaText: "Follow",
      ctaClass: "overlay-cta overlay-cta--twitch",
      ctaIconPath: sitePath("assets/icons8-heart-90-black.png"),
    },
  },
  {
    id: "facebook",
    label: "Facebook",
    defaultEnabled: false,
    defaultText: "facebook.com/page",
    defaultValue: "",
    placeholder: "facebook.com/page",
    faIconClass: "fa-brands fa-facebook-f",
    brandColor: "#1877f2",
    iconPath: sitePath("assets/icons8-facebook-480.png"),
    overlay: {
      cardClass: "overlay-card--facebook",
      ctaText: "Follow",
      ctaClass: "overlay-cta overlay-cta--facebook",
      ctaIconPath: sitePath("assets/icons8-heart-90-black.png"),
    },
  },
  {
    id: "x",
    label: "Twitter",
    defaultEnabled: false,
    defaultText: "@rotatordigital",
    defaultValue: "@rotatordigital",
    placeholder: "@username",
    faIconClass: "fa-brands fa-x-twitter",
    brandColor: "#000000",
    iconPath: sitePath("assets/icons8-x-480.png"),
    overlay: {
      cardClass: "overlay-card--x",
      ctaText: "Follow",
      ctaClass: "overlay-cta overlay-cta--x",
      ctaIconPath: sitePath("assets/icons8-heart-90-black.png"),
    },
  },
];
