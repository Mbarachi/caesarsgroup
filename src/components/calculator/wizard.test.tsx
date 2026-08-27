import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SavingsCalculator from "../SavingsCalculator";

// jsdom implements neither of these, and the wizard calls both.
beforeAll(() => {
  window.scrollTo = jest.fn() as unknown as typeof window.scrollTo;
  window.print = jest.fn();
});

const renderWizard = () =>
  render(
    <MemoryRouter>
      <SavingsCalculator />
    </MemoryRouter>
  );

const click = (el: Element) => userEvent.click(el);
// "Cooling" is expanded by default, so only the other sections need opening.
const openCategory = (name: RegExp) =>
  click(screen.getByRole("button", { name }));

/** Click the "+" beside a named appliance the given number of times. */
function addAppliance(name: string, times = 1) {
  const button = screen.getByLabelText(`Add one ${name}`);
  for (let i = 0; i < times; i++) click(button);
}

const continueButton = () => screen.getByRole("button", { name: /continue/i });
const seeSystem = () => screen.getByRole("button", { name: /see my system/i });

describe("the calculator, driven as a user", () => {
  it("blocks the first step until something is selected", () => {
    renderWizard();
    expect(continueButton()).toBeDisabled();
    addAppliance("Standing Fan");
    expect(continueButton()).toBeEnabled();
  });

  it("shows running totals that respond to what is added", () => {
    renderWizard();
    addAppliance("Standing Fan", 2); // 2 × 75W = 0.15 kW, × 10h = 1.5 kWh
    expect(screen.getByText("0.15 kW")).toBeInTheDocument();
    expect(screen.getByText("1.5 kWh")).toBeInTheDocument();
  });

  it("walks a modest home through to the Economy recommendation", () => {
    renderWizard();

    // Step 1 — a small flat's worth of load.
    openCategory(/^Lighting/);
    addAppliance("LED Bulb", 8);
    openCategory(/^Cooling/);
    addAppliance("Standing Fan", 2);
    openCategory(/^Entertainment/);
    addAppliance('32" LED TV');

    click(continueButton());

    // Step 2 — the profile screen renders and accepts what they spend today.
    expect(
      screen.getByRole("heading", { name: /tell us about your situation/i })
    ).toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/monthly electricity bill/i), "40000");
    userEvent.type(screen.getByLabelText(/generator fuel/i), "25");

    click(seeSystem());

    // Step 3 — a named package at a real price, not an abstract spec.
    expect(
      screen.getByRole("heading", { name: /you need the 3\.5KVA package/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText("₦1,955,750").length).toBeGreaterThan(0);
    // Pay-as-you-go deposit: 30% of ₦1,955,750.
    expect(screen.getByText("₦586,725")).toBeInTheDocument();
    expect(screen.getByText(/how it was sized/i)).toBeInTheDocument();
    expect(screen.getByText(/pays for itself in/i)).toBeInTheDocument();
  });

  it("carries the audit into the lead form as a hidden field", () => {
    const { container } = renderWizard();

    openCategory(/^Kitchen/);
    addAppliance("Refrigerator");
    click(continueButton());
    click(seeSystem());
    click(screen.getByRole("button", { name: /get this quote formally/i }));

    expect(screen.getByRole("heading", { name: /lock in this quote/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();

    const audit = container.querySelector('input[name="audit"]') as HTMLInputElement;
    expect(audit).not.toBeNull();
    expect(audit.value).toMatch(/Recommended:/);
    expect(audit.value).toMatch(/Refrigerator/);
    expect(audit.value).toMatch(/Daily energy:/);
  });

  it("renders a self-contained one-page sheet for printing", () => {
    const { container } = renderWizard();

    openCategory(/^Kitchen/);
    addAppliance("Refrigerator");
    openCategory(/^Lighting/);
    addAppliance("LED Bulb", 6);
    click(continueButton());
    click(seeSystem());

    const sheet = container.querySelector(".print-sheet") as HTMLElement;
    expect(sheet).not.toBeNull();

    // Hidden on screen, revealed by the print stylesheet.
    expect(sheet.className).toContain("hidden");
    expect(sheet.className).toContain("print:block");

    // Everything needed to act on the quote, without the rest of the page.
    const text = sheet.textContent || "";
    expect(text).toContain("Energy Audit");
    expect(text).toContain("Caesars Energy Services");
    expect(text).toContain("3.5KVA");
    expect(text).toContain("₦1,955,750");
    expect(text).toContain("Refrigerator");
    expect(text).toContain("LED Bulb");
    expect(text).toContain("info@caesarsgroup.ng");
    expect(text).toMatch(/site survey/i);

    // The appliance table totals to the same figure the wizard reported.
    expect(within(sheet).getByText("Total")).toBeInTheDocument();
  });

  it("caps the printed appliance table and folds the remainder into one row", () => {
    const { container } = renderWizard();

    // Twelve distinct appliance types — more than the sheet lists individually.
    openCategory(/^Lighting/);
    ["LED Bulb", "Flood Light", "Security Light"].forEach((n) => addAppliance(n));
    openCategory(/^Entertainment/);
    ['32" LED TV', '55" LED TV', "Decoder / Set-top Box", "Sound System", "Gaming Console"].forEach(
      (n) => addAppliance(n)
    );
    openCategory(/^Office & Internet/);
    ["Laptop", "Desktop Computer", "Monitor", "Printer"].forEach((n) => addAppliance(n));

    click(continueButton());
    click(seeSystem());

    const sheet = container.querySelector(".print-sheet") as HTMLElement;
    expect(within(sheet).getByText(/\+ 2 other appliances/)).toBeInTheDocument();
  });

  it("flags heating loads on the results screen", () => {
    renderWizard();

    openCategory(/^Kitchen/);
    addAppliance("Water Heater", 2);
    addAppliance("Refrigerator");
    click(continueButton());
    click(seeSystem());

    expect(screen.getByRole("heading", { name: /worth knowing/i })).toBeInTheDocument();
    // Once on screen and once on the printable sheet, which carries the same finding.
    expect(screen.getAllByText(/Water Heater.*of your daily energy/)).toHaveLength(2);
  });

  it("tells a very large load it needs a custom design", () => {
    renderWizard();

    addAppliance("2hp Air Conditioner", 8);
    click(continueButton());
    click(seeSystem());

    expect(
      screen.getByRole("heading", { name: /your load needs a custom design/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /request a custom design/i })
    ).toBeInTheDocument();
  });

  it("lets the user leave the quote form without losing the audit", () => {
    renderWizard();

    openCategory(/^Kitchen/);
    addAppliance("Refrigerator");
    click(continueButton());
    click(seeSystem());
    click(screen.getByRole("button", { name: /get this quote formally/i }));
    expect(screen.getByRole("heading", { name: /lock in this quote/i })).toBeInTheDocument();

    click(screen.getByRole("button", { name: /back to my audit/i }));
    expect(
      screen.getByRole("heading", { name: /you need the 3\.5KVA package/i })
    ).toBeInTheDocument();

    // And back further still, with the selection intact.
    click(screen.getByRole("button", { name: /^back$/i }));
    expect(
      screen.getByRole("heading", { name: /tell us about your situation/i })
    ).toBeInTheDocument();
  });

  it("lets the user go back and change their mind", () => {
    renderWizard();

    addAppliance("Standing Fan", 2);
    click(continueButton());
    expect(
      screen.getByRole("heading", { name: /tell us about your situation/i })
    ).toBeInTheDocument();

    click(screen.getByRole("button", { name: /^back$/i }));
    expect(
      screen.getByRole("heading", { name: /what do you need to power/i })
    ).toBeInTheDocument();
    // The selection survived the round trip.
    expect(screen.getByText("0.15 kW")).toBeInTheDocument();
  });
});
