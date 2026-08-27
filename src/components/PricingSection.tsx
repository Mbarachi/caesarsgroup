import { Battery, PlugZap, Sun, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import type { ReactElement } from "react";
import { PACKAGES, PackageId, SolarPackage } from "../lib/solar/packages";

// Package data lives in src/lib/solar/packages.ts so that this page and the
// energy calculator's recommendation can never disagree about a price or a spec.
const ICONS: Record<PackageId, ReactElement> = {
  standard: <Sun className="h-6 w-6 text-white" />,
  premium: <PlugZap className="h-6 w-6 text-white" />,
  economy: <Battery className="h-6 w-6 text-white" />,
};

export function PackageCard({
  pkg,
  showCta = false,
}: {
  pkg: SolarPackage;
  showCta?: boolean;
}) {
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
            {ICONS[pkg.id]}
          </div>
          <div>
            <div className="text-xs/4 opacity-90">Capacity</div>
            <div className="text-3xl font-extrabold tracking-tight">{pkg.capacity}</div>
          </div>
        </div>

        {/* Batteries */}
        <div className="px-6 pt-2 text-white/90 text-sm whitespace-pre-line">{pkg.batteries}</div>

        {/* Will power */}
        <div className="mt-4 mb-4 mx-6 rounded-xl bg-white/10 backdrop-blur-sm p-4">
          <div className="text-white font-semibold mb-2 text-sm">It will power:</div>
          <ul className="space-y-2">
            {pkg.willPower.map((item) => (
              <li key={item} className="flex items-center gap-2 text-white">
                <CheckCircle2 className="h-4 w-4 text-white/90" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 pt-3 border-t border-white/20 text-white/90 text-sm space-y-1">
            <div>{pkg.backupTime}</div>
            <div>{pkg.idealFor}</div>
          </div>
        </div>

        {/* Bottom bar with price and CTA */}
        <div className={`mt-auto px-6 py-4 ${pkg.theme.accent} text-gray-900`}>
          <div className={`flex items-end ${showCta ? "justify-between" : "justify-center"}`}>
            <div>
              <div className="uppercase text-xs font-semibold tracking-wider opacity-70">Package Fee:</div>
              <div className="text-2xl md:text-3xl font-extrabold mt-1">{pkg.price}</div>
            </div>
            {showCta && (
              <Button className="font-bold" onClick={() => navigate("/contact")}>
                Get Quote
              </Button>
            )}
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
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
