"use client";

import { getDayOfWeek, parseDate } from "@internationalized/date";
import { ArrowRight } from "@untitledui/icons";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { TessenChannelIcon } from "@/components/application/tessen/tessen-channel-icon";
import {
    appointmentStatusColors,
    appointmentStatusLabels,
    calendarIntegrationOnline,
    type Appointment,
} from "@/components/application/tessen/tessen-data";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";

const WEEKDAY_FULL = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
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

function formatFullDate(dateString: string): string {
    const date = parseDate(dateString);
    const weekday = WEEKDAY_FULL[getDayOfWeek(date, "en-US")];
    return `${weekday}, ${date.day} de ${MONTH_FULL[date.month - 1]} de ${date.year}`;
}

interface AppointmentDetailDrawerProps {
    appointment: Appointment | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onReschedule: () => void;
    onCancel: () => void;
}

export const AppointmentDetailDrawer = ({ appointment, isOpen, onOpenChange, onReschedule, onCancel }: AppointmentDetailDrawerProps) => {
    if (!appointment) return null;

    return (
        <SlideoutMenu isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
            {({ close }) => (
                <>
                    <SlideoutMenu.Header onClose={close}>
                        <div className="h-9" />
                    </SlideoutMenu.Header>

                    <SlideoutMenu.Content className="gap-8">
                        <section>
                            <h3 className={tessenTypography.overline}>Dados do cliente</h3>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Nome</dt>
                                    <dd className="text-right font-medium text-primary">{appointment.patientName}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Idade</dt>
                                    <dd className="font-medium text-primary">{appointment.patientAge} anos</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Gênero</dt>
                                    <dd className="font-medium text-primary">{appointment.patientGender}</dd>
                                </div>
                            </dl>
                        </section>

                        <section>
                            <h3 className={tessenTypography.overline}>Detalhes do agendamento</h3>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Data</dt>
                                    <dd className="text-right font-medium text-primary capitalize">{formatFullDate(appointment.date)}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Horário</dt>
                                    <dd className="font-medium text-primary">{appointment.time}</dd>
                                </div>
                                {appointment.service && (
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-tertiary">Serviço</dt>
                                        <dd className="text-right font-medium text-primary">{appointment.service}</dd>
                                    </div>
                                )}
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Canal</dt>
                                    <dd className="flex items-center gap-1.5 font-medium text-primary">
                                        <TessenChannelIcon channel={appointment.source} showLabel showIcon={false} />
                                    </dd>
                                </div>
                            </dl>
                        </section>

                        {appointment.status === "cancelado" && (
                            <section>
                                <h3 className={tessenTypography.overline}>Motivo do cancelamento</h3>
                                <p className="mt-4 text-sm text-secondary">{appointment.cancellationReason ?? "Não informado"}</p>
                            </section>
                        )}

                        <section>
                            <h3 className={tessenTypography.overline}>Follow-up</h3>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Enviado</dt>
                                    <dd className="font-medium text-primary">{appointment.followUpSent ?? "—"}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Status</dt>
                                    <dd>
                                        <Badge type="pill-color" color={appointmentStatusColors[appointment.status]} size="sm">
                                            {appointmentStatusLabels[appointment.status]}
                                        </Badge>
                                    </dd>
                                </div>
                            </dl>
                        </section>
                    </SlideoutMenu.Content>

                    <SlideoutMenu.Footer className="flex flex-col gap-2">
                        <Button color="secondary" size="sm" onClick={onReschedule} isDisabled={!calendarIntegrationOnline}>
                            Remarcar
                        </Button>
                        <Button color="secondary-destructive" size="sm" onClick={onCancel}>
                            Cancelar agendamento
                        </Button>
                        {appointment.conversationId && (
                            <Button color="secondary" size="sm" iconTrailing={ArrowRight}>
                                Ver conversa completa
                            </Button>
                        )}
                    </SlideoutMenu.Footer>
                </>
            )}
        </SlideoutMenu>
    );
};
