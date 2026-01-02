import { motion } from "framer-motion";
import partner1Image from "../assets/Huawei.png";
import partner2Image from "../assets/Jinko.jpg";
import partner3Image from "../assets/Ritar.jpg";
import partner4Image from "../assets/canadian_solar.png";
import partner5Image from "../assets/moli_power.jpg";
import partner6Image from "../assets/rural.jpg";
import partner7Image from "../assets/Rean.png";

const 
PartnersSection = () => {
  const partners = [
    { id: 1, image: partner1Image, name: "Huawei" },
    { id: 2, image: partner2Image, name: "Jinko" },
    { id: 3, image: partner3Image, name: "Ritar" },
    { id: 4, image: partner4Image, name: "Canadian Solar" },
    { id: 5, image: partner5Image, name: "Moli Power" },
    { id: 6, image: partner6Image, name: "Rural" },
    { id: 7, image: partner7Image, name: "Rean" },
  ];

  // Duplicate partners array for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section id="partners" className="py-16 bg-background-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Partners & Vendors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We collaborate with industry-leading brands to deliver the best energy solutions
          </p>
        </div>

        {/* Scrolling Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background-light to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background-light to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-16 items-center"
              animate={{
                x: [0, -100 * partners.length],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0 w-40 h-24 flex items-center justify-center hover:grayscale-0 transition-all duration-300"
                >
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;