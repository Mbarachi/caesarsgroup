import { Separator } from "../components/ui/separator";
import { MapPin, Mail, Calendar, Briefcase, GraduationCap, CheckCircle2, Zap } from "lucide-react";

const locations = [
  "Abuja", "Calabar", "Rivers", "Enugu", "Ibadan", "Kano", "Jos", "Makurdi",
];

const qualifications = [
  "Strong skills in Electrical Maintenance and handling Electrical Equipment",
  "Minimum HND, OND or BSc degree in Electrical Engineering or related field",
  "8–10 years field experience desired",
  "Knowledge of Electrical Engineering principles and applications",
  "Understanding of safety standards and electrical system regulations",
  "Experience in solar or renewable energy systems is an advantage",
  "Strong attention to detail and problem-solving skills",
  "Ability to work on-site and collaborate with teams effectively",
];

export default function Careers() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-2xl px-6 py-16 md:py-24 mb-12 text-white text-center shadow-xl"
        style={{
          background: "linear-gradient(135deg, #101c22 0%, #1a2e3b 50%, #2e2e38 100%)",
        }}
      >
        {/* Decorative glow orbs aligned to brand */}
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)" }} />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)" }} />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border"
            style={{ background: "rgba(46,46,56,0.6)", borderColor: "rgba(255,255,255,0.15)", color: "#86efac" }}
          >
            <Zap className="w-3.5 h-3.5" /> Now Hiring
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Join Our Energy Revolution
          </h1>
          <p className="text-lg md:text-xl max-w-2xl" style={{ color: "rgba(255,255,255,0.75)" }}>
            Help power communities across Nigeria with clean, renewable energy while building a rewarding career.
          </p>
        </div>
      </div>

      {/* Job Card */}
      <div className="max-w-3xl mx-auto">
        {/* Job Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 w-full" />
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Electrical Technician{" "}
                  <span className="text-orange-500">(Solar)</span>
                </h2>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Badge icon={<Briefcase className="w-3.5 h-3.5" />} label="Contract / Remote" color="orange" />
                  <Badge icon={<MapPin className="w-3.5 h-3.5" />} label="Multiple Locations" color="green" />
                  <Badge icon={<Calendar className="w-3.5 h-3.5" />} label="Closes: 1st May 2026" color="yellow" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Company
        <Section title="Company Description" icon="🌍">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Caesars Energy Services is a startup Power Solutions Firm committed to driving sustainability through
            innovative renewable energy solutions. We specialize in solar energy, bioenergy, and off-grid/hybrid
            systems to deliver cleaner and greener energy options to both residential and commercial clusters.
          </p>
        </Section> */}

        {/* Locations */}
        <Section title="Available Locations" icon={<MapPin className="w-5 h-5 text-orange-500" />}>
          <div className="flex flex-wrap gap-2 mt-1">
            {locations.map((loc) => (
              <span
                key={loc}
                className="px-3 py-1 text-sm font-medium rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
              >
                {loc}
              </span>
            ))}
          </div>
        </Section>

        {/* Role Description */}
        <Section title="Role Description" icon="⚡">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            This is a remote, contract-based role across multiple locations in Nigeria. Earn money with your skills!
            Join our startup to install energy equipment, solar home systems, pumps, and street lights — powering
            communities with clean energy while paying close attention to safety and quality.
          </p>
        </Section>

        {/* Qualifications */}
        <Section title="Qualifications" icon={<GraduationCap className="w-5 h-5 text-orange-500" />}>
          <ul className="space-y-3 mt-1">
            {qualifications.map((q, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* How to Apply */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-orange-200 dark:border-orange-800 p-8 mb-12 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange-500" /> How to Apply
          </h3>
          <Separator className="mb-5 bg-orange-200 dark:bg-orange-800" />
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Email your CV to: </span>
              <a
                href="mailto:info@caesarsgroup.ng"
                className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
              >
                info@caesarsgroup.ng
              </a>
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Subject Line: </span>
              <span className="italic">"Solar Technician (Location of Interest)"</span>
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Application Deadline: </span>
              <span className="text-red-600 dark:text-red-400 font-semibold">1st May 2026</span>
            </p>
          </div>

          <a
            href="mailto:info@caesarsgroup.ng?subject=Solar Technician (Location of Interest)"
            className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Mail className="w-4 h-4" />
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---- Helper Components ---- */

function Badge({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: "orange" | "green" | "yellow";
}) {
  const colorMap = {
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${colorMap[color]}`}>
      {icon}
      {label}
    </span>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        {typeof icon === "string" ? <span>{icon}</span> : icon}
        {title}
      </h3>
      <Separator className="mb-4 bg-gray-100 dark:bg-gray-800" />
      {children}
    </div>
  );
}
