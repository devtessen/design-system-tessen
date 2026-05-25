"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EscalationReason } from "@/components/application/tessen/tessen-data";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

const ESCALATION_DELAY_SECONDS: Partial<Record<EscalationReason, number>> = {
    low_confidence: 4,
    timeout: 4,
    repeated_question: 2,
    urgency_keyword: 0,
    unknown_subject: 4,
};

const ESCALATION_BANNER: Record<
    EscalationReason,
    { variant: "warning" | "danger" | "orange"; message: string }
> = {
    low_confidence: {
        variant: "warning",
        message: "Agente hesitante — leia a conversa antes de assumir",
    },
    timeout: {
        variant: "warning",
        message: "Tempo de espera excedido — leia a conversa antes de assumir",
    },
    repeated_question: {
        variant: "orange",
        message: "Pergunta repetida detectada — leia a conversa antes de assumir",
    },
    urgency_keyword: {
        variant: "danger",
        message: "Paciente reportou urgência",
    },
    unknown_subject: {
        variant: "warning",
        message: "Assunto não reconhecido — leia a conversa antes de assumir",
    },
};

const bannerStyles = {
    warning: "border-warning-200 bg-warning-primary text-warning-primary",
    danger: "border-error-200 bg-error-primary text-error-primary",
    orange: "border-utility-orange-200 bg-utility-orange-50 text-warning-primary",
};

interface AssumeAttendanceBannerProps {
    escalationReason: EscalationReason;
    onAssume: () => void;
}

export const AssumeAttendanceBanner = ({ escalationReason, onAssume }: AssumeAttendanceBannerProps) => {
    const delaySeconds = ESCALATION_DELAY_SECONDS[escalationReason] ?? 4;
    const config = ESCALATION_BANNER[escalationReason];
    const [secondsLeft, setSecondsLeft] = useState(delaySeconds);
    const [isReady, setIsReady] = useState(delaySeconds === 0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        if (delaySeconds === 0) return;
        clearTimer();
        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearTimer();
                    setIsReady(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [clearTimer, delaySeconds]);

    useEffect(() => {
        if (delaySeconds === 0) return;

        const handleVisibility = () => {
            if (document.hidden) {
                clearTimer();
            } else if (!isReady) {
                startTimer();
            }
        };

        startTimer();
        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            clearTimer();
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [clearTimer, delaySeconds, isReady, startTimer]);

    return (
        <div
            className={cx(
                "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3 md:px-5",
                bannerStyles[config.variant],
            )}
        >
            <p className="text-sm font-medium">{config.message}</p>
            <Button
                size="sm"
                color={config.variant === "danger" ? "primary-destructive" : "primary"}
                isDisabled={!isReady}
                onClick={onAssume}
            >
                {isReady ? "Assumir agora →" : `Assumir em ${secondsLeft}s...`}
            </Button>
        </div>
    );
};
