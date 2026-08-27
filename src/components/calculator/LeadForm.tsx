import { useForm, ValidationError } from "@formspree/react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AuditResult } from "../../lib/solar/audit";
import { UsageProfile } from "../../lib/solar/sizing";
import { STATES } from "../../lib/solar/locations";

const WHATSAPP = "https://wa.me/353830095716";

const BUDGETS = [
  "Under ₦2,000,000",
  "₦2,000,000 – ₦4,000,000",
  "₦4,000,000 – ₦6,000,000",
  "₦6,000,000 – ₦10,000,000",
  "Above ₦10,000,000",
  "I need financing options",
];

const TIMELINES = [
  "As soon as possible",
  "Within 1–3 months",
  "Within 3–6 months",
  "Still researching",
];

/**
 * The audit travels with the lead. Whoever picks this up already knows the
 * customer's load, the package that fits and what they are spending today,
 * so the first call can be about the install rather than about discovery.
 */
function auditSummary(result: AuditResult, profile: UsageProfile): string {
  const state = STATES.filter((s) => s.id === profile.stateId)[0];
  const lines = [
    `Recommended: ${result.recommended ? `${result.recommended.capacity} — ${result.recommended.price}` : "Custom design (load exceeds standard packages)"}`,
    `Daily energy: ${result.load.dailyKwh.toFixed(1)} kWh`,
    `Connected load: ${(result.load.connectedLoadWatts / 1000).toFixed(2)} kW`,
    `Sized for: ${result.requirement.inverterKva.toFixed(1)} kVA inverter, ${result.requirement.batteryUsableKwh.toFixed(1)} kWh usable battery, ${result.requirement.arrayKwp.toFixed(2)} kWp array`,
    `Location: ${state ? state.name : profile.stateId} (${result.requirement.psh} PSH)`,
    `Grid: ${profile.gridBand} · Goal: ${profile.goal} · Property: ${profile.propertyType}`,
    `Spends now: ₦${Math.round(result.savings.currentMonthlySpend).toLocaleString()}/month`,
    "",
    "Appliances:",
  ];
  result.load.lines.forEach((l) => {
    lines.push(`  ${l.quantity}× ${l.name} @ ${l.hoursPerDay}h/day — ${l.dailyKwh.toFixed(2)} kWh/day`);
  });
  return lines.join("\n");
}

export default function LeadForm({
  result,
  profile,
  onBack,
}: {
  result: AuditResult;
  profile: UsageProfile;
  onBack: () => void;
}) {
  const [state, handleSubmit] = useForm("xeoyrzze");

  if (state.succeeded) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-14 w-14 text-brand-green mx-auto" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
          Got it — we have your audit
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Your load breakdown came through with your details, so we can talk
          specifics when we call. Expect to hear from us within one working day.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="font-bold">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" />
              Talk to us on WhatsApp now
            </a>
          </Button>
          <Button variant="outline" size="lg" onClick={onBack}>
            Back to my audit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Lock in this quote
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your audit is already on this page — this just sends it to our team with
          your details so we can book a site survey and confirm the price.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* The audit itself, carried along with the enquiry */}
        <input type="hidden" name="audit" value={auditSummary(result, profile)} />
        <input
          type="hidden"
          name="recommended_package"
          value={result.recommended ? result.recommended.capacity : "Custom design"}
        />
        <input type="hidden" name="_subject" value="Energy audit enquiry from the website" />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lead-name" className="mb-2 block">Full name</Label>
            <Input id="lead-name" name="name" autoComplete="name" required className="p-4" />
          </div>
          <div>
            <Label htmlFor="lead-phone" className="mb-2 block">Phone number</Label>
            <Input id="lead-phone" name="phone" type="tel" autoComplete="tel" required className="p-4" />
          </div>
        </div>

        <div>
          <Label htmlFor="lead-email" className="mb-2 block">Email</Label>
          <Input id="lead-email" name="email" type="email" autoComplete="email" required className="p-4" />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
        </div>

        <div>
          <Label htmlFor="lead-address" className="mb-2 block">Installation address</Label>
          <Input
            id="lead-address"
            name="address"
            placeholder="Street, area, city"
            autoComplete="street-address"
            className="p-4"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lead-budget" className="mb-2 block">Budget range</Label>
            <Select name="budget">
              <SelectTrigger id="lead-budget" className="p-4">
                <SelectValue placeholder="Select a range" />
              </SelectTrigger>
              <SelectContent>
                {BUDGETS.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="lead-timeline" className="mb-2 block">When do you want this done?</Label>
            <Select name="timeline">
              <SelectTrigger id="lead-timeline" className="p-4">
                <SelectValue placeholder="Select a timeline" />
              </SelectTrigger>
              <SelectContent>
                {TIMELINES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ValidationError errors={state.errors} />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="submit"
            size="lg"
            disabled={state.submitting}
            className="font-bold flex-1"
          >
            {state.submitting ? "Sending…" : "Send my audit"}
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp instead
            </a>
          </Button>
        </div>
      </form>
    </div>
  );
}
