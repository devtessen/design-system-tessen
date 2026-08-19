"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Archive, Trash01 } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { ConfirmationModal } from "@/components/application/modals/confirmation-modal";
import {
    contactChannelItems,
    findContactByPhone,
    type ConversationChannel,
    type TessenContact,
} from "@/components/application/tessen/tessen-data";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";

interface TessenModalShellProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;
    footer: ReactNode;
}

const TessenModalShell = ({ isOpen, onOpenChange, title, children, footer }: TessenModalShellProps) => (
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

function isValidPhone(phone: string): boolean {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13;
}

interface NewContactModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    existingContacts: TessenContact[];
    onSave: (contact: Omit<TessenContact, "id" | "activity" | "archived" | "lastContactDaysAgo" | "lastContactAt">) => void;
    onDuplicateFound: (contact: TessenContact) => void;
}

export const NewContactModal = ({ isOpen, onOpenChange, existingContacts, onSave, onDuplicateFound }: NewContactModalProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [channel, setChannel] = useState<ConversationChannel>("whatsapp");
    const [phoneError, setPhoneError] = useState<string | undefined>();

    const reset = () => {
        setName("");
        setPhone("");
        setChannel("whatsapp");
        setPhoneError(undefined);
    };

    const handleSave = () => {
        if (!name.trim()) return;
        if (!isValidPhone(phone)) {
            setPhoneError("Informe um telefone válido com DDD");
            return;
        }

        const duplicate = findContactByPhone(existingContacts, phone);
        if (duplicate) {
            onDuplicateFound(duplicate);
            onOpenChange(false);
            reset();
            return;
        }

        const initials = name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("");

        onSave({
            fullName: name.trim(),
            phone: phone.trim(),
            avatarInitials: initials || "??",
            originChannel: channel,
            preferredChannel: channel,
            stage: "primeiro-contato",
            firstContactAt: "Hoje",
        });
        reset();
        onOpenChange(false);
    };

    return (
        <TessenModalShell
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) reset();
                onOpenChange(open);
            }}
            title="Novo contato"
            footer={
                <>
                    <Button color="secondary" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>Cadastrar</Button>
                </>
            }
        >
            <div className="flex flex-col gap-5">
                <Input label="Nome completo" isRequired value={name} onChange={setName} placeholder="Ex.: Maria Silva" />
                <Input
                    label="Telefone"
                    isRequired
                    value={phone}
                    onChange={(v) => {
                        setPhone(v);
                        setPhoneError(undefined);
                    }}
                    placeholder="+55 48 99999-9999"
                    isInvalid={Boolean(phoneError)}
                    hint={phoneError}
                />
                <Select
                    label="Canal preferencial"
                    items={contactChannelItems}
                    selectedKey={channel}
                    onSelectionChange={(key) => setChannel(String(key) as ConversationChannel)}
                >
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
            </div>
        </TessenModalShell>
    );
};

interface EditContactModalProps {
    contact: TessenContact | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    existingContacts: TessenContact[];
    onSave: (contact: TessenContact) => void;
    onDuplicateFound: (contact: TessenContact) => void;
}

export const EditContactModal = ({ contact, isOpen, onOpenChange, existingContacts, onSave, onDuplicateFound }: EditContactModalProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [channel, setChannel] = useState<ConversationChannel>("whatsapp");
    const [phoneError, setPhoneError] = useState<string | undefined>();

    useEffect(() => {
        if (contact && isOpen) {
            setName(contact.fullName);
            setPhone(contact.phone);
            setChannel(contact.preferredChannel);
            setPhoneError(undefined);
        }
    }, [contact, isOpen]);

    const handleSave = () => {
        if (!contact || !name.trim()) return;
        if (!isValidPhone(phone)) {
            setPhoneError("Informe um telefone válido com DDD");
            return;
        }

        const duplicate = findContactByPhone(
            existingContacts.filter((c) => c.id !== contact.id),
            phone,
        );
        if (duplicate) {
            onDuplicateFound(duplicate);
            onOpenChange(false);
            return;
        }

        onSave({
            ...contact,
            fullName: name.trim(),
            phone: phone.trim(),
            preferredChannel: channel,
            avatarInitials: name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join(""),
        });
        onOpenChange(false);
    };

    if (!contact) return null;

    return (
        <TessenModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Editar dados cadastrais"
            footer={
                <>
                    <Button color="secondary" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </>
            }
        >
            <div className="flex flex-col gap-5">
                <Input label="Nome completo" isRequired value={name} onChange={setName} />
                <Input
                    label="Telefone"
                    isRequired
                    value={phone}
                    onChange={(v) => {
                        setPhone(v);
                        setPhoneError(undefined);
                    }}
                    isInvalid={Boolean(phoneError)}
                    hint={phoneError}
                />
                <Select
                    label="Canal preferencial"
                    items={contactChannelItems}
                    selectedKey={channel}
                    onSelectionChange={(key) => setChannel(String(key) as ConversationChannel)}
                >
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
                <div className="rounded-lg bg-secondary px-4 py-3 text-sm text-tertiary">
                    <p>Estágio: controlado pelo sistema</p>
                    <p className="mt-1">Primeiro contato: {contact.firstContactAt}</p>
                    <p className="mt-1">Canal de origem: {contactChannelItems.find((c) => c.id === contact.originChannel)?.label}</p>
                </div>
            </div>
        </TessenModalShell>
    );
};

interface ArchiveContactModalProps {
    contact: TessenContact | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const ArchiveContactModal = ({ contact, isOpen, onOpenChange, onConfirm }: ArchiveContactModalProps) => {
    if (!contact) return null;

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onConfirm={onConfirm}
            icon={Archive}
            iconColor="warning"
            title={`Arquivar ${contact.fullName}?`}
            description="O histórico será mantido, mas o contato não aparecerá mais na lista ativa e não receberá follow-ups automáticos do agente."
            confirmLabel="Arquivar"
            isDestructive={false}
        />
    );
};

interface DeleteContactModalProps {
    contact: TessenContact | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const DeleteContactModal = ({ contact, isOpen, onOpenChange, onConfirm }: DeleteContactModalProps) => {
    if (!contact) return null;

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onConfirm={onConfirm}
            icon={Trash01}
            iconColor="error"
            title={`Excluir ${contact.fullName}?`}
            description="Essa ação é permanente. Todo o histórico de conversas e agendamentos deste contato será removido e não poderá ser recuperado."
            confirmLabel="Excluir"
        />
    );
};
