import ResultsPanel from "./ResultsPanel";
import HistoryPanel from "./HistoryPanel";
import { useRef, useState } from "react";
import {
  Upload,
  FileVideo,
  X,
  LoaderCircle,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function UploadPanel() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "video/mp4",
      "video/avi",
      "video/quicktime",
      "video/x-matroska",
      "video/x-msvideo",
    ];

    const allowedExtensions = [".mp4", ".avi", ".mov", ".mkv"];
    const extension = selectedFile.name
      .slice(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (
      !allowedTypes.includes(selectedFile.type) &&
      !allowedExtensions.includes(extension)
    ) {
      setError("Please select an MP4, AVI, MOV, or MKV video.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setResult(null);
  };


  const handleDrop = (event) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (!droppedFile) return;

    const allowedExtensions = [".mp4", ".avi", ".mov", ".mkv"];

    const extension = droppedFile.name
      .slice(droppedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError("Please drop an MP4, AVI, MOV, or MKV video.");
      return;
    }

    setFile(droppedFile);
    setError("");
    setResult(null);
  };


  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a video first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/analyze-video`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Video analysis failed.");
      }

      setResult(data.result);

      setHistory((previousHistory) => [
        {
            ...data.result,
            id: `${Date.now()}-${Math.random()}`,
            video_name: file.name,
            analyzedAt: new Date().toLocaleString(),
        },
        ...previousHistory,
      ]);
    } catch (err) {
      setError(
        err.message || "Unable to connect to DeepfakeShield API."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section id="analyze" className="px-6 py-20">
      <div className="mx-auto max-w-4xl">

        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Analyze Your Video
          </h2>

          <p className="mt-4 text-slate-400">
            Upload a video and let our AI model examine its facial content.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#101827] p-6 shadow-2xl sm:p-10">

          {/* Upload Area */}
          {!file ? (
            
            <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-700 bg-[#0b1220] px-6 py-16 text-center transition hover:border-blue-500 hover:bg-blue-500/5"
            >

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
                <Upload size={32} className="text-blue-400" />
              </div>

              <h3 className="text-lg font-semibold text-white">
                Click to upload your video
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Select a video from your device
              </p>

              <p className="mt-5 text-xs text-slate-500">
                Supported formats: MP4, AVI, MOV, MKV
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="flex min-w-0 items-center gap-4">
                <FileVideo size={35} className="shrink-0 text-blue-400" />

                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                onClick={removeFile}
                disabled={loading}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                aria-label="Remove video"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".mp4,.avi,.mov,.mkv,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Error Message */}
          {error && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoaderCircle size={20} className="animate-spin" />
                Analyzing Video...
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                Analyze Video
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Powered by RetinaFace and EfficientNet-B0
          </p>

          {/* Analysis Result */}
          {/* Analysis Result */}
            {result && <ResultsPanel result={result} />}
            <HistoryPanel history={history} />
        </div>
      </div>
    </section>
  );
}

export default UploadPanel;
