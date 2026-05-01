import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = "Home" | "Features" | "Pricing" | "Footer";

function Navbar() {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [active, setActive] = useState<NavItem>("Home");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "#hero" },

    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Footer", href: "#footer" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: scrolled
          ? "rgba(255,255,255,0.98)"
          : "rgba(255,255,255,1)",
        boxShadow: scrolled
          ? "0 8px 25px rgba(0,0,0,0.08)"
          : "0 0px 0px rgba(0,0,0,0)",
        height: scrolled ? 64 : 72,
      }}
      transition={{ duration: 0.25 }}
      className="fixed top-0 z-50 w-full border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src="/favicon.svg"
            alt="logo"
            className="h-9 w-9 object-contain"
          />
          <span className="text-lg font-semibold text-slate-900">Neto</span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                setActive(link.name as NavItem);
                document
                  .querySelector(link.href)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative text-sm text-slate-700 transition hover:text-primary"
            >
              {link.name}
              {active === link.name && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 -bottom-1 h-[2px] w-full bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* CTA */}
          <motion.button
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/login")}
            className="hidden md:block rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg"
          >
            Get Started
          </motion.button>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setMobileMenuIsOpen((prev) => !prev)}
          >
            {mobileMenuIsOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuIsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-4 pb-4"
          >
            <div className="mt-2 rounded-2xl bg-white shadow-xl p-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    setActive(link.name as NavItem);
                    setMobileMenuIsOpen(false);
                    document
                      .querySelector(link.href)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block w-full text-left text-sm text-slate-700"
                >
                  {link.name}
                </button>
              ))}

              <button
                onClick={() => navigate("/login")}
                className="w-full mt-2 rounded-lg bg-primary py-2 text-white"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
