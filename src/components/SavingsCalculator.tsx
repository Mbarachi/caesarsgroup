import { useState } from "react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "../components/ui/button"
import { motion } from "framer-motion"

export default function SavingsCalculator() {
  const [bill, setBill] = useState<number | undefined>()
  const [roofSize, setRoofSize] = useState<number | undefined>()
  const [sunlight, setSunlight] = useState<string>("")
  const [savings, setSavings] = useState<number | null>(null)

  const calculateSavings = () => {
    if (!bill || !roofSize || !sunlight) return
    // Basic mock logic (you can connect real API or calculation later)
    const multiplier =
      sunlight === "full" ? 0.5 : sunlight === "partial" ? 0.35 : 0.2
    const estimate = bill * multiplier
    setSavings(Math.round(estimate * 12))
  }

  return (
    <main className="flex-grow container mx-auto px-6 py-12 md:py-20 flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Calculate Your Potential Savings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            See how much you could save by switching to solar energy.
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-background-light dark:bg-background-dark/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800"
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6"
          >
            {/* Monthly Bill */}
            <div>
              <Label htmlFor="bill" className="mb-2 block">
                Average Monthly Electricity Bill (₦)
              </Label>
              <Input
                id="bill"
                type="number"
                placeholder="e.g., 50000"
                value={bill || ""}
                onChange={(e) => setBill(Number(e.target.value))}
                className="p-4 text-base"
              />
            </div>

            {/* Roof Size */}
            <div>
              <Label htmlFor="roof-size" className="mb-2 block">
                Roof Size (sq m)
              </Label>
              <Input
                id="roof-size"
                type="number"
                placeholder="e.g., 185"
                value={roofSize || ""}
                onChange={(e) => setRoofSize(Number(e.target.value))}
                className="p-4 text-base"
              />
            </div>

            {/* Sunlight */}
            <div>
              <Label htmlFor="sunlight" className="mb-2 block">
                Sunlight Exposure
              </Label>
              <Select onValueChange={setSunlight}>
                <SelectTrigger id="sunlight" className="p-4 text-base">
                  <SelectValue placeholder="Select your sunlight exposure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Sun</SelectItem>
                  <SelectItem value="partial">Partial Sun</SelectItem>
                  <SelectItem value="shaded">Mostly Shaded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Button */}
            <div className="pt-4">
              <Button
                type="button"
                onClick={calculateSavings}
                className="w-full py-4 text-base font-semibold flex items-center justify-center gap-2"
              >
                <span>Calculate Savings</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  />
                </svg>
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Result Section */}
        {savings !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Estimated Savings
            </h2>
            <div className="bg-primary/10 dark:bg-primary/20 p-8 rounded-xl inline-block">
              <p className="text-sm text-primary font-medium">Annual Savings</p>
              <p className="text-5xl font-bold text-primary mt-2">
                ₦{savings.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 max-w-md mx-auto">
              This is an estimate based on your inputs. Actual savings may vary depending on your
              energy consumption and solar system configuration.
            </p>
          </motion.div>
        )}
      </div>
    </main>
  )
}
