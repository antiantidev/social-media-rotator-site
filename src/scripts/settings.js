/* ================= TOKEN ENCODER/DECODER ================= */
class TokenEncoder {
  // Encode settings to Base64 token (JWT-like)
  static encode(settings) {
    try {
      const jsonString = JSON.stringify(settings);
      // Convert to Base64 URL-safe
      const base64 = btoa(jsonString)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      return base64;
    } catch (e) {
      console.error("Token encode error:", e);
      return null;
    }
  }

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

  // Validate token format
  static isValid(token) {
    if (!token || typeof token !== "string") return false;
    try {
      const decoded = this.decode(token);
      return (
        decoded !== null &&
        decoded.platforms &&
        Array.isArray(decoded.platforms)
      );
    } catch {
      return false;
    }
  }

  // Compress token (optional - for even shorter URLs)
  static compress(settings) {
    try {
      // Create a more compact representation
      const compact = {
        p: settings.platforms.map(({ platform, text }) => ({
          t: platform.substring(0, 2), // Short platform code
          v: text,
        })),
        h: settings.holdTime,
        i: settings.animInTime,
        o: settings.animOutTime,
      };
      return this.encode(compact);
    } catch (e) {
      console.error("Token compress error:", e);
      return null;
    }
  }

  // Decompress token
  static decompress(token) {
    try {
      const compact = this.decode(token);
      if (!compact || !compact.p) return null;

      // Map short codes back to full platform names
      const platformMap = {
        ti: "tiktok",
        di: "discord",
        yo: "youtube",
        tw: "twitch",
        fa: "facebook",
        in: "instagram",
        x: "x",
      };

      return {
        platforms: compact.p.map(({ t, v }) => ({
          platform: platformMap[t] || t,
          text: v,
        })),
        holdTime: compact.h,
        animInTime: compact.i,
        animOutTime: compact.o,
      };
    } catch (e) {
      console.error("Token decompress error:", e);
      return null;
    }
  }
}

/* ================= SETTINGS CONTROLLER ================= */
class SettingsController {
  constructor() {
    this.elements = this.cacheElements();
    this.bindEvents();
    this.updatePreviewScale();
    this.loadFromURL();
    window.addEventListener("resize", () => this.updatePreviewScale());
  }

  cacheElements() {
    return {
      platformToggles: document.querySelectorAll(".platform-toggle"),
      platformInputs: document.querySelectorAll(".platform-input"),
      holdTime: document.getElementById("holdTime"),
      animInTime: document.getElementById("animInTime"),
      animOutTime: document.getElementById("animOutTime"),
      generateBtn: document.getElementById("generateBtn"),
      copyBtn: document.getElementById("copyBtn"),
      urlOutput: document.getElementById("urlOutput"),
      generatedUrl: document.getElementById("generatedUrl"),
      tokenDisplay: document.getElementById("tokenDisplay"),
      previewFrame: document.getElementById("previewFrame"),
      previewWrapper: document.getElementById("previewWrapper"),
      shareUrlBtn: document.getElementById("shareUrlBtn"),
      loadFromTokenBtn: document.getElementById("loadFromTokenBtn"),
      tokenInput: document.getElementById("tokenInput"),
    };
  }

  bindEvents() {
    this.elements.generateBtn.addEventListener("click", () =>
      this.generateURL(),
    );
    this.elements.copyBtn.addEventListener("click", () => this.copyURL());

    if (this.elements.shareUrlBtn) {
      this.elements.shareUrlBtn.addEventListener("click", () =>
        this.shareURL(),
      );
    }

    if (this.elements.loadFromTokenBtn) {
      this.elements.loadFromTokenBtn.addEventListener("click", () =>
        this.loadFromToken(),
      );
    }

    // Update preview when settings change
    this.elements.platformToggles.forEach((toggle) => {
      toggle.addEventListener("change", () => this.updatePreview());
    });

    this.elements.platformInputs.forEach((input) => {
      input.addEventListener("input", () => this.updatePreview());
    });

    [
      this.elements.holdTime,
      this.elements.animInTime,
      this.elements.animOutTime,
    ].forEach((input) => {
      input.addEventListener("input", () => this.updatePreview());
    });
  }

  getSettings() {
    const platforms = [];

    this.elements.platformToggles.forEach((toggle) => {
      if (toggle.checked) {
        const platform = toggle.dataset.platform;
        const input = document.querySelector(
          `.platform-input[data-platform="${platform}"]`,
        );
        const text = input.value.trim();

        if (text) {
          platforms.push({
            platform,
            text,
          });
        }
      }
    });

    return {
      platforms,
      holdTime: parseInt(this.elements.holdTime.value) * 1000,
      animInTime: parseInt(this.elements.animInTime.value),
      animOutTime: parseInt(this.elements.animOutTime.value),
    };
  }

