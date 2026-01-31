/* ================= TOKEN ENCODER/DECODER ================= */
class TokenEncoder {
  // Decode Base64 token back to settings
  static decode(token) {
    try {
      // Restore Base64 padding and characters
      let base64 = token.replace(/-/g, "+").replace(/_/g, "/");

      // Add padding
      while (base64.length % 4) {
        base64 += "=";
      }

      const jsonString = atob(base64);
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Token decode error:", e);
      return null;
    }
  }
}

/* ================= URL PARAMETER PARSER ================= */
function parseURLParams() {
  const params = new URLSearchParams(window.location.search);

  const config = {
    rotationData: null,
    timing: null,
  };

  // Check for token first (JWT-like)
  const token = params.get("t");
  if (token) {
    const settings = TokenEncoder.decode(token);

    if (settings) {
      config.rotationData = settings.platforms;
      config.timing = {
        hold: settings.holdTime,
        in: settings.animInTime,
        out: settings.animOutTime,
      };
      return config;
    } else {
      console.error("Invalid token");
    }
  }

  // Fallback: Parse platform data from full URL params
  const dataParam = params.get("data");
  if (dataParam) {
    try {
      config.rotationData = JSON.parse(dataParam);
    } catch (e) {
      console.error("Failed to parse data param:", e);
    }
  }

  // Parse timing
  const hold = params.get("hold");
  const animIn = params.get("animIn");
  const animOut = params.get("animOut");

  if (hold || animIn || animOut) {
    config.timing = {
      hold: hold ? parseInt(hold) : null,
      in: animIn ? parseInt(animIn) : null,
      out: animOut ? parseInt(animOut) : null,
    };
  }

  return config;
}

/* ================= PLATFORM DEFINITIONS ================= */
const PLATFORMS = {
  tiktok: {
    name: "TikTok",
    icon: "/social-media-rotator-site/assets/icons8-tiktok-480.png",
    bg: "border bg-black/40 border-white/20 text-white backdrop-blur-md",
    cta: {
      text: "Follow",
      bg: "border bg-black/40 border-white/20 text-white backdrop-blur-md",
      icon: "/social-media-rotator-site/assets/icons8-heart-90-white.png",
    },
  },
  discord: {
    name: "Discord",
    icon: "/social-media-rotator-site/assets/icons8-discord-480.png",
    bg: "bg-white text-black",
    cta: {
      text: "Join",
      bg: "bg-[#5865F2] text-white",
      icon: "/social-media-rotator-site/assets/icons8-heart-90-white.png",
    },
  },
  youtube: {
    name: "YouTube",
    icon: "/social-media-rotator-site/assets/icons8-youtube-480.png",
    bg: "bg-white text-black",
    cta: {
      text: "Subscribe",
      bg: "bg-red-600 text-white",
      icon: "/social-media-rotator-site/assets/icons8-heart-90-white.png",
    },
  },
  twitch: {
    name: "Twitch",
    icon: "/social-media-rotator-site/assets/icons8-twitch-480.png",
    bg: "bg-white text-black",
    cta: {
      text: "Follow",
      bg: "bg-[#9146FF] text-white",
      icon: "/social-media-rotator-site/assets/icons8-heart-90-white.png",
    },
  },
  facebook: {
    name: "Facebook",
    icon: "/social-media-rotator-site/assets/icons8-facebook-480.png",
    bg: "bg-white text-black",
    cta: {
      text: "Follow",
      bg: "bg-[#1877F2] text-white",
      icon: "/social-media-rotator-site/assets/icons8-heart-90-white.png",
    },
  },
  instagram: {
    name: "Instagram",
    icon: "/social-media-rotator-site/assets/icons8-instagram-480.png",
    bg: "bg-white text-black",
    cta: {
      text: "Follow",
      bg: "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
      icon: "/social-media-rotator-site/assets/icons8-heart-90-white.png",
    },
  },
  x: {
    name: "X",
    icon: "/social-media-rotator-site/assets/icons8-x-480.png",
    bg: "bg-white text-black",
    cta: {
      text: "Follow",
      bg: "bg-black text-white",
      icon: "/social-media-rotator-site/assets/icons8-heart-90-white.png",
    },
  },
};

