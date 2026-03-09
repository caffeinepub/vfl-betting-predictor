import { Toaster } from "@/components/ui/sonner";
import { History, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { HistoryPage } from "./components/HistoryPage";
import { PredictPage } from "./components/PredictPage";

type Tab = "predict" | "history";

function AppHeader({ activeTab }: { activeTab: Tab }) {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
        <img
          src="/assets/generated/vfl-logo-transparent.dim_120x120.png"
          alt="VFL"
          className="w-9 h-9 rounded-xl object-cover"
        />
        <div>
          <h1 className="font-display font-black text-base text-foreground leading-none">
            VFL Predictor
          </h1>
          <p className="text-xs text-muted-foreground font-heading">
            {activeTab === "predict"
              ? "Premier League • Score Predictor"
              : "Saved Bets • History"}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-green" />
          <span className="text-xs font-heading text-primary font-semibold">
            LIVE
          </span>
        </div>
      </div>
    </header>
  );
}

function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="flex max-w-lg mx-auto">
        <button
          type="button"
          data-ocid="nav.predict_tab"
          onClick={() => onTabChange("predict")}
          className={[
            "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200",
            activeTab === "predict"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          <div className="relative">
            <Zap
              className={[
                "w-5 h-5 transition-all duration-200",
                activeTab === "predict"
                  ? "fill-primary stroke-primary"
                  : "fill-none",
              ].join(" ")}
            />
            {activeTab === "predict" && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -inset-1 rounded-full bg-primary/15"
              />
            )}
          </div>
          <span className="text-xs font-heading font-semibold">Predict</span>
        </button>

        <button
          type="button"
          data-ocid="nav.history_tab"
          onClick={() => onTabChange("history")}
          className={[
            "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200",
            activeTab === "history"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          <div className="relative">
            <History
              className={[
                "w-5 h-5 transition-all duration-200",
                activeTab === "history" ? "stroke-primary" : "",
              ].join(" ")}
            />
            {activeTab === "history" && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -inset-1 rounded-full bg-primary/15"
              />
            )}
          </div>
          <span className="text-xs font-heading font-semibold">History</span>
        </button>
      </div>
      {/* iOS safe area */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("predict");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader activeTab={activeTab} />

      <main className="flex-1 overflow-y-auto max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "predict" ? -15 : 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "predict" ? 15 : -15 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="min-h-full"
          >
            {activeTab === "predict" ? <PredictPage /> : <HistoryPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.16 0.01 220)",
            border: "1px solid oklch(0.28 0.015 220)",
            color: "oklch(0.97 0.005 80)",
          },
        }}
      />

      {/* Footer */}
      <footer className="hidden">
        {/* Attribution included but hidden behind nav */}
        <p>
          © {new Date().getFullYear()} Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
