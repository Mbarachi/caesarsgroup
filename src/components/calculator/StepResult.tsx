import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  Info,
  Leaf,
  Sparkles,
  X,
} from "lucide-react";
import AuditSheet from "./AuditSheet";
import { PackageCard } from "../PricingSection";
import { Button } from "../ui/button";
import { AuditResult } from "../../lib/solar/audit";
import { paygDeposit, paygMonthly, packageArrayKwp } from "../../lib/solar/packages";
import { zoneForState } from "../../lib/solar/locations";
import { UsageProfile } from "../../lib/solar/sizing";

const naira = (n: number) => `₦${Math.round(n).toLocaleString()}`;

// Spend borrows the package cards' coral, savings the Premium green, and
// payback the Pay-As-You-Go purple it is actually financed against.
const STAT_TONES = {
  spend: "border-brand-coral/40 bg-brand-coral-tint dark:border-brand-coral/40 dark:bg-brand-coral/10",
  save: "border-brand-green/40 bg-brand-green-tint dark:border-brand-green/40 dark:bg-brand-green/10",
  payback: "border-brand-plum/40 bg-brand-purple-tint dark:border-brand-plum/40 dark:bg-brand-plum/15",
  green: "border-brand-gold/50 bg-brand-gold-tint dark:border-brand-gold/40 dark:bg-brand-gold/10",
};

