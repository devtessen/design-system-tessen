export type ConfidenceLevel = "insegura" | "hesitante" | "segura" | "muito-segura";

export interface ConfidenceSemantics {
    level: ConfidenceLevel;
    label: string;
    badgeColor: "error" | "warning" | "success";
    /** Barra de progresso no painel lateral — tom mais suave para 90–100%. */
    progressClassName?: string;
}

export function getConfidenceSemantics(value: number): ConfidenceSemantics {
    if (value < 50) {
        return { level: "insegura", label: "Insegura", badgeColor: "error" };
    }
    if (value < 70) {
        return { level: "hesitante", label: "Hesitante", badgeColor: "warning" };
    }
    if (value < 90) {
        return { level: "segura", label: "Segura", badgeColor: "success" };
    }
    return {
        level: "muito-segura",
        label: "Muito segura",
        badgeColor: "success",
        progressClassName: "bg-fg-success-secondary",
    };
}

export function formatConfidenceTooltip(value: number): string {
    return `${value}% de confiança`;
}
