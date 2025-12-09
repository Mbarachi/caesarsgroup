import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

// Pay-As-You-Go promotional jumbotron with animated glowing bulb and selling points
export default function PayAsYouGoPromo() {
  const navigate = useNavigate();

  const points = [
    "Power your home with ease",
    "Pay just 30% of package fee up front",
    "Spread the remaining payment for 12 months",
    "Interest rate as low as 0–1% on balance",
  ];

  return (
    <section className="py-12 md:py-20">
      {/* Section heading above promo card */}
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Flexible Pay-As-You-Go</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Start with only 30% upfront payment and enjoy clean, reliable power while spreading the balance over 12 easy months.</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 bg-gradient-to-br from-[#3C0D5E] via-[#4F166F] to-[#6B2B92]">
        {/* Subtle texture (simulated with radial gradients) */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none [background-image:radial-gradient(circle_at_30%_40%,#7C3AED_0%,transparent_60%),radial-gradient(circle_at_70%_60%,#F472B6_0%,transparent_65%)]" />

        <div className="relative p-10 md:p-16 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-white"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            PAY-AS-YOU-GO
          </h2>
          <ul className="space-y-5 mb-10">
            {points.map(p => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-1 h-3 w-3 rounded-full bg-gradient-to-br from-white to-purple-200 shadow-[0_0_0_3px_rgba(255,255,255,0.2)]" />
                <span className="text-lg md:text-xl font-medium leading-snug">{p}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row w-full items-stretch sm:items-center gap-3 sm:gap-4">
            <Button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto bg-white text-[#4F166F] hover:bg-purple-100 font-bold px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg shadow-lg shadow-black/20"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/savings-calculator')}
              className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg backdrop-blur-sm"
            >
              Calculate Savings
            </Button>
          </div>
        </motion.div>

        {/* Right Visual: Animated Bulb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="hidden md:flex flex-1 w-full items-center justify-center relative"
        >
          {/* Glow layers */}
          <motion.div
            className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-purple-300/40 blur-3xl"
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/60 blur-2xl"
            animate={{ opacity: [0.8, 0.4, 0.8], scale: [1.1, 0.95, 1.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner glow (simplified, removed ring) */}
          <motion.div
            className="absolute w-44 h-44 md:w-60 md:h-60 rounded-full bg-white/50 blur-2xl"
            animate={{ opacity: [0.7, 0.4, 0.7], scale: [1, 1.04, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Bulb SVG */}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 260"
            className="relative z-10 w-52 md:w-72 drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
            animate={{ y: [0, -10, 0], filter: ["drop-shadow(0 0 10px #fff)", "drop-shadow(0 0 28px #E9D8FD)", "drop-shadow(0 0 10px #fff)"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Spiral CFL style */}
            <defs>
              <linearGradient id="tube" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#F1EFFE" />
                <stop offset="100%" stopColor="#E2DAFF" />
              </linearGradient>
            </defs>
            <g>
              <path fill="url(#tube)" d="M40 40h120c10 0 18 8 18 18s-8 18-18 18H40c-10 0-18-8-18-18S30 40 40 40Zm0 56h120c10 0 18 8 18 18s-8 18-18 18H40c-10 0-18-8-18-18s8-18 18-18Zm0 56h120c10 0 18 8 18 18s-8 18-18 18H40c-10 0-18-8-18-18s8-18 18-18Z" />
              <rect x="70" y="208" width="60" height="18" rx="4" fill="#55525D" />
              <rect x="64" y="190" width="72" height="20" rx="6" fill="#6A6673" />
              <rect x="58" y="170" width="84" height="22" rx="8" fill="#736F7B" />
            </g>
          </motion.svg>
        </motion.div>
        </div>
        {/* Accent circle */}
        </div>
      </div>
    </section>
  );
}