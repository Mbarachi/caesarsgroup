import { MapPin, Phone, Mail, Instagram, Linkedin } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function Contact() {
  const [state, handleSubmit] = useForm("xeoyrzze");
  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Contact Us</h2>
          <p className="mt-4 text-lg text-black/60">
            We're here to help. Reach out to us with any questions or inquiries, and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-background-light p-8 rounded-xl shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="text-black/80">Name</Label>
                <div className="mt-1">
                  <Input id="name" name="name" placeholder="Your Name" autoComplete="name" />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-black/80">Email</Label>
                <div className="mt-1">
                  <Input id="email" name="email" type="email" placeholder="Your Email" autoComplete="email" required />
                </div>
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>

              <div>
                <Label htmlFor="subject" className="text-black/80">Subject</Label>
                <div className="mt-1">
                  <Input id="subject" name="subject" placeholder="How can we help?" />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-black/80">Message</Label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    className="block w-full rounded-md border border-black/10 bg-white px-3 py-2 text-base placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    required
                  />
                </div>
                <ValidationError prefix="Message" field="message" errors={state.errors} />
              </div>

              <div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-bold rounded-full text-base shadow-md shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 transition-transform"
                  disabled={state.submitting}
                >
                  {state.submitting ? "Sending…" : "Send Message"}
                </Button>
              </div>
              {state.succeeded && (
                <div className="pt-4">
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                    <p className="font-semibold">Thanks! Your message has been sent.</p>
                    <p className="text-sm">We'll get back to you shortly at the email provided.</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Contact details + Map */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Our Contact Information</h3>
              <div className="space-y-3 text-black/80">
                {/* <p className="flex items-center gap-3">
                  <MapPin className="text-primary h-5 w-5" />
                  <span>Headquarters: Dublin, Ireland</span>
                </p> */}
                <p className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1 h-5 w-5" />
                  <span>Address: 5th Avenue, K close, Festac Town, Lagos Nigeria</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="text-primary h-5 w-5" />
                  <span>Phone: +234 816 404 6861, +353 83 009 5716</span>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="text-primary h-5 w-5" />
                  <span>Email: info@caesarsgroup.ng</span>
                </p>
              </div>
              {/* Socials */}
              <div className="pt-2">
                <div className="text-sm font-semibold text-black/70 mb-2">Follow us</div>
                <div className="flex items-center gap-3">
                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/company/caesar-rise-group"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our LinkedIn"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm hover:opacity-90 transition"
                    style={{ backgroundColor: "#0A66C2" }}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  {/* Instagram (gradient) */}
                  <a
                    href="https://www.instagram.com/caesrsenergyservices?igsh=cnZrbXJwdWFxaGpl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our Instagram"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm hover:opacity-90 transition"
                    style={{
                      background:
                        "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)",
                    }}
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/353830095716"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with us on WhatsApp"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm hover:opacity-90 transition"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Caesars Group Location"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.432260715632!2d3.2760078752405195!3d6.466797493524887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b88c747687847%3A0xdb617649daa5c8cc!2s5th%20Avenue%2C%20K%20Cl%2C%20Festac%20Town%2C%20Festac%201%20102102%2C%20Lagos!5e0!3m2!1sen!2sng!4v1764805387033!5m2!1sen!2sng"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}