/* ================= DEFAULT ROTATION DATA ================= */
const DEFAULT_ROTATION_DATA = [
  { platform: "tiktok", text: "@nguyennhatlinh.official" },
  { platform: "discord", text: "discord.gg/xunAChFVkc" },
  { platform: "youtube", text: "@chokernguyen" },
];

/* ================= CONFIG ================= */
const DEFAULT_CONFIG = {
  BASE_CLASS:
    "flex items-center gap-2 p-1 px-2 rounded-md shadow-lg animate__animated",
  ANIMATION: {
    in: "animate__bounceIn",
    out: "animate__bounceOut",
  },
  TIMING: {
    in: 1000,
    out: 1000,
    hold: 9000,
  },
};

/* ================= OVERLAY CONTROLLER ================= */
class OverlayController {
  constructor(rotationData, config) {
    this.rotationData = rotationData;
    this.config = config;
    this.currentIndex = 0;
    this.elements = this.cacheElements();
    this.init();
  }

  cacheElements() {
    return {
      card: document.getElementById("card"),
      icon: document.getElementById("icon"),
      text: document.getElementById("text"),
      cta: document.getElementById("cta"),
      ctaBox: document.getElementById("ctaBox"),
      ctaIcon: document.getElementById("ctaIcon"),
    };
  }

  updateContent(item) {
    const platform = PLATFORMS[item.platform];
    if (!platform) return;

    const { icon, text, cta, ctaBox, ctaIcon } = this.elements;

    // Update content
    icon.src = platform.icon;
    text.textContent = item.text;
    cta.textContent = platform.cta.text;
    ctaIcon.src = platform.cta.icon;

    // Update styles
    ctaBox.className = `flex gap-2 items-center justify-center ml-auto px-3 py-1.5 rounded-md text-sm font-medium ${platform.cta.bg}`;
  }

  updateBackground(platform) {
    this.elements.card.className = `${this.config.BASE_CLASS} ${platform.bg}`;
  }

  animate(item) {
    const platform = PLATFORMS[item.platform];
    if (!platform) return;

    const { card } = this.elements;
    const { in: animIn, out: animOut } = this.config.ANIMATION;

    // Start exit animation
    card.classList.remove(animIn);
    card.classList.add(animOut);

    // After exit, update content and animate in
    setTimeout(() => {
      this.updateContent(item);
      this.updateBackground(platform);

      // Start enter animation
      card.classList.remove(animOut);
      card.classList.add(animIn);
    }, this.config.TIMING.out);
  }

  init() {
    const firstItem = this.rotationData[0];
    const platform = PLATFORMS[firstItem.platform];

    if (!platform) return;

    this.updateContent(firstItem);
    this.updateBackground(platform);
    this.elements.card.classList.add(this.config.ANIMATION.in);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.rotationData.length;
    this.animate(this.rotationData[this.currentIndex]);
  }

  start() {
    const interval =
      this.config.TIMING.hold + this.config.TIMING.in + this.config.TIMING.out;
    setInterval(() => this.next(), interval);
  }
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  // Parse URL parameters (supports both token and full params)
  const urlConfig = parseURLParams();

  // Use URL data if available, otherwise use defaults
  const rotationData = urlConfig.rotationData || DEFAULT_ROTATION_DATA;

  // Merge timing config
  const config = { ...DEFAULT_CONFIG };
  if (urlConfig.timing) {
    if (urlConfig.timing.hold !== null)
      config.TIMING.hold = urlConfig.timing.hold;
    if (urlConfig.timing.in !== null) config.TIMING.in = urlConfig.timing.in;
    if (urlConfig.timing.out !== null) config.TIMING.out = urlConfig.timing.out;
  }

  // Initialize overlay
  const overlay = new OverlayController(rotationData, config);
  overlay.start();
});
