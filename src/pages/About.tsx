import aboutImage from "../assets/about_us.jpeg";


export default function About() {
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
                  <li><strong>Innovation:</strong> We continuously seek out new technologies and approaches to improve our products and services.</li>
                  <li><strong>Customer Focus:</strong> We prioritize customer satisfaction and strive to exceed expectations in every interaction.</li>
                  <li><strong>Integrity:</strong> We operate with honesty, transparency, and ethical conduct in all our business dealings.</li>
                  <li><strong>Excellence:</strong> We are committed to delivering the highest standards of quality and performance in all aspects of our work.</li>
                </ul>
              </div>
            </div>
            <div className="aspect-[4/3] lg:aspect-auto rounded-xl overflow-hidden shadow-2xl lg:self-end">
              <img
                src={aboutImage}
                alt="Solar panels on a roof"
                className="object-cover w-full h-full"
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