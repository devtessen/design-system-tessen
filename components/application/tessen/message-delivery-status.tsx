"use client";

import type { MessageDeliveryStatus } from "@/components/application/tessen/tessen-data";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

interface MessageDeliveryIndicatorProps {
    status?: MessageDeliveryStatus;
    onRetry?: () => void;
}

export const MessageDeliveryIndicator = ({ status, onRetry }: MessageDeliveryIndicatorProps) => {
    if (!status) return null;

    if (status === "sending") {
        return <span className="text-xs text-quaternary animate-pulse">···</span>;
    }

    if (status === "failed") {
        return (
            <span className="flex items-center gap-1 text-xs text-error-primary">
                <span aria-hidden>!</span>
                <Button color="link-destructive" size="sm" onClick={onRetry}>
                    Falha no envio — Tentar novamente
                </Button>
            </span>
        );
    }

    const isRead = status === "read";
    const checkmarks = status === "sent" ? "✓" : "✓✓";

    return (
        <span
            className={cx("text-xs", isRead ? "text-brand-secondary" : "text-quaternary")}
            aria-label={
                status === "sent"
                    ? "Enviado"
                    : status === "delivered"
                      ? "Entregue"
                      : "Lido"
            }
        >
            {checkmarks}
        </span>
    );
};
