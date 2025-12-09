import { Battery, PlugZap, Sun, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import type { ReactElement } from "react";

type Package = {
  title: string;
  capacity: string;
  batteries: string;
  willPower: string[];
  price: string;
  theme: {
    from: string;
    to: string;
    accent: string;
  };
  icon: ReactElement;
};

const packages: Package[] = [
  {
    title: "Inverter System Package\nEconomy",
    capacity: "3KVA",
    batteries: "2 Deep cycle Batteries, (3KVA Inverter)",
    willPower: [
      "12+ lights",
      "Fans",
      "Computers",
      "Inverter Refrigerator",
    ],
    price: "₦1,414,500",
    theme: {
      from: "from-[#FF715D]",
      to: "to-[#F63D2F]",
      accent: "bg-[#FFEEE9]",
    },
    icon: <PlugZap className="h-6 w-6 text-white" />,
  },
  {
    title: "Inverter System Package\nEconomy Plus +",
    capacity: "5KVA",
    batteries: "4 Deep cycle Batteries, (5KVA Inverter)",
    willPower: [
      "14+ lights",
      "Fans",
      "Computers",
      "Low-wattage Freezer",
      "1x Inverter AC (optional)",
    ],
    price: "₦2,775,000",
    theme: {
      from: "from-[#1ABC9C]",
      to: "to-[#0E9F6E]",
      accent: "bg-[#E6FFF7]",
    },
    icon: <Battery className="h-6 w-6 text-white" />,
  },
  {
    title: "Solar System Package\nEconomy",
    capacity: "3.6KVA",
    batteries: "2 Deep cycle Batteries",
    willPower: [
      "12+ lights",
      "Fans",
      "Computers",
      "Inverter Refrigerator",
    ],
    price: "₦1,855,750",
    theme: {
      from: "from-[#FDBA74]",
      to: "to-[#FB923C]",
      accent: "bg-[#FFF3E6]",
    },
    icon: <Sun className="h-6 w-6 text-white" />,
  },
];

function PackageCard({ pkg }: { pkg: Package }) {
  const navigate = useNavigate();

  return (
    <Card className="relative h-full overflow-hidden rounded-2xl shadow-lg border-none">
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${pkg.theme.from} ${pkg.theme.to}`} />

      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10" />
      <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-black/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Title plaque */}
        <div className="mx-4 mt-4 rounded-xl bg-white text-gray-900 text-xl text-center px-4 py-3 shadow-sm">
          <div className="text-sm font-semibold leading-tight whitespace-pre-line">
            {pkg.title}
          </div>
        </div>

        {/* Badge + Capacity */}
        <div className="px-6 pt-6 flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            {pkg.icon}
          </div>
          <div>
            <div className="text-xs/4 opacity-90">Capacity</div>
            <div className="text-3xl font-extrabold tracking-tight">{pkg.capacity}</div>
          </div>
        </div>

        {/* Batteries */}
        <div className="px-6 pt-2 text-white/90 text-sm">{pkg.batteries}</div>

        {/* Will power */}
        <div className="mt-4 mx-6 rounded-xl bg-white/10 backdrop-blur-sm p-4">
          <div className="text-white/90 text-xs font-semibold mb-2">Will Power:</div>
          <ul className="space-y-2">
            {pkg.willPower.map((item) => (
              <li key={item} className="flex items-center gap-2 text-white">
                <CheckCircle2 className="h-4 w-4 text-white/90" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar with price and CTA */}
        <div className={`mt-auto px-6 py-4 ${pkg.theme.accent} text-gray-900`}> 
          <div className="flex items-end justify-center">
            <div>
              <div className="uppercase text-xs font-semibold tracking-wider opacity-70">Package Fee:</div>
              <div className="text-2xl md:text-3xl font-extrabold mt-1">{pkg.price}</div>
            </div>
            {/* <Button
              className="font-bold"
              onClick={() => navigate("/contact")}
            >
              Get Quote
            </Button> */}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function PricingSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            What Package Suits Your Needs?
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Flexible, reliable and efficient power packages tailored for homes and small businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.title} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
