import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Team } from "../backend.d";
import { useGetTeams } from "../hooks/useQueries";
import {
  type PredictionResult,
  generatePrediction,
} from "../utils/predictionAlgorithm";
import { ResultModal } from "./ResultModal";
import { TeamCard } from "./TeamCard";

type Step = "home" | "away";

export function PredictPage() {
  const { data: teams, isLoading, error } = useGetTeams();
  const [step, setStep] = useState<Step>("home");
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const sortedTeams = teams
    ? [...teams].sort((a, b) => Number(a.position) - Number(b.position))
    : [];

  function handleHomeSelect(team: Team) {
    setHomeTeam(team);
    setAwayTeam(null);
    setStep("away");
  }

  function handleAwaySelect(team: Team) {
    setAwayTeam(team);
  }

  function handleGenerate() {
    if (!homeTeam || !awayTeam) return;
    const prediction = generatePrediction(homeTeam, awayTeam);
    setResult(prediction);
    setShowResult(true);
  }

  function handleRegenerate() {
    if (!homeTeam || !awayTeam) return;
    const prediction = generatePrediction(homeTeam, awayTeam);
    setResult(prediction);
  }

  function handleReset() {
    setStep("home");
    setHomeTeam(null);
    setAwayTeam(null);
    setResult(null);
    setShowResult(false);
  }

  const awayTeams = sortedTeams.filter((t) => t.name !== homeTeam?.name);

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header Section */}
      <div className="px-4 pt-6 pb-4">
        <div className="field-pattern rounded-2xl p-5 border border-border relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">
              Match Predictor
            </h1>
            <p className="text-sm text-muted-foreground">
              Select teams to generate an AI-powered score prediction
            </p>

            {/* Matchup Banner */}
            <AnimatePresence mode="wait">
              {homeTeam && (
                <motion.div
                  key="matchup"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 flex items-center gap-3"
                >
                  <div className="flex-1 text-center">
                    <p className="font-display font-bold text-primary text-sm leading-tight">
                      {homeTeam.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">HOME</p>
                  </div>
                  <div className="text-lg font-display font-bold text-muted-foreground">
                    VS
                  </div>
                  <div className="flex-1 text-center">
                    {awayTeam ? (
                      <>
                        <p className="font-display font-bold text-accent text-sm leading-tight">
                          {awayTeam.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          AWAY
                        </p>
                      </>
                    ) : (
                      <p className="font-display text-sm text-muted-foreground italic">
                        Select away...
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* decorative corner */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Step tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 bg-card rounded-xl p-1 border border-border">
          <button
            type="button"
            onClick={() => setStep("home")}
            className={[
              "flex-1 py-2 px-3 rounded-lg text-sm font-heading font-semibold transition-all duration-200",
              step === "home"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            1. Home Team
            {homeTeam && <span className="ml-1.5 text-xs opacity-70">✓</span>}
          </button>
          <button
            type="button"
            onClick={() => homeTeam && setStep("away")}
            disabled={!homeTeam}
            className={[
              "flex-1 py-2 px-3 rounded-lg text-sm font-heading font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
              step === "away"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            2. Away Team
            {awayTeam && <span className="ml-1.5 text-xs opacity-70">✓</span>}
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="px-4 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: step === "away" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === "away" ? -20 : 20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {step === "home" ? "Select Home Team" : "Select Away Team"}
              </h2>
              {step === "away" && (
                <p className="text-xs text-muted-foreground">
                  {awayTeams.length} teams
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 12 }, (_, i) => `skeleton-${i}`).map(
                  (id) => (
                    <Skeleton key={id} className="h-[160px] rounded-xl" />
                  ),
                )}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-destructive font-heading">
                  Failed to load teams
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please try again later
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {(step === "home" ? sortedTeams : awayTeams).map(
                  (team, index) => (
                    <TeamCard
                      key={team.name}
                      team={team}
                      isSelected={
                        step === "home"
                          ? homeTeam?.name === team.name
                          : awayTeam?.name === team.name
                      }
                      onClick={() =>
                        step === "home"
                          ? handleHomeSelect(team)
                          : handleAwaySelect(team)
                      }
                      data-ocid={
                        step === "home"
                          ? `predict.home_team_select.item.${index + 1}`
                          : `predict.away_team_select.item.${index + 1}`
                      }
                    />
                  ),
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Generate Button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="flex gap-2 max-w-lg mx-auto">
          {homeTeam && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="shrink-0 border-border text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          <Button
            data-ocid="predict.generate_button"
            className="flex-1 h-14 text-base font-display font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-40"
            disabled={!homeTeam || !awayTeam}
            onClick={handleGenerate}
          >
            <Zap className="w-5 h-5 mr-2" />
            Generate Prediction
          </Button>
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && result && homeTeam && awayTeam && (
          <ResultModal
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            result={result}
            onClose={() => setShowResult(false)}
            onRegenerate={handleRegenerate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
