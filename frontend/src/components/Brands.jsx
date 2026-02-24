import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const brandLogos = [
  {
    name: "Schneider",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Schneider_Electric_2007.svg/1024px-Schneider_Electric_2007.svg.png",
    darkInvert: false,
  },
  {
    name: "Havells",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Havells_Logo.svg",
    darkInvert: false,
  },
  {
    name: "Polycab",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/POLYCAB_LOGO_UPLOAD.jpg",
    darkInvert: false,
  },
  {
    name: "Finolex",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Finolex_Logo.svg",
    darkInvert: false,
  },
  {
    name: "Crompton",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Crompton_Greaves_Logo.png",
    darkInvert: false,
  },
  {
    name: "Orient",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Orient_Electric_logo.svg",
    darkInvert: false,
  },
  {
    name: "Luminous",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/LuminousLogo_New(English).jpg",
    darkInvert: false,
  },
  {
    name: "Goldmedal",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Goldmedal_Electricals_Logo.svg",
    darkInvert: false,
  },
];

function BrandItem({ brand }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex-shrink-0 px-10 md:px-12">
      <div className="group w-[180px] h-[70px] flex items-center justify-center">
        {!failed ? (
          <img
            src={brand.src}
            alt={brand.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className={[
              "max-h-10 md:max-h-12 max-w-[170px] w-auto object-contain",
              "grayscale-0 opacity-100",
              "md:grayscale md:opacity-60 md:group-hover:grayscale-0 md:group-hover:opacity-100",
              "transition-all duration-300 cursor-pointer",
              brand.darkInvert ? "dark:brightness-0 dark:invert" : "",
            ].join(" ")}
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="text-sm md:text-base font-semibold tracking-wide text-neutral-400 dark:text-neutral-500 uppercase select-none">
            {brand.name}
          </span>
        )}
      </div>
    </div>
  );
}

const Brands = () => {
  const loopLogos = useMemo(() => [...brandLogos, ...brandLogos], []);

  return (
    <section className="py-10 bg-stone-50 dark:bg-neutral-900 overflow-hidden transition-colors duration-300 border-b border-stone-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <h2 className="font-bold dark:text-white uppercase tracking-widest text-neutral-400 text-sm">
          Trusted by Industry Leaders
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-stone-50 dark:from-neutral-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-stone-50 dark:from-neutral-900 to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex items-center w-max will-change-transform"
        >
          {loopLogos.map((brand, i) => (
            <BrandItem key={`${brand.name}-${i}`} brand={brand} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Brands;