  generateURL() {
    const settings = this.getSettings();

    if (settings.platforms.length === 0) {
      alert("Please select at least one platform!");
      return;
    }

    // Encode settings to token
    const token = TokenEncoder.encode(settings);

    if (!token) {
      alert("Failed to generate token!");
      return;
    }

    // Build URL with token - GitHub Pages with repo name
    // Gets the base path (e.g., /social-media-rotator/)
    const pathParts = window.location.pathname.split("/");
    const repoName = pathParts[1]; // Gets 'social-media-rotator'
    const baseUrl = `${window.location.origin}/${repoName}`;
    const tokenUrl = `${baseUrl}?t=${token}`;

    this.elements.generatedUrl.textContent = tokenUrl;
    this.elements.tokenDisplay.textContent = token;
    this.elements.urlOutput.classList.remove("hidden");

    // Show token length info
    this.showTokenInfo(token, tokenUrl);
  }

  showTokenInfo(token, url) {
    const infoEl = document.getElementById("tokenInfo");
    if (infoEl) {
      const fullUrlLength = this.getFullURLLength();
      const tokenUrlLength = url.length;
      const savings = fullUrlLength - tokenUrlLength;
      const savingsPercent = Math.round((savings / fullUrlLength) * 100);

      infoEl.innerHTML = `
        <div class="text-xs text-gray-400 mt-2 space-y-1">
          <div>Token length: ${token.length} characters</div>
          <div>URL length: ${tokenUrlLength} vs ${fullUrlLength} (Full URL)</div>
          <div class="text-green-400">✓ Saved ${savings} characters (${savingsPercent}% shorter)</div>
        </div>
      `;
    }
  }

  getFullURLLength() {
    const settings = this.getSettings();
    const pathParts = window.location.pathname.split("/");
    const repoName = pathParts[1];
    const baseUrl = `${window.location.origin}/${repoName}`;
    const params = new URLSearchParams();
    params.set("data", JSON.stringify(settings.platforms));
    params.set("hold", settings.holdTime);
    params.set("animIn", settings.animInTime);
    params.set("animOut", settings.animOutTime);
    return `${baseUrl}?${params.toString()}`.length;
  }

  copyURL() {
    const url = this.elements.generatedUrl.textContent;
    this.copyToClipboard(url, this.elements.copyBtn);
  }

  shareURL() {
    const url = this.elements.generatedUrl.textContent;

    if (navigator.share) {
      navigator
        .share({
          title: "OBS Overlay URL",
          text: "Check out this overlay configuration",
          url: url,
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      this.copyURL();
    }
  }

  copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent;
      button.textContent = "Copied! ✓";
      button.classList.add("bg-green-800");

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("bg-green-800");
      }, 2000);
    });
  }

  loadFromToken() {
    const token = this.elements.tokenInput.value.trim();

    if (!token) {
      alert("Please enter a token!");
      return;
    }

    if (!TokenEncoder.isValid(token)) {
      alert("Invalid token format!");
      return;
    }

    const settings = TokenEncoder.decode(token);
    if (!settings) {
      alert("Failed to decode token!");
      return;
    }

    this.applySettings(settings);
    alert("Settings loaded from token!");
  }

  applySettings(settings) {
    // Reset all toggles
    this.elements.platformToggles.forEach((toggle) => {
      toggle.checked = false;
    });

    // Apply platform settings
    settings.platforms.forEach(({ platform, text }) => {
      const toggle = document.querySelector(
        `.platform-toggle[data-platform="${platform}"]`,
      );
      const input = document.querySelector(
        `.platform-input[data-platform="${platform}"]`,
      );

      if (toggle && input) {
        toggle.checked = true;
        input.value = text;
      }
    });

    // Apply timing settings
    this.elements.holdTime.value = settings.holdTime / 1000;
    this.elements.animInTime.value = settings.animInTime;
    this.elements.animOutTime.value = settings.animOutTime;

    this.updatePreview();
  }

  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("t");

    if (token) {
      const settings = TokenEncoder.decode(token);
      if (settings) {
        this.applySettings(settings);
      }
    }
  }

  updatePreview() {
    const settings = this.getSettings();

    if (settings.platforms.length === 0) return;

    // Build preview URL with token - navigate from /repo/settings/ to /repo/
    const token = TokenEncoder.encode(settings);
    if (!token) return;

    // Go up one level from settings to repo root
    const baseUrl = "../";
    this.elements.previewFrame.src = `${baseUrl}?t=${token}`;
  }

  updatePreviewScale() {
    const wrapper = this.elements.previewWrapper;
    const frame = this.elements.previewFrame;

    const wrapperWidth = wrapper.clientWidth;
    const wrapperHeight = wrapper.clientHeight;

    const scaleX = wrapperWidth / 800;
    const scaleY = wrapperHeight / 600;
    const scale = Math.min(scaleX, scaleY);

    frame.style.transform = `scale(${scale})`;
  }
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  new SettingsController();
});
