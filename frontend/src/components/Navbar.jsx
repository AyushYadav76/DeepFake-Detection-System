
import { ShieldCheck, ExternalLink, Menu } from "lucide-react";

function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 bg-[#080d19]/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600/20 p-2">
            <ShieldCheck size={28} className="text-blue-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              Deepfake<span className="text-blue-400">Shield</span>
            </h1>
            <p className="text-xs text-slate-400">
              AI-Powered Video Detection
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-sm text-slate-300 transition hover:text-blue-400">
            Home
          </a>

          <a href="#analyze" className="text-sm text-slate-300 transition hover:text-blue-400">
            Analyze Video
          </a>

          <a href="#about" className="text-sm text-slate-300 transition hover:text-blue-400">
            About
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white sm:flex"
          >
            <ExternalLink size={17} />
            GitHub
          </a>

          <button className="text-slate-300 md:hidden" aria-label="Open navigation menu">
            <Menu size={25} />
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
