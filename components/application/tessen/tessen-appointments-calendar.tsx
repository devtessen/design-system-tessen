"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDate, getDayOfWeek } from "@internationalized/date";
import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import type { Appointment, AppointmentStatus } from "@/components/application/tessen/tessen-data";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/** "Hoje" fictício dos dados mock — os agendamentos existem apenas em torno dessa data. */
const MOCK_TODAY = new CalendarDate(2026, 6, 4);

const WEEKDAY_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MONTH_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MONTH_FULL = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
];

const HOURS = Array.from({ length: 24 }, (_, i) => i); // 00:00 – 23:00
const HOUR_ROW_HEIGHT = 64;
const EVENT_DURATION_MINUTES = 45;
const INITIAL_SCROLL_HOUR = 7;

const statusChipClass: Record<AppointmentStatus, string> = {
    confirmado: "bg-utility-green-50 text-utility-green-700 ring-1 ring-utility-green-200 ring-inset",
    "aguardando-confirmacao": "bg-utility-yellow-50 text-utility-yellow-700 ring-1 ring-utility-yellow-200 ring-inset",
    "nao-confirmou": "bg-utility-red-50 text-utility-red-700 ring-1 ring-utility-red-200 ring-inset",
    cancelado: "bg-utility-red-50 text-utility-red-700 ring-1 ring-utility-red-200 ring-inset",
};

/** Deslocamento em dias até a segunda-feira anterior (ou o próprio dia), independente de locale. */
function mondayOffset(date: CalendarDate): number {
    return (getDayOfWeek(date, "en-US") + 6) % 7;
}

function getWeekStart(date: CalendarDate): CalendarDate {
    return date.subtract({ days: mondayOffset(date) });
}

function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

interface TessenAppointmentsCalendarProps {
    appointments: Appointment[];
    onSelectAppointment: (appointment: Appointment) => void;
    className?: string;
}

