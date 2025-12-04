import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import ugoImg from "../assets/team/mgbemenna.jpg";
import danielaImg from "../assets/team/daniela.jpeg";
import firiImg from "../assets/team/firi.jpeg";
import mosesImg from "../assets/team/moses.jpeg";
import victorImg from "../assets/team/victor.jpg";

type Member = {
    id: number;
    name: string;
    role: string;
    bio?: string;
    photo: string;
};

const members: Member[] = [
    { id: 1, name: "Mgbemena Ugochukwu Michael", role: "Head, Engineering Operations & Business Development", bio: "Ugo is a seasoned Electrical and Electronics Engineer with over a decade of experience in power, telecommunications, renewable energy, and semiconductor industries. He has successfully delivered projects in both private and commercial renewable energy sectors in Nigeria & accross the continent.", photo: ugoImg },
    { id: 2, name: "Daniela Okafor", role: "Head, Energy policy & Financial strategy", bio: "Daniela is a Certified Public Accountant with over six years of experience in M&A, corporate finance, and business intelligence. Throughout her career, she has demonstrated a strong ability to translate complex financial and operational data into strategic insights that drive business performance and organizational growth.", photo: danielaImg },
    { id: 3, name: "Prince Barimene Firi ", role: "Head, Digital Marketing and creative services", bio: "Prince is a versatile professional with a diverse background spanning data analysis, real estate, and business consulting. With a Bachelor’s degree in Business Administration from Turkey & a Master's Degree from Beijing Normal University in China, Prince Barimene Firi has built a solid foundation in Digital marketing, and strategic consulting.", photo: firiImg },
    { id: 4, name: "Olabode Moses", role: "Lead Technician", bio: "Bode is an experienced Electrical technician with over a decade’s experience in small, medium & large scale energy projects. With safety & Quality as our top priority, His attention to detail has enabled him execute jobs in a timely and professional manner", photo: mosesImg },
    { id: 5, name: "Mbarachi Victor", role: "Head, Software Development", bio: "Victor is a skilled software engineer with expertise in both web and mobile application development. He simply solves real-life problems using technology.", photo: victorImg },
];

export default function Team() {
    const [active, setActive] = useState<Member | null>(null);
    const compact = members.length <= 5;

    return (
        <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-20">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Team</h1>
                    <p className="mt-3 text-lg text-black/70">Meet the people powering reliable solar — leadership, engineering, field ops, and customer success.</p>
                </div>

                {compact ? (
                    <div className="mt-10 grid grid-cols-3 gap-2">
                        <Tile member={members[0]} onClick={() => setActive(members[0])} />
                        <TextureTile variant="diagonal" />
                        <Tile member={members[1]} onClick={() => setActive(members[1])} />
                        <CtaTile title="AGENCY" subtitle="LEADERSHIP" tone="light" />
                        <Tile member={members[2]} onClick={() => setActive(members[2])} />
                        <CtaTile title="MEET THE" subtitle="TEAM" tone="solid" />
                        <Tile member={members[3]} onClick={() => setActive(members[3])} />
                        <TextureTile variant="solid" />
                        <Tile member={members[4]} onClick={() => setActive(members[4])} />
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {members.slice(0, 3).map((m) => (
                            <Tile key={m.id} member={m} onClick={() => setActive(m)} />
                        ))}
                        <TextureTile variant="diagonal" />
                        <TextureTile variant="solid" />
                        <Tile member={members[3]} onClick={() => setActive(members[3])} />
                        <Tile member={members[4]} onClick={() => setActive(members[4])} />
                        <Tile member={members[5]} onClick={() => setActive(members[5])} />
                        <Tile member={members[6]} onClick={() => setActive(members[6])} />
                        <CtaTile title="AGENCY" subtitle="LEADERSHIP" tone="light" />
                        <Tile member={members[7]} onClick={() => setActive(members[7])} />
                        <CtaTile title="MEET THE" subtitle="TEAM" tone="solid" />
                        {members.slice(8, 11).map((m) => (
                            <Tile key={m.id} member={m} onClick={() => setActive(m)} />
                        ))}
                        <TextureTile variant="diagonal" />
                    </div>
                )}
            </div>

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

function Tile({ member, onClick }: { member?: Member; onClick: () => void }) {
    return member ? (
        <button className="group relative aspect-square rounded-md overflow-hidden border border-black/10 bg-gray-100" onClick={onClick} aria-label={`View ${member.name}`}>
            <img src={member.photo} alt={member.name} className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0 transition" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition" />
            <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition">
                <div className="rounded bg-white/90 backdrop-blur-sm p-2 shadow">
                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.role}</p>
                </div>
            </div>
        </button>
    ) : (
        <TextureTile variant="solid" />
    );
}

function CtaTile({ title, subtitle, tone, onClick }: { title: string; subtitle: string; tone: "light" | "solid"; onClick?: () => void }) {
    if (tone === "light") {
        return (
            <button onClick={onClick} className="relative aspect-square rounded-md overflow-hidden border border-black/10 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300/40">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100" />
                <div className="relative z-10 h-full w-full flex flex-col items-center justify-center gap-1 text-center p-4">
                    <p className="text-orange-600 font-bold tracking-wide text-xs md:text-sm">{title}</p>
                    <h3 className="text-lg md:text-xl font-extrabold text-gray-900">{subtitle}</h3>
                    {/* <Button variant="outline" className="mt-2 border-orange-600 text-orange-600 px-3 py-1">View</Button> */}
                    {/* subtle chevron hint */}
                    <motion.span initial={{ x: 0, opacity: 0 }} whileHover={{ x: 4, opacity: 1 }} className="mt-1 text-orange-600">→</motion.span>
                </div>
            </button>
        );
    }
    return (
        <button onClick={onClick} className="relative aspect-square rounded-md overflow-hidden border border-black/10 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300/40">
            <div className="absolute inset-0 bg-orange-500" />
            <div className="absolute inset-0 opacity-0 hover:opacity-10 transition bg-white" />
            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center p-4 text-white">
                <h3 className="text-lg md:text-xl font-extrabold leading-tight">{title}<br />{subtitle}</h3>
                {/* <Button variant="outline" className="mt-2 border-white text-white px-3 py-1">Explore</Button> */}
                <motion.span initial={{ x: 0, opacity: 0 }} whileHover={{ x: 4, opacity: 1 }} className="mt-1">→</motion.span>
            </div>
        </button>
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

