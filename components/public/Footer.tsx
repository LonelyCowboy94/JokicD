import Link from "next/link"
import { Linkedin, Github, Mail } from "lucide-react"

const Footer = () => {
  return (
     <footer className="py-12 px-6 border-t border-white/5 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} JOKIC DEV. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/LonelyCowboy94"
              target="_blank"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Github size={20} />
            </Link>
            <Link
              href="#"
              target="_blank"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </Link>
            <a
              href="mailto: nikola.jokic994@yahoo.co.uk"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </footer>
  )
}

export default Footer