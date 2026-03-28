import { landingFooterLinks } from "../../../data/mockData";
import { sitePath } from "../../../lib/site.ts";
import { MonochromeHeader } from "../shared/MonochromeHeader";
import { MonochromeFooter } from "../shared/MonochromeFooter";
import { LandingCtaSection } from "./LandingCtaSection";
import { LandingDemoSection } from "./LandingDemoSection";
import { LandingFeaturesSection } from "./LandingFeaturesSection";
import { LandingHeroSection } from "./LandingHeroSection";
import { LandingHowItWorksSection } from "./LandingHowItWorksSection";

export interface LandingScreenProps extends Readonly<Record<string, never>> {}

export function LandingScreen(_: LandingScreenProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MonochromeHeader
        brand="Social Media Rotator"
        navLinks={[
          { label: "Home", href: sitePath(""), active: true },
          { label: "Settings", href: sitePath("settings/") },
          { label: "Overlay", href: sitePath("overlay/") },
        ]}
        actions={
          <a href={sitePath("settings/")} className="button-primary px-6 py-2.5 text-sm font-medium">
            Get Started
          </a>
        }
      />

      <main className="flex-1 pt-20">
        <LandingHeroSection />
        <LandingFeaturesSection />
        <LandingDemoSection />
        <LandingHowItWorksSection />
        <LandingCtaSection />
      </main>

      <MonochromeFooter
        brand="Social Media Rotator"
        tagline="For Streamers • Built with ❤️ in Viet Nam"
        subline="For streamers, by a streamer."
        links={landingFooterLinks}
        copyright="© 2026 Social Media Rotator"
        variant="landing"
      />
    </div>
  );
}
