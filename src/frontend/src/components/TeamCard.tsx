import { motion } from "motion/react";
import type { Team } from "../backend.d";

interface TeamCardProps {
  team: Team;
  isSelected: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  "data-ocid"?: string;
}

// Color-code position badges
function getPositionColor(position: number): string {
  if (position <= 4) return "bg-primary text-primary-foreground";
  if (position <= 6) return "bg-accent text-accent-foreground";
  if (position <= 10) return "bg-secondary text-secondary-foreground";
  if (position <= 17) return "text-foreground border border-border bg-muted";
  return "bg-destructive text-destructive-foreground";
}

function getTeamInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

// Team color accent for visual variety
function getTeamAccent(name: string): string {
  const colors = [
    "oklch(0.72 0.18 145 / 0.15)", // green
    "oklch(0.82 0.22 25 / 0.15)", // red
    "oklch(0.55 0.15 260 / 0.15)", // blue
    "oklch(0.82 0.22 85 / 0.15)", // gold
    "oklch(0.65 0.2 300 / 0.15)", // purple
    "oklch(0.75 0.12 180 / 0.15)", // teal
    "oklch(0.7 0.18 50 / 0.15)", // orange
    "oklch(0.6 0.15 240 / 0.15)", // navy
  ];
  let hash = 0;
  for (const ch of name) hash = (hash << 5) - hash + ch.charCodeAt(0);
  return colors[Math.abs(hash) % colors.length];
}

export function TeamCard({
  team,
  isSelected,
  isDisabled,
  onClick,
  "data-ocid": ocid,
}: TeamCardProps) {
  const position = Number(team.position);
  const points = Number(team.points);
  const played = Number(team.played);
  const accent = getTeamAccent(team.name);

  return (
    <motion.button
      data-ocid={ocid}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      className={[
        "relative w-full min-h-[160px] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden",
        "flex flex-col justify-between",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isDisabled
          ? "opacity-40 cursor-not-allowed"
          : "cursor-pointer hover:border-primary/60",
        isSelected
          ? "border-2 border-primary bg-primary/10 glow-border"
          : "border border-border bg-card",
      ].join(" ")}
      style={
        isSelected
          ? {}
          : {
              background: `linear-gradient(135deg, ${accent} 0%, oklch(var(--card)) 100%)`,
            }
      }
    >
      {/* Position badge */}
      <div className="flex items-start justify-between mb-2">
        <span
          className={[
            "inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold font-display",
            getPositionColor(position),
          ].join(" ")}
        >
          {position}
        </span>
        {isSelected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 text-primary-foreground"
              aria-label="Selected"
            >
              <title>Selected</title>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.span>
        )}
      </div>

      {/* Team initials avatar */}
      <div className="flex flex-col gap-1">
        <div
          className={[
            "w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold font-display mb-1",
            isSelected
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {getTeamInitials(team.name)}
        </div>
        <p
          className={[
            "font-heading font-bold text-sm leading-tight",
            isSelected ? "text-primary" : "text-foreground",
          ].join(" ")}
        >
          {team.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{points} pts</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{played} played</span>
        </div>
      </div>
    </motion.button>
  );
}
