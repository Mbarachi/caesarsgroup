import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import StepAppliances from "./calculator/StepAppliances";
import StepProfile from "./calculator/StepProfile";
import StepResult from "./calculator/StepResult";
import LeadForm from "./calculator/LeadForm";
import { runAudit } from "../lib/solar/audit";
import { ApplianceSelection, UsageProfile, summariseLoad } from "../lib/solar/sizing";

const STEPS = ["Appliances", "Your situation", "Your system", "Get a quote"];

const DEFAULT_PROFILE: UsageProfile = {
  stateId: "lagos",
  gridBand: "poor",
  goal: "hybrid",
  propertyType: "residential",
  monthlyBillNaira: 0,
  generatorLitresPerWeek: 0,
  // Roughly the pump price at the time of writing; the user can correct it.
  fuelPricePerLitre: 1000,
};

export default function SavingsCalculator() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<ApplianceSelection[]>([]);
  const [profile, setProfile] = useState<UsageProfile>(DEFAULT_PROFILE);

  // Recomputed as the user ticks appliances, to drive the live totals bar.
  const load = useMemo(() => summariseLoad(selections), [selections]);
  // Only meaningful once there is a load; cheap enough to keep in sync.
  const result = useMemo(() => runAudit(selections, profile), [selections, profile]);

  const canAdvance = step === 0 ? load.dailyKwh > 0 : true;
  const go = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 py-10 md:py-16">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 print:hidden">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Solar Package
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tell us what you run and we will size the system properly — then show you
            which of our packages carries it, and what it saves you.
          </p>
        </div>

        {/* Progress */}
        <ol className="flex items-center justify-between mb-10 gap-2 print:hidden">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex-1 flex items-center gap-2 min-w-0">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    active
                      ? "bg-brand-green text-white ring-4 ring-brand-green/25"
                      : done
                      ? "bg-brand-green-tint text-brand-green dark:bg-brand-green/20 dark:text-brand-teal"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={`text-sm truncate hidden sm:block ${
                    active
                      ? "font-semibold text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    className={`flex-1 h-0.5 rounded-full ml-1 transition-colors ${
                      done ? "bg-brand-green/40" : "bg-gray-200 dark:bg-gray-800"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>

        {/* Panel */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="print-plain bg-background-light dark:bg-background-dark/50 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800"
        >
          {step === 0 && (
            <StepAppliances
              selections={selections}
              onChange={setSelections}
              load={load}
            />
          )}
          {step === 1 && <StepProfile profile={profile} onChange={setProfile} />}
          {step === 2 && (
            <StepResult result={result} profile={profile} onGetQuote={() => go(3)} />
          )}
          {step === 3 && (
            <LeadForm result={result} profile={profile} onBack={() => go(2)} />
          )}
        </motion.div>

        {/* Navigation — Back stays available on every step past the first,
            including the quote form, so nothing is a one-way door. */}
        <div className="mt-8 flex items-center justify-between gap-4 print:hidden">
          <Button
            variant="outline"
            size="lg"
            onClick={() => go(step - 1)}
            disabled={step === 0}
            className={step === 0 ? "invisible" : ""}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {step === 3 ? "Back to my audit" : "Back"}
          </Button>

          {step < 2 && (
            <div className="flex items-center gap-4">
              {!canAdvance && (
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Add at least one appliance
                </span>
              )}
              <Button
                size="lg"
                onClick={() => go(step + 1)}
                disabled={!canAdvance}
                className="font-bold"
              >
                {step === 1 ? "See my system" : "Continue"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
