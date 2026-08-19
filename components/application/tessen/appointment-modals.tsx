"use client";

import type { ReactNode } from "react";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import type { Appointment } from "@/components/application/tessen/tessen-data";
import { TessenChannelIcon } from "@/components/application/tessen/tessen-channel-icon";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";

const timeSlots = [
    { id: "09:00", label: "09:00" },
    { id: "10:30", label: "10:30" },
    { id: "14:00", label: "14:00" },
    { id: "15:30", label: "15:30" },
];

interface AppointmentModalShellProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;
    footer: ReactNode;
}

const AppointmentModalShell = ({ isOpen, onOpenChange, title, children, footer }: AppointmentModalShellProps) => (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
        <Modal className="w-full max-w-lg">
            <Dialog className="flex max-h-[min(90dvh,640px)] flex-col outline-hidden">
                <div className="relative shrink-0 border-b border-secondary px-5 py-4">
                    <CloseButton size="sm" className="absolute top-4 right-4" onClick={() => onOpenChange(false)} />
                    <h2 className="pr-10 text-lg font-semibold text-primary">{title}</h2>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
                <div className="flex shrink-0 justify-end gap-3 border-t border-secondary px-5 py-4">{footer}</div>
            </Dialog>
        </Modal>
    </ModalOverlay>
);

const MessagePreview = ({ message }: { message: string }) => (
    <div className="rounded-lg bg-secondary px-4 py-3">
        <p className="text-xs font-medium text-tertiary">Preview da mensagem ao paciente</p>
        <p className="mt-2 text-sm text-secondary">{message}</p>
    </div>
);

interface RescheduleAppointmentModalProps {
    appointment: Appointment | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const RescheduleAppointmentModal = ({ appointment, isOpen, onOpenChange }: RescheduleAppointmentModalProps) => {
    if (!appointment) return null;

    const channelLabel = appointment.source === "manual" ? "WhatsApp" : appointment.source;

    return (
        <AppointmentModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={`Remarcar consulta de ${appointment.patientName}`}
            footer={
                <>
                    <Button color="secondary" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>Confirmar remarcação</Button>
                </>
            }
        >
            <div className="flex flex-col gap-5">
                <Select label="Nova data e horário" placeholder="Selecione um horário disponível" items={timeSlots}>
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-primary">Notificar paciente automaticamente</p>
                        <p className="text-xs text-tertiary">via {channelLabel}</p>
                    </div>
                    <Toggle defaultSelected isDisabled={!appointment.hasMessagingChannel} />
                </div>
                {!appointment.hasMessagingChannel && (
                    <p className="text-xs text-tertiary">Paciente sem WhatsApp ou Telegram cadastrado.</p>
                )}
                <MessagePreview
                    message={`Olá ${appointment.patientName.split(" ")[0]}, sua consulta foi remarcada. Por favor, confirme o novo horário.`}
                />
            </div>
        </AppointmentModalShell>
    );
};

interface CancelAppointmentModalProps {
    appointment: Appointment | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CancelAppointmentModal = ({ appointment, isOpen, onOpenChange }: CancelAppointmentModalProps) => {
    if (!appointment) return null;

    return (
        <AppointmentModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={`Cancelar consulta de ${appointment.patientName}`}
            footer={
                <>
                    <Button color="secondary" onClick={() => onOpenChange(false)}>
                        Voltar
                    </Button>
                    <Button color="primary-destructive" onClick={() => onOpenChange(false)}>
                        Confirmar cancelamento
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-primary">Notificar paciente e oferecer reagendamento</p>
                    </div>
                    <Toggle defaultSelected isDisabled={!appointment.hasMessagingChannel} />
                </div>
                <TextArea label="Motivo do cancelamento (interno)" placeholder="Opcional — não será enviado ao paciente" rows={2} />
                {appointment.hasMessagingChannel && (
                    <MessagePreview
                        message={`Olá ${appointment.patientName.split(" ")[0]}, sua consulta foi cancelada. Gostaria de reagendar em outro horário?`}
                    />
                )}
            </div>
        </AppointmentModalShell>
    );
};

interface NewAppointmentModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NewAppointmentModal = ({ isOpen, onOpenChange }: NewAppointmentModalProps) => (
    <AppointmentModalShell
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Novo agendamento"
        footer={
            <>
                <Button color="secondary" onClick={() => onOpenChange(false)}>
                    Cancelar
                </Button>
                <Button onClick={() => onOpenChange(false)}>Confirmar agendamento</Button>
            </>
        }
    >
        <div className="flex flex-col gap-5">
            <Input label="Paciente" placeholder="Buscar por nome ou telefone" hint="Não encontrou? Cadastre um novo contato" />
            <Select label="Data e horário" placeholder="Horários disponíveis" items={timeSlots}>
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
            <Input label="Serviço / tipo de consulta" placeholder="Opcional" />
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-primary">Enviar confirmação ao paciente via WhatsApp</p>
                <Toggle defaultSelected />
            </div>
        </div>
    </AppointmentModalShell>
);
