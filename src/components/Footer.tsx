import { Separator } from "./ui/separator"
import darkLogo from "../assets/caesar_footer-logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background-light/50 dark:bg-background-dark/50 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <img src={darkLogo} className="w-[5rem]" alt="Caesars Energy Logo" />
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 Caesars Energy. All rights reserved.
            </span>/
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <Link
              to=""
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Separator orientation="vertical" className="h-4 hidden md:block" />
            <Link
              to=""
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Separator orientation="vertical" className="h-4 hidden md:block" />
            <Link
              to="/contact"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer