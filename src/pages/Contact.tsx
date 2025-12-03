import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function Contact() {
  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Contact Us</h2>
          <p className="mt-4 text-lg text-black/60">
            We're here to help. Reach out to us with any questions or inquiries, and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-background-light p-8 rounded-xl shadow-lg">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
              </div>

              <div>
                <Button type="submit" className="w-full font-bold">
                  Send Message
                </Button>
              </div>
            </form>
          </div>

          {/* Contact details + Map */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Our Contact Information</h3>
              <div className="space-y-3 text-black/80">
                <p className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1 h-5 w-5" />
                  <span>Address: 123 Energy Lane, Solar City, CA 91234</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="text-primary h-5 w-5" />
                  <span>Phone: +234 8164046861, +353830095716</span>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="text-primary h-5 w-5" />
                  <span>Email: info@caesarsgroup.ng</span>
                </p>
              </div>
            </div>

            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDllv2VwPigquMjV_pNhYW1iOPndGVmPAs12N1Qzi8JBtofyqjpPUB4u5XT3JwqgtFGdCmYnnXuNorKildOJeXo2jdH9zulCcygc2-bwVYGuJmuKIyuHmTT-2TbKBCHm7gs6MtWSf8dmE4LPOKmUMpayppRUODPgoR2yGBokp5Cfbw13fGCpXDRno3vM7tpcnGPcAZbHjwxnaevOG4y0TtHoCEL8Q8zCHTCPsjeXk3hr14IjEre3T3JMM9LU309TzgdUgPU_OXVg6W9")',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}