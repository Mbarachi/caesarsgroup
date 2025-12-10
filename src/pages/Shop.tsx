import ProductShowcase from "../components/ProductShowcase";
import { useNavigate } from "react-router-dom";
import canadianSolarImg from "../assets/canadian_solar.jpeg";
import canadianSolarImg2 from "../assets/canadian_solar_.jpeg";
import canadianSolarImg3 from "../assets/canadian_solar3.jpeg";
import deepCycleImg from "../assets/Lithium.jpeg";
import teslaImg from "../assets/tesla.jpeg";
import EVImage from "../assets/EV.jpeg";
import EVImage2 from "../assets/EV_.jpeg";
import streetSweepersImg from "../assets/sweepers.jpeg";
import streetSweepersImg1 from "../assets/sweepers_.jpeg";
import streetSweepersImg2 from "../assets/sweepers__.jpeg";
import solarLight from "../assets/solar_light.jpeg";
import solarLight1 from "../assets/solar_light_.jpeg";
import jinkoImg from "../assets/jinko_panel.jpeg";
import canadianPanelImg from "../assets/canadian_panel.jpg";

export default function Shop() {
    const navigate = useNavigate();

    // Replace placeholder images with real product images from /public or /src/assets
    const products = [
        {
            title: "Canadian solar All in one Inverter 9.9 kva",
            subtitle: "Scalable to 17kwh storage",
            images: [
                canadianSolarImg,
                canadianSolarImg2,
                canadianSolarImg3
            ],
            features: ["Smart MPPT", "Remote monitoring", "Seamless changeover", "Low-noise"],
            price: "₦—",
        },
        {
            title: "Deep cycle batteries (12v, 200/220amps)",
            subtitle: "Available in lithium and Tubular forms",
            images: [
                deepCycleImg,
            ],
            features: ["Anti-PID", "Hail-resistant", "6 years warranty"],
            price: "₦—",
        },
        {
            title: "Hybrid Tesla power wall 3 Inverter (11.5Kwh)",
            subtitle: "BMS • 6000 cycles",
            images: [
                teslaImg
            ],
            features: ["Rack/Wall mount", "Fast charge", "Safe LFP chemistry"],
            price: "₦—",
        },
        {
            title: "Electric Vehicle",
            subtitle: "Level 2 Home Charger",
            images: [
                EVImage,
                EVImage2
            ],
            features: ["Fast Charging", "Smart App Control", "Universal Compatibility"],
            price: "₦—",
        },
        {
            title: "Street sweepers",
            subtitle: "Full hydraulic technology. Cheap and affordable",
            images: [
                streetSweepersImg,
                streetSweepersImg1,
                streetSweepersImg2
            ],
            features: ["Wide Range", "Affordable Prices", "Reliable Quality"],
            price: "₦—",    
        },
        {
            title: "Solar Street Light",
            subtitle: "available in both A and P series",
            images: [
                solarLight,
                solarLight1,
            ],
            features: ["Lithium ion", "Energy Efficient", "Installation services"],
            price: "₦—",
        },
        {
            title: "Jinko Solar Panels",
            subtitle: "High efficiency monocrystalline panels",
            images: [
                jinkoImg,
            ],
            features: ["Anti-PID", "Hail-resistant", "25-year warranty"],
            price: "₦—",
        },
        {
            title: "Canadian Solar Panels",
            subtitle: "650 watts mono crystalline panels",
            images: [
                canadianPanelImg,
            ],
            features: ["Custom Solutions", "Competitive Pricing", "Reliable Support"],
            price: "₦—",
        }
    ];

    return (
        <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Shop</h1>
                    <p className="mt-3 text-lg text-black/70">Explore our curated solar hardware — designed for Nigerian conditions and backed by trusted support.</p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-3">
                    {products.map((p) => (
                        <ProductShowcase
                            key={p.title}
                            title={p.title}
                            subtitle={p.subtitle}
                            images={p.images}
                            features={p.features}
                            price={p.price}
                            onEnquire={() => navigate('/contact')}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
