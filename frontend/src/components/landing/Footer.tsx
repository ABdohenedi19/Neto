import { motion } from "framer-motion";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* TOP */}
        <div className="flex flex-col justify-between gap-12 sm:flex-row">
          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <img src="/favicon.svg" alt="Neto logo" className="h-10 w-10" />
            <span className="text-lg font-semibold text-slate-900">Neto</span>
          </motion.div>

          {/* LINKS */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {[
              {
                title: "About",
                links: ["Company", "Careers"],
              },
              {
                title: "Follow us",
                links: ["Github", "Discord"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms & Conditions"],
              },
            ].map((group, i) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  {group.title}
                </h3>

                <ul className="mt-4 space-y-3">
                  {group.links.map((link, idx) => (
                    <motion.li
                      key={link}
                      custom={idx}
                      variants={linkVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                    >
                      <a
                        href="#"
                        className="text-sm text-slate-600 transition hover:text-primary"
                      >
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 h-px w-full bg-slate-200" />

        {/* BOTTOM */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Neto. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {[BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble].map(
              (Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-slate-500 transition hover:text-primary"
                >
                  <Icon size={18} />
                </motion.a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
