"use client";

import type { ReactNode } from "react";
import { TessenSidebar } from "@/components/application/tessen/tessen-sidebar";
import { TrendBadge } from "@/components/application/tessen/tessen-badges";
import { tessenFooterItems, tessenNavItems } from "@/components/application/tessen/tessen-nav";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { cx } from "@/utils/cx";

export { ConfidenceBadge } from "@/components/application/tessen/tessen-badges";

interface TessenShellProps {
    activeUrl: string;
    children: ReactNode;
    className?: string;
    mainClassName?: string;
}

export const TessenShell = ({ activeUrl, children, className, mainClassName }: TessenShellProps) => {
    return (
        <div className={cx("flex min-h-screen w-full bg-secondary", className)}>
            <TessenSidebar activeUrl={activeUrl} items={tessenNavItems} footerItems={tessenFooterItems} />
            <main className={cx("flex min-h-screen flex-1 flex-col overflow-auto", mainClassName)}>{children}</main>
        </div>
    );
};

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
}

export const TessenPageHeader = ({ title, description, actions }: PageHeaderProps) => {
    return (
        <div className="flex flex-col gap-4 border-b border-secondary bg-primary px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-6">
            <div>
                <h1 className={tessenTypography.pageTitle}>{title}</h1>
                {description && <p className="mt-1 text-sm text-tertiary">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
        </div>
    );
};

interface MetricCardProps {
    label: string;
    value: string | number;
    hint?: string;
    trend?: string;
    accent?: "brand" | "success" | "warning" | "error";
    /** SLA ultrapassado — borda vermelha e pulso (UX-001). */
    alert?: boolean;
    /** Valor exibido abaixo do número principal (ex.: mais antigo há X min). */
    subHint?: string;
    /** Meta com barra de progresso (DAT-001). */
    goalProgress?: { current: number; goal: number };
}

export const MetricCard = ({
    label,
    value,
    hint,
    trend,
    accent = "brand",
    alert,
    subHint,
    goalProgress,
}: MetricCardProps) => {
    const goalMet = goalProgress ? goalProgress.current >= goalProgress.goal : false;
    const goalNear = goalProgress
        ? goalProgress.current >= goalProgress.goal - 10 && !goalMet
        : false;
    const progressColor = goalMet
        ? "bg-fg-success-primary"
        : goalNear
          ? "bg-fg-warning-primary"
          : "bg-fg-error-secondary";

    return (
        <div
            className={cx(
                "flex flex-col gap-2 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-inset",
                alert ? "animate-pulse ring-error-300" : "ring-secondary",
            )}
            style={alert ? { animationDuration: "2s" } : undefined}
        >
            <p className="text-sm font-medium text-tertiary">{label}</p>
            <div className="flex items-end justify-between gap-2">
                <p className={cx(tessenTypography.metricValue, alert && "text-error-primary")}>{value}</p>
                {trend && <TrendBadge color={alert ? "error" : accent}>{trend}</TrendBadge>}
            </div>
            {subHint && <p className={cx("text-sm", alert ? "font-medium text-error-primary" : "text-tertiary")}>{subHint}</p>}
            {hint && <p className="text-sm text-tertiary">{hint}</p>}
            {goalProgress && (
                <div className="mt-1 flex flex-col gap-1">
                    <p className="text-xs text-tertiary">meta: {goalProgress.goal}%</p>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-quaternary">
                        <div
                            className={cx("h-full rounded-full transition duration-100 ease-linear", progressColor)}
                            style={{ width: `${Math.min(100, goalProgress.current)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
