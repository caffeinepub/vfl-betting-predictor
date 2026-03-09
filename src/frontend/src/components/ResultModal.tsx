import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  Minus,
  RefreshCw,
  Save,
  Shield,
  TrendingDown,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Team } from "../backend.d";
import { useSavePrediction } from "../hooks/useQueries";
import type { PredictionResult } from "../utils/predictionAlgorithm";

interface ResultModalProps {
  homeTeam: Team;
  awayTeam: Team;
  result: PredictionResult;
  onClose: () => void;
  onRegenerate: () => void;
}

function VerdictBadge({ verdict }: { verdict: string }) {
  if (verdict === "Home Win") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-primary/20 text-primary border border-primary/30">
        <Trophy className="w-3.5 h-3.5" />
        Home Win
      </span>
    );
  }
  if (verdict === "Away Win") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-accent/20 text-accent border border-accent/30">
        <Trophy className="w-3.5 h-3.5" />
        Away Win
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-muted text-muted-foreground border border-border">
      <Minus className="w-3.5 h-3.5" />
      Draw
    </span>
  );
}

function RatingBar({
  value,
  max = 2.5,
  label,
}: { value: number; max?: number; label: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-28 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <span className="text-xs font-mono text-foreground w-10 text-right">
        {value.toFixed(2)}
      </span>
    </div>
  );
}

export function ResultModal({
  homeTeam,
  awayTeam,
  result,
  onClose,
  onRegenerate,
}: ResultModalProps) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const savePrediction = useSavePrediction();

  async function handleSave() {
    try {
      await savePrediction.mutateAsync({
        homeTeam: homeTeam.name,
        awayTeam: awayTeam.name,
        homeScore: BigInt(result.homeScore),
        awayScore: BigInt(result.awayScore),
        note,
      });
      setSaved(true);
      toast.success("Prediction saved successfully!");
    } catch {
      toast.error("Failed to save prediction");
    }
  }

  function handleRegenerate() {
    setSaved(false);
    onRegenerate();
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Sheet */}
      <motion.div
        className="relative z-10 bg-card rounded-t-3xl overflow-y-auto max-h-[92vh] pb-safe"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-5 pb-8 pt-2">
          {/* Match title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-xs font-heading font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              <Shield className="w-3 h-3" />
              <span>Prediction</span>
              <Shield className="w-3 h-3" />
            </div>

            {/* Score Display */}
            <motion.div
              className="flex items-center justify-center gap-4 mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", damping: 15 }}
            >
              <div className="flex-1 text-right">
                <p className="font-display text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                  HOME
                </p>
                <p className="font-display text-lg font-bold leading-tight text-foreground">
                  {homeTeam.name}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-background border border-border">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`home-${result.homeScore}`}
                    className="font-display font-black text-4xl score-glow text-primary leading-none"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {result.homeScore}
                  </motion.span>
                </AnimatePresence>
                <span className="font-display font-bold text-2xl text-muted-foreground">
                  -
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`away-${result.awayScore}`}
                    className="font-display font-black text-4xl accent-glow text-accent leading-none"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {result.awayScore}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex-1 text-left">
                <p className="font-display text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                  AWAY
                </p>
                <p className="font-display text-lg font-bold leading-tight text-foreground">
                  {awayTeam.name}
                </p>
              </div>
            </motion.div>

            {/* Verdict */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <VerdictBadge verdict={result.verdict} />
            </motion.div>
          </div>

          {/* Algorithm Reasoning */}
          <motion.div
            className="bg-background rounded-2xl border border-border p-4 mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-heading font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Algorithm Breakdown
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-card rounded-xl p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1 font-heading">
                    Home Expected Goals
                  </p>
                  <p className="font-display font-bold text-xl text-primary">
                    {result.homeExpected.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">xG per match</p>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1 font-heading">
                    Away Expected Goals
                  </p>
                  <p className="font-display font-bold text-xl text-accent">
                    {result.awayExpected.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">xG per match</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <RatingBar
                  value={result.homeAttackRating}
                  label={`${homeTeam.name.split(" ")[0]} Attack`}
                />
                <RatingBar
                  value={result.homeDefenseRating}
                  label={`${homeTeam.name.split(" ")[0]} Defense`}
                />
                <RatingBar
                  value={result.awayAttackRating}
                  label={`${awayTeam.name.split(" ")[0]} Attack`}
                />
                <RatingBar
                  value={result.awayDefenseRating}
                  label={`${awayTeam.name.split(" ")[0]} Defense`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-primary/10 rounded-lg p-2.5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold font-display text-primary">
                    #{Number(homeTeam.position)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-heading">
                      Home Rank
                    </p>
                    <p className="text-sm font-bold font-display text-primary">
                      {(result.homePositionFactor * 100).toFixed(0)}% strength
                    </p>
                  </div>
                </div>
                <div className="bg-accent/10 rounded-lg p-2.5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold font-display text-accent">
                    #{Number(awayTeam.position)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-heading">
                      Away Rank
                    </p>
                    <p className="text-sm font-bold font-display text-accent">
                      {(result.awayPositionFactor * 100).toFixed(0)}% strength
                    </p>
                  </div>
                </div>
              </div>

              {/* Home advantage notice */}
              <div className="flex items-center gap-2 pt-1 pl-1">
                <TrendingUp className="w-3.5 h-3.5 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  +0.3 home advantage bonus applied to{" "}
                  <span className="text-primary font-semibold">
                    {homeTeam.name}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-3 mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              data-ocid="result.regenerate_button"
              variant="outline"
              className="flex-1 h-12 font-heading font-semibold border-border hover:bg-muted"
              onClick={handleRegenerate}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-generate
            </Button>
          </motion.div>

          {/* Save Section */}
          <motion.div
            className="bg-background rounded-2xl border border-border p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Save className="w-4 h-4 text-accent" />
              Save This Prediction
            </h3>

            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  data-ocid="result.success_state"
                  key="saved"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 py-3 px-4 bg-primary/10 rounded-xl border border-primary/30"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-primary text-sm">
                      Saved!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      View in History tab
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div>
                    <Label
                      htmlFor="bet-note"
                      className="text-xs text-muted-foreground mb-1.5 block font-heading"
                    >
                      Note (optional)
                    </Label>
                    <Input
                      id="bet-note"
                      data-ocid="result.note_input"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Match day 6 bet, £20 stake..."
                      className="bg-card border-border text-foreground placeholder:text-muted-foreground h-11"
                    />
                  </div>
                  <Button
                    data-ocid="result.save_button"
                    className="w-full h-12 font-display font-bold bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleSave}
                    disabled={savePrediction.isPending}
                  >
                    {savePrediction.isPending ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Prediction
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
