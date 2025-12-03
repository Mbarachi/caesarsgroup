import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import ugoImg from "../assets/team/mgbemenna.jpg";
import danielaImg from "../assets/team/daniela.jpeg";
import firiImg from "../assets/team/firi.jpeg"
import mosesImg from "../assets/team/moses.jpeg"

type Member = {
    id: number;
    name: string;
    role: string;
    bio?: string;
    photo: string; // placeholder paths; replace with real assets
};

const members: Member[] = [
    {
        id: 1,
        name: "Mgbemena Ugochukwu Michael",
        role: "Head, Engineering Operations & Business Development",
        bio: "Ugo is a seasoned Electrical and Electronics Engineer with over a decade of experience in power, telecommunications, renewable energy, and semiconductor industries. He has successfully delivered projects in both private and commercial renewable energy sectors in Nigeria & accross the continent.",
        photo: ugoImg
    },
    {
        id: 2,
        name: "Daniela Okafor",
        role: "COO",
        bio: "Operations and delivery excellence.",
        photo: danielaImg
    },
    {
        id: 3,
        name: "Prince Barimene Firi ",
        role: "Head, Digital Marketing and creative services",
        bio: "A versatile professional with a diverse background spanning data analysis, real estate, and business consulting. With a Bachelor’s degree in Business Administration from Turkey & a Master's Degree from Beijing Normal University in China, Prince Barimene Firi has built a solid foundation in Digital marketing, and strategic consulting.",
        photo: firiImg
    },
    {
        id: 4, name: "Olabode Moses",
        role: "Lead Technician",
        bio: "EBode is an experienced Electrical technician with over a decade’s experience in small, medium & large scale energy projects. With safety & Quality as our top priority, His attention to detail has enabled him execute jobs in a timely and professional manner",
        photo: mosesImg
    },
    { 
        id: 5, 
        name: "Mbarachi Victor", 
        role: "Finance Lead", 
        bio: "DARES and vendor finance.", 
        photo: "https://images.unsplash.com/photo-1544005316-04c8f6d1f31f?q=80&w=1200&auto=format&fit=crop" },
    { id: 6, name: "Tunde Ajayi", role: "Field Supervisor", bio: "Installations and after-sales.", photo: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1200&auto=format&fit=crop" },
    { id: 7, name: "Oluwakemi Adebayo", role: "Customer Success", bio: "Customer onboarding and support.", photo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" },
    { id: 8, name: "Emeka Okafor", role: "Procurement", bio: "Tier-1 components sourcing.", photo: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1200&auto=format&fit=crop" },
    { id: 9, name: "Fatima Ali", role: "QA Engineer", bio: "Performance testing.", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop" },
    { id: 10, name: "Gbenga Akin", role: "Installer", bio: "Residential & SME installs.", photo: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1200&auto=format&fit=crop" },
    { id: 11, name: "Nkechi Obi", role: "Design Engineer", bio: "System layout & sizing.", photo: "https://images.unsplash.com/photo-1544005316-04c8f6d1f31f?q=80&w=1200&auto=format&fit=crop" },
    { id: 12, name: "Bashir Ahmed", role: "Technician", bio: "Maintenance & repairs.", photo: "https://images.unsplash.com/photo-1549342903-5f5b33f13b45?q=80&w=1200&auto=format&fit=crop" },
];

export default function Team() {
    const [active, setActive] = useState<Member | null>(null);

    return (
        <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-20">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Team</h1>
                    <p className="mt-3 text-lg text-black/70">Meet the people powering reliable solar — leadership, engineering, field ops, and customer success.</p>
                </div>

                {/* Mosaic grid closer to reference: fixed 4x4 layout with interleaved CTA and texture tiles */}
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {/* Row 1 */}
                    {members.slice(0, 3).map((m) => (
                        <Tile key={m.id} member={m} onClick={() => setActive(m)} />
                    ))}
                    <TextureTile variant="diagonal" />

                    {/* Row 2 */}
                    <TextureTile variant="solid" />
                    <Tile member={members[3]} onClick={() => setActive(members[3])} />
                    <Tile member={members[4]} onClick={() => setActive(members[4])} />
                    <Tile member={members[5]} onClick={() => setActive(members[5])} />

                    {/* Row 3 with orange CTAs */}
                    <Tile member={members[6]} onClick={() => setActive(members[6])} />
                    <CtaTile title="AGENCY" subtitle="LEADERSHIP" tone="light" />
                    <Tile member={members[7]} onClick={() => setActive(members[7])} />
                    <CtaTile title="MEET THE" subtitle="TEAM" tone="solid" />

                    {/* Row 4 */}
                    {members.slice(8, 11).map((m) => (
                        <Tile key={m.id} member={m} onClick={() => setActive(m)} />
                    ))}
                    <TextureTile variant="diagonal" />
                </div>

                {/* Diagonal accent like reference */}
                <div className="mt-10">
                    <div className="h-20 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden rounded-lg border border-black/10">
                        <div className="absolute -bottom-10 -left-10 w-[160%] h-40 rotate-[-12deg] bg-black" />
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70"
                        onClick={() => setActive(null)}
                        aria-modal
                        role="dialog"
                    >
                        <div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
                            >
                                <div className="aspect-[16/10] relative">
                                    <img src={active.photo} alt={active.name} className="absolute inset-0 h-full w-full object-cover grayscale" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-900">{active.name}</h3>
                                    <p className="text-sm text-gray-600">{active.role}</p>
                                    {active.bio && <p className="mt-3 text-gray-700">{active.bio}</p>}
                                    <div className="mt-6 flex justify-end gap-3">
                                        <Button variant="outline" onClick={() => setActive(null)}>Close</Button>
                                        <Button>Connect</Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

// Subcomponents for tiles
function Tile({ member, onClick }: { member: Member; onClick: () => void }) {
    return (
        <button
            className="group relative aspect-square rounded-md overflow-hidden border border-black/10 bg-gray-100"
            onClick={onClick}
            aria-label={`View ${member.name}`}
        >
            <img src={member.photo} alt={member.name} className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0 transition" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition" />
            <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition">
                <div className="rounded bg-white/90 backdrop-blur-sm p-2 shadow">
                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.role}</p>
                </div>
            </div>
        </button>
    );
}

function CtaTile({ title, subtitle, tone }: { title: string; subtitle: string; tone: "light" | "solid" }) {
    if (tone === "light") {
        return (
            <div className="relative aspect-square rounded-md overflow-hidden border border-black/10">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100" />
                <div className="relative z-10 h-full w-full flex flex-col items-center justify-center gap-1 text-center p-4">
                    <p className="text-orange-600 font-bold tracking-wide text-xs md:text-sm">{title}</p>
                    <h3 className="text-lg md:text-xl font-extrabold text-gray-900">{subtitle}</h3>
                    <Button variant="outline" className="mt-2 border-orange-600 text-orange-600 px-3 py-1">View</Button>
                </div>
            </div>
        );
    }
    return (
        <div className="relative aspect-square rounded-md overflow-hidden border border-black/10">
            <div className="absolute inset-0 bg-orange-500" />
            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center p-4 text-white">
                <h3 className="text-lg md:text-xl font-extrabold leading-tight">{title}<br />{subtitle}</h3>
                <Button variant="outline" className="mt-2 border-white text-white px-3 py-1">Explore</Button>
            </div>
        </div>
    );
}

function TextureTile({ variant }: { variant: "diagonal" | "solid" }) {
    if (variant === "diagonal") {
        return (
            <div className="relative aspect-square rounded-md overflow-hidden border border-black/10 bg-white">
                <div className="absolute inset-0 bg-gray-50" />
                <div className="absolute -bottom-6 -left-6 w-[160%] h-14 rotate-[-15deg] bg-black" />
            </div>
        );
    }
    return (
        <div className="relative aspect-square rounded-md overflow-hidden border border-black/10 bg-gray-200">
            <div className="absolute inset-0 [background:repeating-linear-gradient(135deg,#e5e7eb_0,#e5e7eb_6px,transparent_6px,transparent_12px)] opacity-70" />
        </div>
    );
}

