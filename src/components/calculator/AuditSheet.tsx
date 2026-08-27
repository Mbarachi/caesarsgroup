import logo from "../../assets/caesar_dark.png";
import { AuditResult } from "../../lib/solar/audit";
import { STATES } from "../../lib/solar/locations";
import { paygDeposit, paygMonthly, packageArrayKwp } from "../../lib/solar/packages";
import { UsageProfile } from "../../lib/solar/sizing";

/**
 * The printed audit — one page, no chrome.
 *
 * Hidden on screen and revealed only by the print stylesheet in index.css,
 * which blanks the rest of the page around it. Kept deliberately dense: a
 * customer should be able to hand this to an electrician or a spouse and have
 * the whole argument fit on a single sheet.
 */

const naira = (n: number) => `₦${Math.round(n).toLocaleString()}`;

/** Beyond this many rows the appliance table stops earning its space. */
const MAX_ROWS = 10;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 py-[3px] border-b border-dotted border-gray-300 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-black tabular-nums">{value}</span>
    </div>
  );
}

export default function AuditSheet({
  result,
  profile,
}: {
  result: AuditResult;
  profile: UsageProfile;
}) {
  const { load, requirement, recommended, savings, advice } = result;
  const state = STATES.filter((s) => s.id === profile.stateId)[0];
  const rows = load.lines.slice(0, MAX_ROWS);
  const rest = load.lines.slice(MAX_ROWS);
  const restKwh = rest.reduce((sum, l) => sum + l.dailyKwh, 0);
  const warnings = advice.filter((a) => a.tone === "warning").slice(0, 2);

  return (
    <div className="print-sheet hidden print:block text-black text-[9.5pt] leading-snug">
      {/* Masthead */}
      <div className="flex items-end justify-between border-b-2 border-black pb-2">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Caesars Energy Services" className="h-10 w-auto" />
          <div>
            <div className="text-[13pt] font-extrabold leading-none tracking-tight">
              Energy Audit
            </div>
            <div className="text-[8pt] text-gray-600 mt-0.5">
              Caesars Energy Services
            </div>
          </div>
        </div>
        <div className="text-right text-[8pt] text-gray-600">
          <div>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
          <div>
            {state ? state.name : profile.stateId} · {requirement.psh} peak sun hours
          </div>
        </div>
      </div>

      {/* The answer, first thing on the page */}
      <div className="mt-3 border border-black rounded p-3 flex items-center justify-between gap-4">
        <div>
          <div className="text-[7.5pt] uppercase tracking-widest text-gray-600">
            Recommended
          </div>
          <div className="text-[15pt] font-extrabold leading-tight">
            {recommended
              ? `${recommended.capacity} — ${recommended.title.replace(/\n/g, " ")}`
              : "Custom system design"}
          </div>
          <div className="text-[8pt] text-gray-700 mt-0.5">
            {recommended
              ? recommended.batteries.replace(/\n/g, " · ")
              : `Sized for ${requirement.inverterKva.toFixed(1)} kVA · ${requirement.batteryUsableKwh.toFixed(1)} kWh · ${requirement.arrayKwp.toFixed(1)} kWp`}
          </div>
        </div>
        {recommended && (
          <div className="text-right shrink-0">
            <div className="text-[16pt] font-extrabold leading-none">{recommended.price}</div>
            <div className="text-[8pt] text-gray-700 mt-1">
              or {naira(paygDeposit(recommended))} down
              <br />
              + {naira(paygMonthly(recommended))}/mo × 12
            </div>
          </div>
        )}
      </div>

      {/* Load and sizing, side by side */}
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[7.5pt] uppercase tracking-widest text-gray-600 border-b border-black pb-1 mb-1">
            Your load
          </div>
          <Field label="Daily energy" value={`${load.dailyKwh.toFixed(1)} kWh/day`} />
          <Field label="Connected load" value={`${(load.connectedLoadWatts / 1000).toFixed(2)} kW`} />
          <Field label="Peak demand" value={`${(load.peakDemandWatts / 1000).toFixed(2)} kW`} />
          <Field label="Grid supply" value={profile.gridBand} />
          <Field label="Goal" value={profile.goal} />
        </div>
        <div>
          <div className="text-[7.5pt] uppercase tracking-widest text-gray-600 border-b border-black pb-1 mb-1">
            System sizing — needed vs supplied
          </div>
          <Field
            label="Inverter"
            value={`${requirement.inverterKva.toFixed(1)} → ${recommended ? `${recommended.inverterKva} kVA` : "custom"}`}
          />
          <Field
            label="Usable battery"
            value={`${requirement.batteryUsableKwh.toFixed(1)} → ${recommended ? `${recommended.batteryUsableKwh} kWh` : "custom"}`}
          />
          <Field
            label="Solar array"
            value={`${requirement.arrayKwp.toFixed(2)} → ${recommended ? `${packageArrayKwp(recommended).toFixed(2)} kWp` : "custom"}`}
          />
          {recommended && <Field label="Backup" value={recommended.backupTime} />}
        </div>
      </div>

      {/* Appliance breakdown */}
      <div className="mt-3">
        <div className="text-[7.5pt] uppercase tracking-widest text-gray-600 border-b border-black pb-1">
          Appliances audited
        </div>
        <table className="w-full text-[8.5pt] mt-1">
          <thead>
            <tr className="text-gray-600 text-left">
              <th className="font-medium py-0.5">Appliance</th>
              <th className="font-medium py-0.5 text-right w-12">Qty</th>
              <th className="font-medium py-0.5 text-right w-16">Watts</th>
              <th className="font-medium py-0.5 text-right w-14">Hrs</th>
              <th className="font-medium py-0.5 text-right w-20">kWh/day</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((line) => (
              <tr key={line.applianceId} className="border-t border-gray-200">
                <td className="py-0.5">
                  {line.name}
                  {line.heavy && <span className="text-gray-500"> (heating load)</span>}
                </td>
                <td className="py-0.5 text-right tabular-nums">{line.quantity}</td>
                <td className="py-0.5 text-right tabular-nums">{line.connectedWatts.toLocaleString()}</td>
                <td className="py-0.5 text-right tabular-nums">{line.hoursPerDay}</td>
                <td className="py-0.5 text-right tabular-nums">{line.dailyKwh.toFixed(2)}</td>
              </tr>
            ))}
            {rest.length > 0 && (
              <tr className="border-t border-gray-200 text-gray-600">
                <td className="py-0.5" colSpan={4}>
                  + {rest.length} other {rest.length === 1 ? "appliance" : "appliances"}
                </td>
                <td className="py-0.5 text-right tabular-nums">{restKwh.toFixed(2)}</td>
              </tr>
            )}
            <tr className="border-t-2 border-black font-bold">
              <td className="py-1" colSpan={4}>Total</td>
              <td className="py-1 text-right tabular-nums">{load.dailyKwh.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Money */}
      {savings.currentMonthlySpend > 0 && (
        <div className="mt-3">
          <div className="text-[7.5pt] uppercase tracking-widest text-gray-600 border-b border-black pb-1 mb-1.5">
            What it saves
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-[11pt] font-extrabold tabular-nums">{naira(savings.currentMonthlySpend)}</div>
              <div className="text-[7.5pt] text-gray-600">spent now, per month</div>
            </div>
            <div>
              <div className="text-[11pt] font-extrabold tabular-nums">{naira(savings.monthlySavings)}</div>
              <div className="text-[7.5pt] text-gray-600">saved per month</div>
            </div>
            <div>
              <div className="text-[11pt] font-extrabold tabular-nums">
                {savings.paybackYears ? `${savings.paybackYears.toFixed(1)} yrs` : "—"}
              </div>
              <div className="text-[7.5pt] text-gray-600">to pay for itself</div>
            </div>
            <div>
              <div className="text-[11pt] font-extrabold tabular-nums">
                {savings.litresAvoidedPerYear.toLocaleString()} L
              </div>
              <div className="text-[7.5pt] text-gray-600">
                fuel avoided/yr · {Math.round(savings.co2AvoidedKgPerYear).toLocaleString()}kg CO₂
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Only the findings that change a decision */}
      {warnings.length > 0 && (
        <div className="mt-3">
          <div className="text-[7.5pt] uppercase tracking-widest text-gray-600 border-b border-black pb-1 mb-1">
            Worth knowing
          </div>
          {warnings.map((item) => (
            <div key={item.id} className="text-[8.5pt] py-0.5">
              <span className="font-semibold">{item.title}.</span>{" "}
              <span className="text-gray-700">{item.detail}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-2 border-t-2 border-black text-[7.5pt] text-gray-700 flex justify-between gap-4">
        <div>
          <span className="font-semibold text-black">Caesars Energy Services</span> · Festac Town, Lagos ·
          info@caesarsgroup.ng · +234 816 404 6861
        </div>
        <div className="text-right shrink-0">
          Desk estimate from figures supplied.
          <br />
          A site survey confirms the final design.
        </div>
      </div>
    </div>
  );
}
