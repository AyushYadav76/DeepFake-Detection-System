
import { ArrowRight, ShieldCheck, ScanFace } from "lucide-react";

function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-6 py-24 md:py-32"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl text-center">

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          <ShieldCheck size={16} />
          AI-Powered Video Authentication
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          Detect Deepfakes.
          <br />
          <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Protect Digital Trust.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
          Analyze videos using deep learning and advanced facial
          analysis. DeepfakeShield examines facial frames to identify
          potentially manipulated content.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#analyze"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Analyze a Video
            <ArrowRight size={19} />
          </a>

          <a
            href="#about"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <ScanFace size={19} />
            How It Works
          </a>
        </div>

        <p className="mt-8 text-xs tracking-wide text-slate-500">
          REAL / FAKE CLASSIFICATION • EFFICIENTNET-B0 • RETINAFACE
        </p>

      </div>
    </section>
  );
}

export default Hero;
