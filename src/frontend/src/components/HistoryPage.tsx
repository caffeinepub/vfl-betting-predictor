import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, FileX, Minus, Trash2, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { Prediction } from "../backend.d";
import { useDeletePrediction, useGetPredictions } from "../hooks/useQueries";

function formatDate(timestamp: bigint): string {
  // Motoko timestamps are in nanoseconds
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  // If timestamp seems invalid (too small), show as "Recently"
  if (ms < 1_000_000) return "Recently";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getVerdict(
  homeScore: bigint,
  awayScore: bigint,
): { label: string; color: string } {
  const h = Number(homeScore);
  const a = Number(awayScore);
  if (h > a) return { label: "Home Win", color: "text-primary" };
  if (a > h) return { label: "Away Win", color: "text-accent" };
  return { label: "Draw", color: "text-muted-foreground" };
}

interface PredictionItemProps {
  prediction: Prediction;
  index: number;
  onDelete: (id: bigint) => void;
  isDeleting: boolean;
}

function PredictionItem({
  prediction,
  index,
  onDelete,
  isDeleting,
}: PredictionItemProps) {
  const verdict = getVerdict(prediction.homeScore, prediction.awayScore);
  const homeScore = Number(prediction.homeScore);
  const awayScore = Number(prediction.awayScore);

  return (
    <motion.div
      data-ocid={`history.item.${index}`}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-2xl border border-border p-4 relative overflow-hidden"
    >
      {/* Result accent */}
      <div
        className={[
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
          homeScore > awayScore
            ? "bg-primary"
            : awayScore > homeScore
              ? "bg-accent"
              : "bg-muted-foreground",
        ].join(" ")}
      />

      <div className="pl-3">
        {/* Teams & Score */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-foreground truncate max-w-[90px]">
                  {prediction.homeTeam}
                </span>
                <div className="shrink-0 flex items-center gap-1.5 bg-background border border-border rounded-lg px-2 py-1">
                  <span className="font-display font-black text-lg leading-none text-primary">
                    {homeScore}
                  </span>
                  <span className="text-xs text-muted-foreground font-bold">
                    —
                  </span>
                  <span className="font-display font-black text-lg leading-none text-accent">
                    {awayScore}
                  </span>
                </div>
                <span className="font-heading font-bold text-sm text-foreground truncate max-w-[90px]">
                  {prediction.awayTeam}
                </span>
              </div>

              {/* Verdict & note */}
              <div className="flex items-center gap-2 mt-1.5">
                {homeScore > awayScore ? (
                  <Trophy className="w-3 h-3 text-primary shrink-0" />
                ) : awayScore > homeScore ? (
                  <Trophy className="w-3 h-3 text-accent shrink-0" />
                ) : (
                  <Minus className="w-3 h-3 text-muted-foreground shrink-0" />
                )}
                <span
                  className={`text-xs font-semibold font-heading ${verdict.color}`}
                >
                  {verdict.label}
                </span>
              </div>
            </div>
          </div>

          <Button
            data-ocid={`history.delete_button.${index}`}
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 ml-2"
            onClick={() => onDelete(prediction.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        {/* Meta: date & note */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(prediction.timestamp)}</span>
          </div>
          {prediction.note && (
            <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 max-w-[140px] truncate">
              {prediction.note}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function HistoryPage() {
  const { data: predictions, isLoading } = useGetPredictions();
  const deleteMutation = useDeletePrediction();

  const sorted = predictions
    ? [...predictions].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    : [];

  async function handleDelete(id: bigint) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Prediction deleted");
    } catch {
      toast.error("Failed to delete prediction");
    }
  }

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Saved Predictions
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {sorted.length > 0
                ? `${sorted.length} prediction${sorted.length !== 1 ? "s" : ""} saved`
                : "No predictions yet"}
            </p>
          </div>
          {sorted.length > 0 && (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 text-xs text-primary font-heading font-semibold">
                <Trophy className="w-3.5 h-3.5" />
                {
                  sorted.filter(
                    (p) => Number(p.homeScore) !== Number(p.awayScore),
                  ).length
                }{" "}
                decisive
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-heading">
                <Minus className="w-3.5 h-3.5" />
                {
                  sorted.filter(
                    (p) => Number(p.homeScore) === Number(p.awayScore),
                  ).length
                }{" "}
                draws
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 flex-1">
        {isLoading ? (
          <div className="space-y-3" data-ocid="history.loading_state">
            {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map((id) => (
              <Skeleton key={id} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <motion.div
            data-ocid="history.empty_state"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
              <FileX className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-1">
              No predictions saved
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Generate a prediction on the Predict tab and save it to see it
              here
            </p>
          </motion.div>
        ) : (
          <div data-ocid="history.list" className="space-y-3">
            <AnimatePresence initial={false}>
              {sorted.map((prediction, index) => (
                <PredictionItem
                  key={prediction.id.toString()}
                  prediction={prediction}
                  index={index + 1}
                  onDelete={handleDelete}
                  isDeleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === prediction.id
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
