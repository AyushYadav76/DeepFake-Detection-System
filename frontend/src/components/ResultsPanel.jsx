
import {
  CheckCircle2,
  AlertTriangle,
  Activity,
  ScanFace,
  Layers3,
  ShieldCheck,
} from "lucide-react";

function ResultsPanel({ result }) {
  if (!result) return null;

  const isFake = result.prediction === "FAKE";
  const fakeProbability = Number(result.fake_probability) * 100;
  const threshold = Number(result.threshold) * 100;

  return (
    <section className="mt-8 space-y-6">
      {/* Main prediction */}
      <div className="rounded-2xl border border-white/10 bg-[#111b2e] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Analysis Results
          </h2>
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
            Analysis Complete
          </span>
        </div>

        <div
          className={`flex flex-col items-center rounded-xl border p-6 text-center ${
            isFake
              ? "border-red-500/30 bg-red-500/5"
              : "border-emerald-500/30 bg-emerald-500/5"
          }`}
        >
          {isFake ? (
            <AlertTriangle className="mb-3 h-12 w-12 text-red-400" />
          ) : (
            <CheckCircle2 className="mb-3 h-12 w-12 text-emerald-400" />
          )}

          <p className="text-sm text-slate-400">Model Prediction</p>

          <h3
            className={`mt-1 text-4xl font-bold ${
              isFake ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {result.prediction}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            {isFake
              ? "The model detected signs consistent with manipulated video."
              : "The model did not detect strong signs of manipulation."}
          </p>
        </div>

        {/* Fake probability */}
        <div className="mt-6">
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-slate-300">
              Fake Probability
            </span>
            <span className="font-semibold text-white">
              {fakeProbability.toFixed(2)}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-red-500 transition-all duration-700"
              style={{
                width: `${Math.min(100, Math.max(0, fakeProbability))}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>0% Fake</span>
            <span>100% Fake</span>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Decision threshold: {threshold.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Analysis statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Layers3}
          label="Frames Extracted"
          value={result.frames_extracted ?? 0}
        />
        <StatCard
          icon={ScanFace}
          label="Faces Detected"
          value={result.faces_detected ?? 0}
        />
        <StatCard
          icon={Activity}
          label="Frames Analyzed"
          value={result.frames_analyzed ?? 0}
        />
      </div>

      {/* Frame-wise predictions */}
      {result.frame_predictions?.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#111b2e] p-6">
          <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
            <Activity className="h-5 w-5 text-blue-400" />
            Frame-wise Analysis
          </h3>

          <div className="space-y-4">
            {result.frame_predictions.map((frame, index) => {
              const probability =
                Number(frame.fake_probability) * 100;

              return (
                <div key={index}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-300">
                      Frame {index + 1}
                    </span>
                    <span className="text-slate-400">
                      {probability.toFixed(2)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        probability >= threshold
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, probability)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Each bar represents the model's estimated fake probability
            for an individual analyzed frame.
          </p>
        </div>
      )}

      {/* Model information */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
        <div>
          <h4 className="text-sm font-semibold text-white">
            About this analysis
          </h4>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            DeepfakeShield uses an EfficientNet-B0 deep learning model
            to analyze detected faces across video frames. The result
            is a model estimate, not proof of authenticity. Accuracy
            may vary with video quality and content.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111b2e] p-5">
      <Icon className="mb-3 h-6 w-6 text-blue-400" />
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

export default ResultsPanel;
