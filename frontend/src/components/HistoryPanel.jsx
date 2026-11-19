
import { History, Video, Clock, ShieldCheck, AlertTriangle } from "lucide-react";

function HistoryPanel({ history }) {
  return (
    <section id="history" className="mt-10">
      <div className="mb-5 flex items-center gap-3">
        <History className="h-6 w-6 text-blue-400" />
        <div>
          <h2 className="text-xl font-bold text-white">
            Analysis History
          </h2>
          <p className="text-sm text-slate-400">
            Your recently analyzed videos
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#111b2e] p-8 text-center">
          <Video className="mx-auto mb-3 h-9 w-9 text-slate-500" />
          <p className="font-medium text-slate-300">
            No analysis history yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Your analyzed videos will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const isFake = item.prediction === "FAKE";

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#111b2e] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <Video className="h-5 w-5 text-blue-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {item.video_name}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {item.analyzedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-sm">
                    <p className="text-slate-500">Fake probability</p>
                    <p className="mt-1 font-semibold text-white">
                      {(Number(item.fake_probability) * 100).toFixed(2)}%
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${
                      isFake
                        ? "bg-red-500/10 text-red-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {isFake ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    {item.prediction}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default HistoryPanel;
