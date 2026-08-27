import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { STATES } from "../../lib/solar/locations";
import {
  GOALS,
  GRID_BANDS,
  Goal,
  GridBand,
  PropertyType,
  UsageProfile,
} from "../../lib/solar/sizing";
import { Accent, GOAL_ACCENTS, GRID_ACCENTS, ORANGE } from "./accents";

type Props = {
  profile: UsageProfile;
  onChange: (next: UsageProfile) => void;
};

const PROPERTY_TYPES: { id: PropertyType; label: string }[] = [
  { id: "residential", label: "Residential home" },
  { id: "apartment", label: "Apartment / flat" },
  { id: "commercial", label: "Commercial premises" },
  { id: "industrial", label: "Industrial site" },
];

function ChoiceCard({
  selected,
  onClick,
  title,
  description,
  accent,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  accent: Accent;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`text-left rounded-xl border p-4 transition-all ${
        selected ? accent.selected : accent.idle
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 transition-opacity ${accent.dot} ${
            selected ? "opacity-100" : "opacity-40"
          }`}
        />
        <span>
          <span className="block font-semibold text-gray-900 dark:text-white">{title}</span>
          {description && (
            <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </span>
          )}
        </span>
      </div>
    </button>
  );
}

export default function StepProfile({ profile, onChange }: Props) {
  const set = <K extends keyof UsageProfile>(key: K, value: UsageProfile[K]) =>
    onChange({ ...profile, [key]: value });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tell us about your situation
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Where you are and how much grid power you actually get decide how much
          battery and panel you need.
        </p>
      </div>

      {/* Location + property */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="state" className="mb-2 block">State</Label>
          <Select
            value={profile.stateId}
            onValueChange={(v) => set("stateId", v)}
          >
            <SelectTrigger id="state" className="p-4 text-base">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {STATES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="property" className="mb-2 block">Property type</Label>
          <Select
            value={profile.propertyType}
            onValueChange={(v) => set("propertyType", v as PropertyType)}
          >
            <SelectTrigger id="property" className="p-4 text-base">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid availability */}
      <div>
        <Label className="mb-3 block">How much grid power do you get?</Label>
        <div className="grid sm:grid-cols-2 gap-3">
          {GRID_BANDS.map((band) => (
            <ChoiceCard
              key={band.id}
              selected={profile.gridBand === band.id}
              onClick={() => set("gridBand", band.id as GridBand)}
              title={band.label}
              accent={GRID_ACCENTS[band.id] || ORANGE}
            />
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <Label className="mb-3 block">What are you trying to achieve?</Label>
        <div className="grid sm:grid-cols-3 gap-3">
          {GOALS.map((goal) => (
            <ChoiceCard
              key={goal.id}
              selected={profile.goal === goal.id}
              onClick={() => set("goal", goal.id as Goal)}
              title={goal.label}
              description={goal.description}
              accent={GOAL_ACCENTS[goal.id] || ORANGE}
            />
          ))}
        </div>
      </div>

      {/* What they spend today */}
      <div>
        <Label className="mb-3 block">What do you spend on power today?</Label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Generator fuel is usually the larger half of this, and it is the part
          solar removes first.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bill" className="mb-2 block text-sm">
              Monthly electricity bill (₦)
            </Label>
            <Input
              id="bill"
              type="number"
              min={0}
              placeholder="e.g. 40000"
              value={profile.monthlyBillNaira || ""}
              onChange={(e) => set("monthlyBillNaira", Math.max(0, Number(e.target.value)))}
              className="p-4 text-base"
            />
          </div>
          <div>
            <Label htmlFor="litres" className="mb-2 block text-sm">
              Generator fuel (litres/week)
            </Label>
            <Input
              id="litres"
              type="number"
              min={0}
              placeholder="e.g. 30"
              value={profile.generatorLitresPerWeek || ""}
              onChange={(e) =>
                set("generatorLitresPerWeek", Math.max(0, Number(e.target.value)))
              }
              className="p-4 text-base"
            />
          </div>
          <div>
            <Label htmlFor="fuel-price" className="mb-2 block text-sm">
              Fuel price (₦/litre)
            </Label>
            <Input
              id="fuel-price"
              type="number"
              min={0}
              value={profile.fuelPricePerLitre || ""}
              onChange={(e) => set("fuelPricePerLitre", Math.max(0, Number(e.target.value)))}
              className="p-4 text-base"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
