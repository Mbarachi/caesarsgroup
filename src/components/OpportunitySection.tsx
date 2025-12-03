import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Sun, Zap, Fuel, Clock, Target, Landmark } from "lucide-react";

export default function OpportunitySection() {
  const navigate = useNavigate();

  const stats = [
    {
      icon: <Zap className="h-5 w-5" />,
      label: "Grid Supply",
      value: "4,000 MW for 200M+",
      tip: "Only ~4,000 MW of grid power serves 200+ million people — far below demand.",
    },
    {
      icon: <Fuel className="h-5 w-5" />,
      label: "Diesel Reliance",
      value: "85% of businesses @ ₦1700/L",
      tip: "85% of businesses rely on diesel generators at about ₦1,700 per litre after subsidy removal.",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Blackouts",
      value: "18–20 hrs daily",
      tip: "Households face 18–20 hours of daily blackout, spending roughly ₦3.5 trillion annually on fuel.",
    },
    {
      icon: <Sun className="h-5 w-5" />,
      label: "Solar Resource",
      value: "5.5–7.0 kWh/m²/day",
      tip: "Nigeria enjoys 5.5–7.0 kWh/m²/day solar irradiation — among the highest in Africa.",
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: "Policy Target",
      value: "10 GW by 2030 (REMP)",
      tip: "The Renewable Energy Master Plan targets 10 GW of solar by 2030 to accelerate adoption.",
    },
    {
      icon: <Landmark className="h-5 w-5" />,
      label: "Funding & Incentives",
      value: "$750M DARES • VAT-exempt imports",
      tip: "$750M World Bank DARES funding and VAT-exempt imports reduce project costs and risks.",
    },
  ];

  return (
    <section id="opportunity" className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
        >
          {/* gradient accent backdrop */}
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(80%_60%_at_10%_0%,#EDE9FE_0%,transparent_60%),radial-gradient(80%_60%_at_90%_0%,#FCE7F3_0%,transparent_60%)]" />

          <div className="relative p-8 md:p-12">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                Nigeria’s Solar Moment
              </h2>
              <p className="mt-3 text-lg md:text-xl text-gray-700">
                A ₦2.8 trillion opportunity to replace diesel with clean, reliable solar for homes, SMEs and public services — powered by strong sun and policy tailwinds.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="group relative rounded-2xl border border-black/5 bg-white/80 backdrop-blur-sm p-4 md:p-5 shadow-sm hover:shadow-md focus-within:shadow-md"
                  tabIndex={0}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 rounded-full p-2 bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 ring-1 ring-black/5">
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{s.label}</p>
                      <p className="text-base md:text-lg font-semibold text-gray-900">{s.value}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-purple-300 transition" />

                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-2 left-0 z-10 w-[min(24rem,90vw)] -translate-y-full opacity-0 transition duration-200 group-hover:opacity-100 group-hover:-translate-y-[110%] group-focus-within:opacity-100 group-focus-within:-translate-y-[110%]">
                    <div className="rounded-xl bg-gray-900 text-white text-sm leading-snug px-3 py-2 shadow-xl ring-1 ring-white/10">
                      {s.tip}
                    </div>
                    <div className="mx-6 h-2 w-2 rotate-45 bg-gray-900 -mt-1 shadow-[0_1px_1px_rgba(255,255,255,0.12)]" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={() => navigate('/services')}
                className="w-full sm:w-auto font-bold"
              >
                See Solutions
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto"
              >
                Talk to an Expert
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
