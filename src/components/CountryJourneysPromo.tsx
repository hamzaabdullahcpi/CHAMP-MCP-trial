import { ArrowRight } from "lucide-react";

interface CountryJourneysPromoProps {
  imageUrl?: string;
  imageAlt?: string;
  onExplore: () => void;
}

// Full-bleed homepage band promoting the Country Journeys section.
export default function CountryJourneysPromo({ imageUrl, imageAlt = "", onExplore }: CountryJourneysPromoProps) {
  return (
    <section className="w-full bg-dark-green">
      <div className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto py-14 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-surface mb-8 md:mb-12">
              Case study
            </span>
            <h2 className="title-h2 text-surface mb-5">Country journeys</h2>
            <p className="body-text text-surface mb-10">
              The Toolkit supports CHAMP by enabling countries to deliver national climate commitments at the city
              level, where emissions and risks are concentrated.
            </p>
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center gap-3 px-7 py-4 bg-surface text-ink text-sm font-semibold uppercase tracking-wider rounded-none hover:bg-ink hover:text-surface transition-colors cursor-pointer"
            >
              Explore country journeys <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>

          {imageUrl && (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full aspect-[3/2] object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      </div>
    </section>
  );
}
