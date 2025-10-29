import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export const ModeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    const handleToggle = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="relative overflow-hidden rounded-full transition-all duration-500 hover:scale-105"
        >
            <AnimatePresence mode="wait" initial={false}>
                {!isDark ? (
                    // 🌙 Show Moon in light mode (click to switch to dark)
                   <motion.div
  key="moon"
  initial={{ rotate: -90, scale: 0, opacity: 0 }}
  animate={{ rotate: 0, scale: 1, opacity: 1 }}
  exit={{ rotate: 90, scale: 0, opacity: 0 }}
  transition={{ duration: 0.4, ease: "easeInOut" }}
  className="flex items-center justify-center"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    className="h-6 w-6 drop-shadow-[0_0_12px_rgba(180,180,200,0.8)]"
  >
    <circle cx="32" cy="32" r="14" fill="url(#moon-gradient)" />
    <defs>
      <radialGradient id="moon-gradient" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#f0f0f5" />
        <stop offset="60%" stopColor="#b0b8c1" />
        <stop offset="100%" stopColor="#8a8f99" />
      </radialGradient>
    </defs>
  </svg>
</motion.div>



                ) : (
                    // ☀️ Show Sun in dark mode (click to switch to light)
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 64 64"
                            className="h-6 w-6"
                        >
                            <circle cx="32" cy="32" r="14" fill="url(#sun-gradient)" />
                            <defs>
                                <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#FFD93D" />
                                    <stop offset="70%" stopColor="#FFA500" />
                                    <stop offset="100%" stopColor="#FF8C00" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Halo Glow */}
            <motion.div
                key={`halo-${isDark ? "light" : "dark"}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: [0.8, 1.4, 1.1],
                    opacity: [0.6, 0.3, 0],
                }}
                transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className={`absolute inset-0 rounded-full blur-xl ${isDark
                    ? "bg-[#FFD54F]/40" // glowing gold halo for sun (dark mode)
                    : "bg-white/60" // soft white halo for moon (light mode)
                    }`}
            />

            {/* Background pulse */}
            <motion.div
                key={`pulse-${isDark ? "light" : "dark"}`}
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.05, 0.1, 0.05],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className={`absolute inset-0 rounded-full ${isDark ? "bg-[#fff8e1]/20" : "bg-white/20"
                    }`}
            />
        </Button>
    );
};