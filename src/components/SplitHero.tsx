import { motion } from "motion/react";
import { ReactNode } from "react";

interface SplitHeroProps {
  title: string;
  children?: ReactNode;
  imageUrl: string;
  imageAlt?: string;
}

// Full-bleed page header split in two: title and intro text on the left half, photo on the right half
// (stacked, photo below the text, on small screens).
export default function SplitHero({ title, children, imageUrl, imageAlt = "" }: SplitHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full md:min-h-[350px] flex flex-col md:flex-row overflow-hidden"
    >
      <div className="w-full md:w-1/2 bg-surface flex flex-col justify-center px-6 sm:px-10 lg:px-14 pt-20 pb-10 md:pb-16">
        <h1 className="title-h1 mb-4">{title}</h1>
        {children}
      </div>

      <div className="relative w-full md:w-1/2 h-[220px] sm:h-[280px] md:h-auto">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </motion.div>
  );
}