export const TessenAppointmentsCalendar = ({ appointments, onSelectAppointment, className }: TessenAppointmentsCalendarProps) => {
    const [view, setView] = useState<"week" | "month">("week");
    const [anchorDate, setAnchorDate] = useState<CalendarDate>(MOCK_TODAY);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (view === "week" && scrollRef.current) {
            scrollRef.current.scrollTop = INITIAL_SCROLL_HOUR * HOUR_ROW_HEIGHT;
        }
    }, [view]);

    const goToday = () => setAnchorDate(MOCK_TODAY);
    const goPrev = () => setAnchorDate((d) => (view === "week" ? d.subtract({ weeks: 1 }) : d.subtract({ months: 1 })));
    const goNext = () => setAnchorDate((d) => (view === "week" ? d.add({ weeks: 1 }) : d.add({ months: 1 })));

    const weekDates = useMemo(() => {
        const start = getWeekStart(anchorDate);
        return Array.from({ length: 7 }, (_, i) => start.add({ days: i }));
    }, [anchorDate]);

    const monthWeeks = useMemo(() => {
        const firstOfMonth = anchorDate.set({ day: 1 });
        const gridStart = getWeekStart(firstOfMonth);
        const cells = Array.from({ length: 42 }, (_, i) => gridStart.add({ days: i }));
        return Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
    }, [anchorDate]);

    const appointmentsByDate = useMemo(() => {
        const map = new Map<string, Appointment[]>();
        for (const appointment of appointments) {
            const list = map.get(appointment.date) ?? [];
            list.push(appointment);
            map.set(appointment.date, list);
        }
        return map;
    }, [appointments]);

    const rangeLabel = useMemo(() => {
        if (view === "month") {
            return `${capitalize(MONTH_FULL[anchorDate.month - 1])} de ${anchorDate.year}`;
        }
        const start = weekDates[0];
        const end = weekDates[6];
        if (start.month === end.month) {
            return `${start.day} – ${end.day} de ${MONTH_FULL[start.month - 1]} de ${start.year}`;
        }
        return `${start.day} de ${MONTH_SHORT[start.month - 1]} – ${end.day} de ${MONTH_SHORT[end.month - 1]} de ${end.year}`;
    }, [view, anchorDate, weekDates]);

    return (
        <div className={cx("flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-secondary p-3">
                <div className="flex items-center gap-3">
                    <Button size="sm" color="secondary" onClick={goToday}>
                        Hoje
                    </Button>
                    <div className="flex items-center gap-1">
                        <Button size="sm" color="tertiary" iconLeading={ChevronLeft} className="size-8" onClick={goPrev} aria-label="Período anterior" />
                        <Button size="sm" color="tertiary" iconLeading={ChevronRight} className="size-8" onClick={goNext} aria-label="Próximo período" />
                    </div>
                    <span className="text-sm font-semibold text-primary">{rangeLabel}</span>
                </div>

                <div className="flex rounded-lg bg-secondary p-0.5 ring-1 ring-secondary ring-inset">
                    <button
                        type="button"
                        onClick={() => setView("week")}
                        className={cx(
                            "rounded-md px-3 py-1.5 text-sm font-medium transition duration-100 ease-linear",
                            view === "week" ? "bg-primary text-primary shadow-xs" : "text-tertiary",
                        )}
                    >
                        Semana
                    </button>
                    <button
                        type="button"
                        onClick={() => setView("month")}
                        className={cx(
                            "rounded-md px-3 py-1.5 text-sm font-medium transition duration-100 ease-linear",
                            view === "month" ? "bg-primary text-primary shadow-xs" : "text-tertiary",
                        )}
                    >
                        Mês
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
                {view === "week" ? (
                    <div className="min-w-180">
                        <div className="sticky top-0 z-10 grid grid-cols-[56px_repeat(7,minmax(0,1fr))] border-x border-b border-secondary bg-primary">
                            <div />
                            {weekDates.map((date, i) => {
                                const isToday = date.compare(MOCK_TODAY) === 0;
                                return (
                                    <div key={date.toString()} className="flex flex-col items-center gap-1 border-l border-secondary p-2">
                                        <span className="text-xs font-medium text-tertiary">{WEEKDAY_SHORT[i]}</span>
                                        <span
                                            className={cx(
                                                "flex size-6 items-center justify-center rounded-full text-sm font-medium",
                                                isToday ? "bg-brand-solid text-white" : "text-primary",
                                            )}
                                        >
                                            {date.day}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))]">
                            <div className="flex flex-col">
                                {HOURS.map((hour) => (
                                    <div key={hour} className="flex h-16 items-start justify-end pr-2 text-xs text-tertiary">
                                        {String(hour).padStart(2, "0")}:00
                                    </div>
                                ))}
                            </div>

                            {weekDates.map((date) => {
                                const dayAppointments = appointmentsByDate.get(date.toString()) ?? [];

                                return (
                                    <div
                                        key={date.toString()}
                                        className="relative border-l border-secondary"
                                        style={{ height: HOURS.length * HOUR_ROW_HEIGHT }}
                                    >
                                        {HOURS.map((hour, hi) => (
                                            <div key={hour} className="absolute inset-x-0 border-t border-secondary" style={{ top: hi * HOUR_ROW_HEIGHT }} />
                                        ))}

                                        {dayAppointments.map((appointment) => {
                                            const [h, m] = appointment.time.split(":").map(Number);
                                            const minutesFromStart = h * 60 + m - HOURS[0] * 60;
                                            const top = (minutesFromStart / 60) * HOUR_ROW_HEIGHT;
                                            const height = Math.max((EVENT_DURATION_MINUTES / 60) * HOUR_ROW_HEIGHT, 28);

                                            return (
                                                <button
                                                    key={appointment.id}
                                                    type="button"
                                                    onClick={() => onSelectAppointment(appointment)}
                                                    className={cx(
                                                        "absolute inset-x-1 cursor-pointer overflow-hidden rounded-md px-1.5 py-1 text-left text-xs transition duration-100 ease-linear hover:shadow-md hover:brightness-95",
                                                        statusChipClass[appointment.status],
                                                    )}
                                                    style={{ top, height }}
                                                >
                                                    <span className="block truncate font-medium">{appointment.patientName}</span>
                                                    <span className="block text-[10px] opacity-80">{appointment.time}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-7 border-b border-secondary">
                            {WEEKDAY_SHORT.map((day) => (
                                <div key={day} className="border-l border-secondary p-2 text-center text-xs font-medium text-tertiary first:border-l-0">
                                    {day}
                                </div>
                            ))}
                        </div>
                        {monthWeeks.map((week) => (
                            <div key={week[0].toString()} className="grid grid-cols-7 border-b border-secondary last:border-b-0">
                                {week.map((date) => {
                                    const isOutside = date.month !== anchorDate.month;
                                    const isToday = date.compare(MOCK_TODAY) === 0;
                                    const dayAppointments = appointmentsByDate.get(date.toString()) ?? [];
                                    const visibleAppointments = dayAppointments.slice(0, 3);
                                    const overflowCount = dayAppointments.length - visibleAppointments.length;

                                    return (
                                        <div
                                            key={date.toString()}
                                            className={cx("min-h-24 border-l border-secondary p-1.5 first:border-l-0", isOutside && "opacity-50")}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAnchorDate(date);
                                                    setView("week");
                                                }}
                                                className={cx(
                                                    "flex size-6 items-center justify-center rounded-full text-xs font-medium transition duration-100 ease-linear",
                                                    isToday ? "bg-brand-solid text-white" : "text-secondary hover:bg-primary_hover",
                                                )}
                                            >
                                                {date.day}
                                            </button>
                                            <div className="mt-1 flex flex-col gap-1">
                                                {visibleAppointments.map((appointment) => (
                                                    <button
                                                        key={appointment.id}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelectAppointment(appointment);
                                                        }}
                                                        className={cx(
                                                            "cursor-pointer truncate rounded px-1 py-0.5 text-left text-[11px] font-medium transition duration-100 ease-linear hover:brightness-95",
                                                            statusChipClass[appointment.status],
                                                        )}
                                                    >
                                                        {appointment.time} {appointment.patientName.split(" ")[0]}
                                                    </button>
                                                ))}
                                                {overflowCount > 0 && <span className="px-1 text-[11px] text-tertiary">+{overflowCount} mais</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
