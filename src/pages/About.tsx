import aboutImage from "../assets/about_us.jpeg";
import { useEffect, useState } from "react";

const installationImages: string[] = (() => {
  try {
    const ctx = require.context(
      "../assets/installations",
      false,
      /\.(png|jpe?g|webp)$/i
    );
    return ctx
      .keys()
      .sort((a: string, b: string) => a.localeCompare(b, undefined, { numeric: true }))
      .map((key: string) => ctx<string>(key));
  } catch {
    return [];
  }
})();

const fallbackImages = [aboutImage];


export default function About() {
  const images = installationImages.length
    ? installationImages
    : fallbackImages;
  const [activeIndex, setActiveIndex] = useState(0);
  const [animateIn, setAnimateIn] = useState(true);

  useEffect(() => {
    setActiveIndex(0);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;

    const id = window.setInterval(() => {
      setAnimateIn(false);

      window.setTimeout(() => {
        setActiveIndex((i) => (i + 1) % images.length);
        window.setTimeout(() => setAnimateIn(true), 30);
      }, 350);
    }, 4500);

    return () => window.clearInterval(id);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const nextSrc = images[(activeIndex + 1) % images.length];
    const img = new Image();
    img.src = nextSrc;
  }, [activeIndex, images]);

  return (
    <main className="flex-grow">
      {/* Intro */}
      <section className="py-10 md:py-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900">About Caesars Energy Services</h2>
            <p className="mt-4 text-lg text-gray-600">
              Powering a greener future with innovative, cost effective off-grid and hybrid solar solutions for everyday people.
            </p>
          </div>
        </div>
      </section>

      {/* Story + Image */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <div className="prose prose-lg max-w-none text-gray-800">
                <p>
                  Caesars Energy Services, a subsidiary of Caesars Group, is a renewable energy power solutions company. 
                  We are dedicated to promoting renewable energy solutions to the everyday person with leading innovative projects that power a greener future using solar, bio energy, and other cost‑effective off‑grid & hybrid solutions.
                </p>
                <h3 className="text-2xl font-bold mt-8 text-gray-900">Our Mission</h3>
                <p>
                  Our mission is to empower individuals and organizations to embrace clean energy, reduce their carbon footprint, and achieve energy independence. We are committed to delivering high-quality, reliable, and cost-effective renewable energy solutions tailored to meet the unique needs of each client. We strive to be a trusted partner in the transition to a sustainable energy future.
                </p>
                <h3 className="text-2xl font-bold mt-8 text-gray-900">Our Values</h3>
                <ul className="space-y-2">
                  <li><strong>Sustainability:</strong> We are dedicated to promoting environmentally responsible practices and minimizing our impact on the planet.</li>
                  <li><strong>Customer Focus:</strong> We prioritize customer satisfaction and strive to exceed expectations in every interaction.</li>
                  <li><strong>Integrity:</strong> We operate with honesty, transparency, and ethical conduct in all our business dealings.</li>
                </ul>
              </div>
            </div>
            <div className="w-full h-80 sm:h-96 md:h-[30rem] lg:h-[34rem] rounded-xl overflow-hidden shadow-2xl lg:self-start">
              <img
                src={images[activeIndex]}
                alt={`Installation ${activeIndex + 1}`}
                className={`object-cover w-full h-full transform-gpu transition-all duration-700 ease-out ${
                  animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team + Community */}
      <section id="team" className="bg-primary/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg max-w-none text-gray-800">
              <h3 className="text-2xl font-bold text-gray-900">Our Team</h3>
              <p>
                Our team comprises experienced and certified engineers, technicians, project managers, and customer service professionals who are passionate about renewable energy. We foster a collaborative and inclusive work environment, where every team member is valued and empowered to contribute their expertise. Our collective knowledge and dedication ensure that we deliver exceptional results for our clients.
              </p>
            </div>
            <div className="prose prose-lg max-w-none text-gray-800">
              <h3 className="text-2xl font-bold text-gray-900">Community Involvement</h3>
              <p>
                We believe in giving back to the communities we serve. Caesars Energy Services actively supports local initiatives and organizations that promote environmental sustainability, education, and community development. We are proud to be a responsible corporate citizen and contribute to a better future for all.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}