"use client";

import type { ReactNode } from "react";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { BadgeGroup } from "@/components/base/badges/badge-groups";
import type { ConversationStatus } from "@/components/application/tessen/tessen-data";
import { formatWaitingDuration, statusColors, statusLabels } from "@/components/application/tessen/tessen-data";
import { formatConfidenceTooltip, getConfidenceSemantics } from "@/components/application/tessen/tessen-confidence";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

type BadgeAccent = "brand" | "success" | "warning" | "error";

export const ConfidenceBadge = ({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) => {
    const { label, badgeColor } = getConfidenceSemantics(value);

    return (
        <Tooltip title={formatConfidenceTooltip(value)} placement="top">
            <Badge type="pill-color" color={badgeColor} size={size} className="cursor-default">
                {label}
            </Badge>
        </Tooltip>
    );
};

/** Painel lateral do chat: label + barra fina + percentual. */
export const ConfidenceSidebarDisplay = ({ value }: { value: number }) => {
    const { label, progressClassName } = getConfidenceSemantics(value);

    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm text-secondary">
                Confiança: <span className="font-medium text-primary">{label}</span>
                <Tooltip title={formatConfidenceTooltip(value)} placement="top">
                    <span className="ml-1 cursor-default text-tertiary">({value}%)</span>
                </Tooltip>
            </p>
            <ProgressBarBase value={value} progressClassName={progressClassName} className="h-1" />
        </div>
    );
};

/** Indica que um atendente humano deve assumir a conversa (BadgeGroup pill-color, trailing). */
export const AssumeAttendanceBadge = ({ className, onClick }: { className?: string; onClick?: () => void }) => {
    const badge = (
        <BadgeGroup addonText="Assumir" color="warning" theme="light" align="trailing" size="md" className={className}>
            Atendimento pendente
        </BadgeGroup>
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="rounded-full outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                {badge}
            </button>
        );
    }

    return badge;
};

/** Alerta no painel: conversas na fila aguardando humano (BadgeGroup pill-color, leading). */
export const WaitingHumanAlert = ({
    count,
    oldestWaitingMinutes,
    slaExceeded,
    className,
    onClick,
}: {
    count: number;
    oldestWaitingMinutes: number;
    slaExceeded?: boolean;
    className?: string;
    onClick?: () => void;
}) => {
    const conversationLabel = count === 1 ? "1 conversa aguardando humano" : `${count} conversas aguardando humano`;
    const oldestLabel = `mais antigo há ${formatWaitingDuration(oldestWaitingMinutes)}`;

    const badge = (
        <BadgeGroup
            addonText={String(count)}
            color={slaExceeded ? "error" : "warning"}
            theme="light"
            align="leading"
            size="lg"
            className={className}
            iconTrailing={undefined}
        >
            {conversationLabel} — {oldestLabel}
        </BadgeGroup>
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={cx(
                    "rounded-full outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
                    slaExceeded && "animate-pulse",
                )}
                style={slaExceeded ? { animationDuration: "2s" } : undefined}
            >
                {badge}
            </button>
        );
    }

    return (
        <div className={cx(slaExceeded && "animate-pulse")} style={slaExceeded ? { animationDuration: "2s" } : undefined}>
            {badge}
        </div>
    );
};

export const StatusBadge = ({ status }: { status: ConversationStatus }) => {
    return (
        <BadgeWithDot size="sm" color={statusColors[status]} type="modern">
            {statusLabels[status]}
        </BadgeWithDot>
    );
};

export type EngagementLabel = "frequente" | "esporadico" | "inativo" | "em-risco";

export const engagementLabels: Record<EngagementLabel, { label: string; color: BadgeAccent | "gray" }> = {
    frequente: { label: "Frequente", color: "success" },
    esporadico: { label: "Esporádico", color: "warning" },
    inativo: { label: "Inativo", color: "gray" },
    "em-risco": { label: "Em risco", color: "error" },
};

export const EngagementBadge = ({
    label,
    contactCount,
}: {
    label: EngagementLabel;
    contactCount: number;
}) => {
    const { label: text, color } = engagementLabels[label];

    return (
        <Tooltip title={`Baseado em ${contactCount} atendimentos nos últimos 30 dias`} placement="top">
            <Badge type="pill-color" color={color} size="sm" className="cursor-default">
                {text}
            </Badge>
        </Tooltip>
    );
};

export const TrendBadge = ({ children, color = "brand" }: { children: ReactNode; color?: BadgeAccent }) => {
    return (
        <Badge type="color" color={color} size="sm">
            {children}
        </Badge>
    );
};

export const CountBadge = ({ children, color = "gray", className }: { children: ReactNode; color?: "brand" | "gray" | "error"; className?: string }) => {
    return (
        <Badge type="pill-color" color={color} size="sm" className={className}>
            {children}
        </Badge>
    );
};

export const LabelBadge = ({ children, color = "brand", className }: { children: ReactNode; color?: "brand" | "gray"; className?: string }) => {
    return (
        <Badge type="color" color={color} size="sm" className={className}>
            {children}
        </Badge>
    );
};

export const OnlineBadge = () => {
    return (
        <BadgeWithDot color="success" size="sm" type="modern">
            Online
        </BadgeWithDot>
    );
};
