import { motion } from "framer-motion"
import { Button } from "./ui/button"
import heroImage from "../assets/solar_hero.jpg"
import { useNavigate } from "react-router-dom"

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="@container">
      <div
        className="relative flex min-h-[480px] flex-col items-start justify-end overflow-hidden rounded-xl bg-cover bg-center p-8 text-white @[480px]:p-12"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%),
            url(${heroImage})
          `,
        }}
      >
        {/* Animate the hero text */}
        <motion.div
          className="flex max-w-2xl flex-col gap-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-2xl @[480px]:text-5xl font-extrabold tracking-tight @[480px]:tracking-tighter leading-tight flex items-baseline gap-2 whitespace-nowrap @[480px]:whitespace-normal">
            {/* Keep the word 'POWER' together with custom O */}
            <span className="inline-flex items-baseline whitespace-nowrap">
              <span className="uppercase leading-none">P</span>
              <span aria-hidden className="inline-flex items-baseline justify-center align-baseline leading-none">
                <svg
                  className="inline-block h-[1em] w-[1em] align-baseline translate-y-[0.06em]"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" />
                  <path
                    d="M36 10 L22 34 H32 L28 54 L46 28 H36 L40 10 Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="uppercase leading-none">WER</span>
            </span>
            <span className="uppercase leading-none">THE FUTURE WITH US</span>
          </h1>

          <p className="text-base font-normal text-white/90 @[480px]:text-lg">
            Caesars energy services is committed to promoting renewable energy solutions to the everyday man with
            leading innovative projects that power a greener future with solar, bio energy and other cost
            effective off-grid solutions.
          </p>
        </motion.div>

        {/* Animate the button separately for a nice stagger effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button
            size="lg"
            className="mt-6 bg-primary text-white hover:bg-primary/90"
            onClick={() => navigate("/about")}
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero