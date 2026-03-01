import { Badge } from "./Badge";
import type { StatusKey, NoiseLevel, CostConfidence } from "@wedding/shared";

export function StatusBadge({ status }: { status: StatusKey }) {
    const statusMap: Record<StatusKey, "info" | "neutral" | "warning" | "success"> = {
        RESEARCHING: "info",
        ELIMINATED: "neutral",
        SHORTLISTED: "warning",
        FINALIST: "success",
    };

    const labels: Record<StatusKey, string> = {
        RESEARCHING: "Researching",
        ELIMINATED: "Eliminated",
        SHORTLISTED: "Shortlisted",
        FINALIST: "Finalist",
    };

    return <Badge variant={statusMap[status]}>{labels[status]}</Badge>;
}

export function RiskBadge({ level }: { level: NoiseLevel }) {
    if (level === "unknown") return <Badge variant="neutral">Unknown Risk</Badge>;
    const variant =
        level === "high" ? "danger" : level === "med" ? "warning" : "success";

    const label = level.charAt(0).toUpperCase() + level.slice(1) + " Risk";
    return <Badge variant={variant}>{label}</Badge>;
}

export function ConfidenceBadge({ level }: { level: CostConfidence }) {
    // Confidence is inverted (high is good, low is bad)
    const variant =
        level === "high" ? "success" : level === "med" ? "warning" : "danger";
    const label = level.charAt(0).toUpperCase() + level.slice(1) + " Confidence";
    return <Badge variant={variant}>{label}</Badge>;
}

export function FitBadge({ score }: { score?: number }) {
    if (score === undefined) return null;
    const variant = score >= 80 ? "success" : score >= 50 ? "warning" : "neutral";
    return <Badge variant={variant}>{score}% Fit</Badge>;
}
