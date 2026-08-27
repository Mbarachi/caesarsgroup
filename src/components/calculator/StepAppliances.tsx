import { useState } from "react";
import { ChevronDown, Minus, Plus, Flame } from "lucide-react";
import {
  APPLIANCES,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  ApplianceCategory,
  getAppliance,
} from "../../lib/solar/appliances";
import { ApplianceSelection, LoadSummary } from "../../lib/solar/sizing";
import { CATEGORY_DOTS } from "./accents";

type Props = {
  selections: ApplianceSelection[];
  onChange: (next: ApplianceSelection[]) => void;
  load: LoadSummary;
};

function upsert(
  selections: ApplianceSelection[],
  applianceId: string,
  quantity: number
): ApplianceSelection[] {
  const existing = selections.filter((s) => s.applianceId === applianceId)[0];
  if (quantity <= 0) return selections.filter((s) => s.applianceId !== applianceId);
  if (existing) {
    return selections.map((s) =>
      s.applianceId === applianceId ? { ...s, quantity } : s
    );
  }
  const appliance = getAppliance(applianceId);
  return selections.concat([
    {
      applianceId,
      quantity,
      hoursPerDay: appliance ? appliance.defaultHours : 4,
    },
  ]);
}

export default function StepAppliances({ selections, onChange, load }: Props) {
  const [open, setOpen] = useState<ApplianceCategory | null>("cooling");

  const quantityOf = (id: string) => {
    const found = selections.filter((s) => s.applianceId === id)[0];
    return found ? found.quantity : 0;
  };
  const hoursOf = (id: string) => {
    const found = selections.filter((s) => s.applianceId === id)[0];
    return found ? found.hoursPerDay : 0;
  };

  const setHours = (applianceId: string, hoursPerDay: number) =>
    onChange(
      selections.map((s) =>
        s.applianceId === applianceId
          ? { ...s, hoursPerDay: Math.max(0, Math.min(24, hoursPerDay)) }
          : s
      )
    );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          What do you need to power?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add everything you want running when the grid is off. Adjust the hours if
          your usage differs from the typical figure.
        </p>
      </div>

      <div className="space-y-3">
        {CATEGORY_ORDER.map((category) => {
          const items = APPLIANCES.filter((a) => a.category === category);
          const chosen = items.filter((a) => quantityOf(a.id) > 0).length;
          const isOpen = open === category;

          return (
            <div
              key={category}
              className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-background-dark/40"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : category)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${CATEGORY_DOTS[category]}`}
                  />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {CATEGORY_LABELS[category]}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  {chosen > 0 && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-green-tint text-brand-green ring-1 ring-brand-green/40 dark:bg-brand-green/15 dark:text-brand-teal dark:ring-brand-green/50">
                      {chosen} selected
                    </span>
                  )}
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map((appliance) => {
                    const qty = quantityOf(appliance.id);
                    return (
                      <div
                        key={appliance.id}
                        className={`px-5 py-3 transition-colors ${
                          qty > 0 ? "bg-brand-green-tint/60 dark:bg-brand-green/5" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white truncate">
                                {appliance.name}
                              </span>
                              {appliance.heavy && (
                                <Flame
                                  className="h-4 w-4 text-brand-orange shrink-0"
                                  aria-label="High power heating load"
                                />
                              )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {appliance.watts.toLocaleString()}W
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              aria-label={`Remove one ${appliance.name}`}
                              onClick={() => onChange(upsert(selections, appliance.id, qty - 1))}
                              disabled={qty === 0}
                              className="h-9 w-9 rounded-lg border border-gray-300 dark:border-gray-700 flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span
                              className={`w-9 text-center font-bold tabular-nums ${
                                qty > 0
                                  ? "text-brand-green dark:text-brand-teal"
                                  : "text-gray-400"
                              }`}
                            >
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Add one ${appliance.name}`}
                              onClick={() => onChange(upsert(selections, appliance.id, qty + 1))}
                              className="h-9 w-9 rounded-lg border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {qty > 0 && (
                          <div className="mt-3 flex items-center gap-3">
                            <label
                              htmlFor={`hours-${appliance.id}`}
                              className="text-sm text-gray-600 dark:text-gray-400 shrink-0"
                            >
                              Hours per day
                            </label>
                            <input
                              id={`hours-${appliance.id}`}
                              type="range"
                              min={0}
                              max={24}
                              step={0.5}
                              value={hoursOf(appliance.id)}
                              onChange={(e) => setHours(appliance.id, Number(e.target.value))}
                              className="flex-1 accent-primary"
                            />
                            <span className="w-12 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
                              {hoursOf(appliance.id)}h
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Running totals — the number that makes the exercise feel real */}
      <div className="sticky bottom-4 mt-6 rounded-xl bg-gradient-to-r from-brand-coral to-brand-orange text-white px-6 py-4 shadow-xl ring-1 ring-white/10 flex items-center justify-around gap-4">
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider opacity-70">Connected Load</div>
          <div className="text-xl font-extrabold tabular-nums">
            {(load.connectedLoadWatts / 1000).toFixed(2)} kW
          </div>
        </div>
        <div className="h-10 w-px bg-white/20" />
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider opacity-70">Daily Energy</div>
          <div className="text-xl font-extrabold tabular-nums">
            {load.dailyKwh.toFixed(1)} kWh
          </div>
        </div>
      </div>
    </div>
  );
}
