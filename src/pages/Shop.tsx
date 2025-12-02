import ProductShowcase from "../components/ProductShowcase";
import { useNavigate } from "react-router-dom";
import canadianSolarImg from "../assets/canadian_solar.jpeg";
import canadianSolarImg2 from "../assets/canadian_solar_.jpeg";

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
        "https://images.unsplash.com/photo-1583430707692-5def69dc47a2?q=80&w=1200&auto=format&fit=crop",
      ],
      features: ["Smart MPPT", "Remote monitoring", "Seamless changeover", "Low-noise"],
      price: "₦—",
    },
    {
      title: "Monocrystalline Solar Panel 550W",
      subtitle: "High efficiency • Tier-1 cells",
      images: [
        "https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508514177221-84f61405d2b3?q=80&w=1200&auto=format&fit=crop",
      ],
      features: ["Anti-PID", "Hail-resistant", "25-year warranty"],
      price: "₦—",
    },
    {
      title: "Lithium Battery 5kWh",
      subtitle: "BMS • 6000 cycles",
      images: [
        "https://images.unsplash.com/photo-1614729939124-266b0f84b060?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580727181890-6aa2ae0b4c3e?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1614729939106-6b3d1fe6b6b1?q=80&w=1200&auto=format&fit=crop",
      ],
      features: ["Rack/Wall mount", "Fast charge", "Safe LFP chemistry"],
      price: "₦—",
    },
  ];

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
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
