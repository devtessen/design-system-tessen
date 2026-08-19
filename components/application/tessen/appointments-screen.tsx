"use client";

import { useMemo, useState } from "react";
import { CalendarMinus02, FilterLines, Plus } from "@untitledui/icons";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import {
    CancelAppointmentModal,
    NewAppointmentModal,
    RescheduleAppointmentModal,
} from "@/components/application/tessen/appointment-modals";
import { AppointmentDetailDrawer } from "@/components/application/tessen/appointment-detail-drawer";
import { TessenAppointmentsCalendar } from "@/components/application/tessen/tessen-appointments-calendar";
import { CountBadge } from "@/components/application/tessen/tessen-badges";
import { appointments, calendarIntegrationOnline, type Appointment, type AppointmentStatus } from "@/components/application/tessen/tessen-data";
import type { TessenUserType } from "@/components/application/tessen/tessen-nav";
import { TessenPageHeader, TessenShell } from "@/components/application/tessen/tessen-shell";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";

type StatusFilter = "confirmado" | "aguardando-confirmacao" | "cancelado";

const statusFilterOptions: { id: StatusFilter; label: string }[] = [
    { id: "confirmado", label: "Confirmado" },
    { id: "aguardando-confirmacao", label: "Aguardando confirmação" },
    { id: "cancelado", label: "Cancelado" },
];

const allStatusFilters = new Set(statusFilterOptions.map((opt) => opt.id));

function matchesStatusFilter(status: AppointmentStatus, filters: Set<StatusFilter>): boolean {
    if (filters.has("cancelado") && (status === "nao-confirmou" || status === "cancelado")) return true;
    return filters.has(status as StatusFilter);
}

interface TessenAppointmentsScreenProps {
    userType?: TessenUserType;
}

export const TessenAppointmentsScreen = ({ userType = "cliente" }: TessenAppointmentsScreenProps) => {
    const [statusFilters, setStatusFilters] = useState<Set<StatusFilter>>(new Set(allStatusFilters));
    const [draftStatusFilters, setDraftStatusFilters] = useState<Set<StatusFilter>>(new Set(allStatusFilters));
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
    const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
    const [newOpen, setNewOpen] = useState(false);

    const toggleDraftStatusFilter = (id: StatusFilter, isSelected: boolean) => {
        setDraftStatusFilters((prev) => {
            const next = new Set(prev);
            if (isSelected) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    const filteredAppointments = useMemo(
        () => appointments.filter((appointment) => matchesStatusFilter(appointment.status, statusFilters)),
        [statusFilters],
    );

    return (
        <TessenShell
            activeUrl="/agendamentos"
            userType={userType}
            className="h-dvh max-h-dvh overflow-hidden"
            mainClassName="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
        >
            <TessenPageHeader
                title="Agendamentos"
                description="Gerencie e acompanhe os agendamentos da sua agenda"
                actions={
                    <div className="flex items-center gap-3">
                        <AriaDialogTrigger
                            isOpen={filterOpen}
                            onOpenChange={(open) => {
                                setFilterOpen(open);
                                if (open) setDraftStatusFilters(new Set(statusFilters));
                            }}
                        >
                            <Button
                                size="sm"
                                color="secondary"
                                iconLeading={
                                    statusFilters.size === 0 ? (
                                        FilterLines
                                    ) : (
                                        <CountBadge color="brand" className="px-1.5">
                                            {statusFilters.size}
                                        </CountBadge>
                                    )
                                }
                            >
                                Filtrar
                            </Button>
                            <AriaPopover placement="bottom right" offset={8} className="will-change-transform">
                                <AriaDialog aria-label="Filtrar por status" className="flex w-56 flex-col gap-3 rounded-xl bg-primary p-3 shadow-xl ring ring-secondary_alt focus:outline-hidden">
                                    <div className="flex flex-col gap-1">
                                        {statusFilterOptions.map((opt) => (
                                            <Checkbox
                                                key={opt.id}
                                                label={opt.label}
                                                size="sm"
                                                isSelected={draftStatusFilters.has(opt.id)}
                                                onChange={(isSelected) => toggleDraftStatusFilter(opt.id, isSelected)}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 border-t border-secondary pt-3">
                                        <Button
                                            size="sm"
                                            color="secondary"
                                            isDisabled={draftStatusFilters.size === 0}
                                            onClick={() => setDraftStatusFilters(new Set())}
                                        >
                                            Limpar filtros
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="primary"
                                            onClick={() => {
                                                setStatusFilters(draftStatusFilters);
                                                setFilterOpen(false);
                                            }}
                                        >
                                            Aplicar
                                        </Button>
                                    </div>
                                </AriaDialog>
                            </AriaPopover>
                        </AriaDialogTrigger>
                        <Button size="sm" iconLeading={Plus} onClick={() => setNewOpen(true)}>
                            Novo agendamento
                        </Button>
                    </div>
                }
            />

            <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
                {!calendarIntegrationOnline && (
                    <div className="rounded-lg border border-warning-secondary bg-warning-primary px-4 py-3 text-sm text-warning-primary">
                        Agenda integrada offline. Remarcações bloqueadas até a conexão ser restabelecida. Cancelamentos ainda permitidos.
                    </div>
                )}

                {statusFilters.size === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset">
                        <EmptyState size="md">
                            <EmptyState.Header>
                                <EmptyState.FeaturedIcon icon={CalendarMinus02} color="gray" theme="modern" />
                            </EmptyState.Header>
                            <EmptyState.Content>
                                <EmptyState.Title>Nenhum filtro selecionado</EmptyState.Title>
                                <EmptyState.Description>Selecione ao menos um status em "Filtrar" para visualizar os agendamentos.</EmptyState.Description>
                            </EmptyState.Content>
                        </EmptyState>
                    </div>
                ) : (
                    <TessenAppointmentsCalendar
                        appointments={filteredAppointments}
                        onSelectAppointment={setSelectedAppointment}
                        className="min-h-0 flex-1"
                    />
                )}
            </div>

            <AppointmentDetailDrawer
                appointment={selectedAppointment}
                isOpen={!!selectedAppointment}
                onOpenChange={(open) => !open && setSelectedAppointment(null)}
                onReschedule={() => {
                    if (selectedAppointment) setRescheduleTarget(selectedAppointment);
                }}
                onCancel={() => {
                    if (selectedAppointment) setCancelTarget(selectedAppointment);
                }}
            />

            <RescheduleAppointmentModal
                appointment={rescheduleTarget}
                isOpen={!!rescheduleTarget}
                onOpenChange={(open) => !open && setRescheduleTarget(null)}
            />
            <CancelAppointmentModal
                appointment={cancelTarget}
                isOpen={!!cancelTarget}
                onOpenChange={(open) => !open && setCancelTarget(null)}
            />
            <NewAppointmentModal isOpen={newOpen} onOpenChange={setNewOpen} />
        </TessenShell>
    );
};