const STAT_VALUE_TONES = {
  spend: "text-brand-coral",
  save: "text-brand-green",
  payback: "text-brand-purple dark:text-brand-plum",
  green: "text-brand-orange",
};

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone: keyof typeof STAT_TONES;
}) {
  return (
    <div className={`rounded-xl border p-5 ${STAT_TONES[tone]}`}>
      <div className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
        {label}
      </div>
      <div className={`text-2xl font-extrabold mt-1 tabular-nums ${STAT_VALUE_TONES[tone]}`}>
        {value}
      </div>
      {sub && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

const ADVICE_STYLES = {
  warning: {
    icon: AlertTriangle,
    ring: "border-brand-orange/50 bg-brand-orange-tint dark:bg-brand-orange/10",
    tint: "text-brand-orange",
  },
  info: {
    icon: Info,
    ring: "border-brand-plum/40 bg-brand-purple-tint dark:bg-brand-plum/15",
    tint: "text-brand-plum",
  },
  good: {
    icon: Leaf,
    ring: "border-brand-green/40 bg-brand-green-tint dark:bg-brand-green/10",
    tint: "text-brand-green",
  },
};

export default function StepResult({
  result,
  profile,
  onGetQuote,
}: {
  result: AuditResult;
  profile: UsageProfile;
  onGetQuote: () => void;
}) {
  const { load, requirement, recommended, savings, advice, fits } = result;
  const zone = zoneForState(profile.stateId);

  return (
    <>
      {/* Hidden on screen; the print stylesheet hides everything else instead. */}
      <AuditSheet result={result} profile={profile} />

      <div className="space-y-10 print:hidden">

      {/* ── Headline ──────────────────────────────────────────────────────── */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green bg-brand-green-tint ring-1 ring-brand-green/40 dark:bg-brand-green/15 dark:text-brand-teal dark:ring-brand-green/50 px-3 py-1 rounded-full">
          <Sparkles className="h-4 w-4" />
          Your energy audit
        </div>
        <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          {recommended
            ? `You need the ${recommended.capacity} package`
            : "Your load needs a custom design"}
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Based on {load.dailyKwh.toFixed(1)} kWh a day across {load.lines.length}{" "}
          {load.lines.length === 1 ? "appliance" : "appliance types"}, at{" "}
          {requirement.psh} peak sun hours for the {zone.label.toLowerCase()}.
        </p>
      </div>

      {/* ── The recommendation ────────────────────────────────────────────── */}
      {recommended ? (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PackageCard pkg={recommended} />
          </motion.div>

          <div className="space-y-4">
            {/* Pay-as-you-go — the existing offer, applied to a real number */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#3C0D5E] via-[#4F166F] to-[#6B2B92] text-white shadow-xl">
              <div className="text-sm uppercase tracking-wider opacity-80">
                On Pay-As-You-Go
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">{naira(paygDeposit(recommended))}</span>
                <span className="opacity-80">up front</span>
              </div>
              <div className="mt-2 text-lg">
                then {naira(paygMonthly(recommended))} a month for 12 months
              </div>
              <p className="mt-4 text-sm opacity-80">
                30% deposit, balance spread over a year at 0–1% on the remainder.
              </p>
            </div>

            {/* What the system has to do vs what the package delivers */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 dark:bg-white/5 font-semibold text-gray-900 dark:text-white text-sm">
                How it was sized
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400">
                    <th className="px-5 py-2 font-medium"></th>
                    <th className="px-5 py-2 font-medium text-right">You need</th>
                    <th className="px-5 py-2 font-medium text-right">Package has</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr>
                    <td className="px-5 py-3 text-gray-900 dark:text-white">Inverter</td>
                    <td className="px-5 py-3 text-right tabular-nums">{requirement.inverterKva.toFixed(1)} kVA</td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">{recommended.inverterKva} kVA</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-gray-900 dark:text-white">Usable battery</td>
                    <td className="px-5 py-3 text-right tabular-nums">{requirement.batteryUsableKwh.toFixed(1)} kWh</td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">{recommended.batteryUsableKwh} kWh</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-gray-900 dark:text-white">Solar array</td>
                    <td className="px-5 py-3 text-right tabular-nums">{requirement.arrayKwp.toFixed(2)} kWp</td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">
                      {packageArrayKwp(recommended).toFixed(2)} kWp
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Past our standard range — and that is fine
          </h3>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            You need about {requirement.inverterKva.toFixed(1)} kVA of inverter,{" "}
            {requirement.batteryUsableKwh.toFixed(1)} kWh of usable storage and{" "}
            {requirement.arrayKwp.toFixed(1)} kWp of panel. We will design to that
            rather than sell you a package that will not carry the load.
          </p>
          <Button className="mt-6 font-bold" size="lg" onClick={onGetQuote}>
            Request a custom design
          </Button>
        </div>
      )}

      {/* ── Savings ───────────────────────────────────────────────────────── */}
      {savings.currentMonthlySpend > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            What it saves you
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat
              label="You spend now"
              tone="spend"
              value={naira(savings.currentMonthlySpend)}
              sub="per month, grid + fuel"
            />
            <Stat
              label="Solar saves"
              tone="save"
              value={naira(savings.monthlySavings)}
              sub={`${naira(savings.annualSavings)} a year`}
            />
            <Stat
              label="Pays for itself in"
              tone="payback"
              value={
                savings.paybackYears
                  ? `${savings.paybackYears.toFixed(1)} yrs`
                  : "—"
              }
              sub={recommended ? `on the ${recommended.capacity} package` : undefined}
            />
            <Stat
              label="Fuel avoided"
              tone="green"
              value={`${savings.litresAvoidedPerYear.toLocaleString()} L`}
              sub={`${Math.round(savings.co2AvoidedKgPerYear).toLocaleString()}kg CO₂ · ${savings.treesEquivalent} trees`}
            />
          </div>
        </div>
      )}

      {/* ── Straight talk ─────────────────────────────────────────────────── */}
      {advice.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Worth knowing
          </h3>
          <div className="space-y-3">
            {advice.map((item) => {
              const style = ADVICE_STYLES[item.tone];
              const Icon = style.icon;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-5 flex gap-4 ${style.ring}`}
                >
                  <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${style.tint}`} />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Full comparison ───────────────────────────────────────────────── */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          How every package measures up
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm min-w-[540px]">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="px-5 py-3 font-semibold">Package</th>
                <th className="px-5 py-3 font-semibold text-center">Inverter</th>
                <th className="px-5 py-3 font-semibold text-center">Battery</th>
                <th className="px-5 py-3 font-semibold text-center">Array</th>
                <th className="px-5 py-3 font-semibold text-right">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {fits.map((fit) => {
                const isPick = recommended && fit.pkg.id === recommended.id;
                const mark = (ok: boolean) =>
                  ok ? (
                    <Check className="h-4 w-4 text-brand-green mx-auto" aria-label="Meets requirement" />
                  ) : (
                    <X className="h-4 w-4 text-brand-coral/60 mx-auto" aria-label="Falls short" />
                  );
                return (
                  <tr
                    key={fit.pkg.id}
                    className={isPick ? "bg-primary/5" : undefined}
                  >
                    <td className="px-5 py-3">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {fit.pkg.capacity}
                      </span>
                      {isPick && (
                        <span className="ml-2 text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-green text-white">
                          Recommended
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">{mark(!fit.shortfalls.inverter)}</td>
                    <td className="px-5 py-3">{mark(!fit.shortfalls.battery)}</td>
                    <td className="px-5 py-3">{mark(!fit.shortfalls.array)}</td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-gray-900 dark:text-white">
                      {fit.pkg.price}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {recommended && (
        <div className="text-center">
          <Button size="lg" className="font-bold px-10" onClick={onGetQuote}>
            Get this quote formally
          </Button>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Or <button type="button" onClick={() => window.print()} className="underline hover:text-primary">save this audit as a one-page PDF</button>.
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-2xl mx-auto">
        This is a desk estimate from the figures you entered. A site survey confirms
        roof area, shading, cable runs and existing wiring before any installation is
        quoted firm.
      </p>
      </div>
    </>
  );
}
