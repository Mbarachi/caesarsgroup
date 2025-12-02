import { Sun, Lamp, Server, Car } from "lucide-react";

type Service = {
  title: string;
  description: string;
  icon: React.ReactNode;
  haloBg: string;
  haloText: string;
};

const services: Service[] = [
  {
    title: "Residential & Commercial Solar Systems",
    description:
      "Professional installation of high‑efficiency solar systems for homes and businesses, engineered for optimal performance and longevity. We have proven expertise with various installations for both residential and commercial applications, across the country. ",
    icon: <Sun className="h-8 w-8" />,
    haloBg: "bg-amber-100 dark:bg-amber-300/20",
    haloText: "text-amber-600",
  },
  {
    title: "Solar Street Lighting & Pump Installations",
    description:
      "With the help of our partners, we have installed over 250 units of all‑in‑one solar street lighting across communities and schools in Oyo & Benue States. Project approved by the Federal Ministry of Agriculture & Rural Development.",
    icon: <Lamp className="h-8 w-8" />,
    haloBg: "bg-sky-100 dark:bg-sky-300/20",
    haloText: "text-sky-600",
  },
  {
    title: "Mini Grids for Data Centers",
    description:
      "Power your data centers with reliable, scalable, independent solutions off the main grid. Reduce operational costs and carbon footprint through efficient, renewable‑integrated systems designed for seamless 24/7 performance.",
    icon: <Server className="h-8 w-8" />,
    haloBg: "bg-emerald-100 dark:bg-emerald-300/20",
    haloText: "text-emerald-600",
  },
  {
    title: "Wholesale Supply of EVs",
    description:
      "Elevate your EV portfolio with Innoson's pioneering lineup, including the IVM EX02 (330-400km range) and EX01 (201-230km range), engineered for African roads with zero-emission efficiency and premium features including the electric steering.",
    icon: <Car className="h-8 w-8" />,
    haloBg: "bg-violet-100 dark:bg-violet-300/20",
    haloText: "text-violet-600",
  },
];

export default function Services() {
  return (
    <main className="flex-grow">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Our Services</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive suite of renewable energy solutions tailored to your needs—from solar installations to audits, mini‑grids, EV supply, and ongoing maintenance.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-background-light dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl p-8 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`p-4 rounded-full mb-6 ${s.haloBg} ${s.haloText}`}>{s.icon}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}