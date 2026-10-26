import { ArrowUpRight } from 'lucide-react';
import { HomePagePartnership, defaultHomePageContent } from '../services/airtableService';

const CHAMP_URL = "https://www.cop28.com/en/cop28-uae-coalition-for-high-ambition-multilevel-partnerships-for-climate-action";
const PRIVACY_URL = "https://www.climatepolicyinitiative.org/privacy-notice/";
const TERMS_URL = "https://www.climatepolicyinitiative.org/terms-of-use/";

// Airtable sometimes holds a website address in a logo field; only use it if it points at an image.
export const logoOrDefault = (url: string | undefined, fallback: string) =>
  url && /\.(png|jpe?g|svg|webp|gif)(\?|$)/i.test(url) ? url : fallback;

interface FooterProps {
  partnership?: HomePagePartnership;
  onNavigate: (step: number | string) => void;
}

export default function Footer({ partnership = defaultHomePageContent.partnership, onNavigate }: FooterProps) {
  const defaults = defaultHomePageContent.partnership;
  const partners = [
    {
      name: partnership.partner1Name || "CCFLA",
      url: partnership.partner1Url || defaults.partner1Url,
      logo: logoOrDefault(partnership.partner1LogoUrl, defaults.partner1LogoUrl),
      className: "h-20",
    },
    {
      name: partnership.partner2Name || "Viable Cities",
      url: partnership.partner2Url || defaults.partner2Url,
      logo: logoOrDefault(partnership.partner2LogoUrl, defaults.partner2LogoUrl),
      className: "h-9",
    },
  ];

  const siteLinks: { label: string; step: number | string }[] = [
    { label: "Home", step: 0 },
    { label: "Actions", step: "actions" },
    { label: "Country Journeys", step: "journeys" },
  ];

  const linkClass = "body-text-sm text-ink hover:text-accent hover:underline underline-offset-2 cursor-pointer";

  return (
    <footer className="w-full bg-surface border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-10 md:gap-16">
          {/* Partner logos */}
          <div className="flex flex-wrap items-center gap-8 sm:gap-10">
            {partners.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" title={p.name} className="hover:opacity-80 flex items-center">
                <img src={p.logo} alt={p.name} className={`${p.className} w-auto object-contain`} referrerPolicy="no-referrer" />
              </a>
            ))}
          </div>

          {/* Site links */}
          <nav aria-label="Footer">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Links</h4>
            <ul className="space-y-2">
              {siteLinks.map((l) => (
                <li key={l.label}>
                  <button type="button" onClick={() => onNavigate(l.step)} className={linkClass}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* External resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Other resources</h4>
            <ul className="space-y-2">
              <li>
                <a href={CHAMP_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 ${linkClass}`}>
                  CHAMP website <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright and legal links */}
      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-5">
          <p className="max-w-6xl mx-auto body-text-sm text-ink-muted">
            © {new Date().getFullYear()} Climate Policy Initiative. All rights reserved.{' '}
            <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent underline underline-offset-2">Privacy Notice</a>
            {' '}and{' '}
            <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent underline underline-offset-2">Terms of Use</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
