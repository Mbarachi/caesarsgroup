import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Menu } from "lucide-react";
import logo from "../assets/caesar_white.svg";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/20 px-8 py-4 bg-white dark:bg-background-dark">
      {/* Logo Section */}
      <div className="flex items-center gap-2 text-gray-800 dark:text-white cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo}
          alt="Caesar Energy Logo"
          className="h-14 mr-1"
          loading="lazy"
        />
        <h2 className="text-sm sm:text-base md:text-lg font-bold brand-serif uppercase tracking-wide leading-tight">Caesars Energy Services</h2>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
        <nav className="flex items-center gap-6">
          {[
            { label: "Home", to: "/" },
            { label: "About", to: "/about" },
            { label: "Services", to: "/services" },
            { label: "Shop", to: "/shop" },
            // { label: "Team", to: "/team" },
            { label: "Contact", to: "/contact" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button className="bg-primary hover:bg-primary/90 font-bold text-white rounded-[0.5rem]" onClick={() => navigate("/savings-calculator")}>
          Savings Calculator
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-end flex-1">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="transition-transform">
              <Menu className="h-7 w-7 text-primary scale-x-110" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" open={open} className="bg-white dark:bg-background-dark">
            <div className="flex flex-col gap-6 mt-10">
              {[
                { label: "Home", to: "/" },
                { label: "About", to: "/about" },
                { label: "Services", to: "/services" },
                { label: "Shop", to: "/shop" },
                // { label: "Team", to: "/team" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button className="bg-primary hover:bg-primary/90 font-bold text-white w-full" onClick={() => { setOpen(false); navigate('/savings-calculator'); }}>
                Savings Calculator
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;