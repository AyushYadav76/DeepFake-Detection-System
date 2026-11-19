
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadPanel from "./components/UploadPanel";

function App() {
  return (
    <div className="min-h-screen bg-[#080d19] text-white">

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Video Upload and Analysis */}
      <UploadPanel />

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center">
        <p className="text-sm text-slate-400">
          © 2026 DeepfakeShield. AI-Powered Video Deepfake Detection.
        </p>

        <p className="mt-2 text-xs text-slate-600">
          Built using React, FastAPI, PyTorch and EfficientNet-B0.
        </p>
      </footer>

    </div>
  );
}

export default App;
