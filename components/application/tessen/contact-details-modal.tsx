"use client";

import { useState } from "react";
import { Mail01, MessageChatCircle, Phone01, User01 } from "@untitledui/icons";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import {
    contactAttributeFields,
    contactHistory,
    type Conversation,
} from "@/components/application/tessen/tessen-data";
import { LabelBadge, StatusBadge } from "@/components/application/tessen/tessen-badges";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { cx } from "@/utils/cx";

interface ContactDetailsModalProps {
    conversation: Conversation;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export const ContactDetailsModal = ({ conversation, isOpen, onOpenChange }: ContactDetailsModalProps) => {
    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
            <Modal className="w-full max-w-md">
                <Dialog className="flex max-h-[min(90dvh,720px)] flex-col outline-hidden">
                    <ContactDetailsContent conversation={conversation} onClose={() => onOpenChange(false)} />
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

interface ContactDetailsContentProps {
    conversation: Conversation;
    onClose?: () => void;
    className?: string;
}

export const ContactDetailsContent = ({ conversation, onClose, className }: ContactDetailsContentProps) => {
    const [detailTab, setDetailTab] = useState("attributes");

    return (
        <div className={cx("flex min-h-0 flex-1 flex-col", className)}>
            <div className="relative shrink-0 border-b border-secondary px-5 pb-5 pt-5">
                <CloseButton size="sm" className="absolute top-4 right-4" onClick={onClose} />
                <div className="flex flex-col items-center pt-2 text-center">
                    <Avatar initials={conversation.avatarInitials} size="xl" />
                    <h2 className={cx("mt-3", tessenTypography.profileName)}>{conversation.contactName}</h2>
                    <p className="text-sm text-tertiary">{conversation.contactPhone}</p>
                    {conversation.niche && (
                        <LabelBadge color="brand" className="mt-2">
                            {conversation.niche}
                        </LabelBadge>
                    )}
                </div>
                <div className="mt-4 flex justify-center">
                    <Button size="sm" color="secondary-destructive">
                        Excluir
                    </Button>
                </div>
            </div>

            <Tabs
                selectedKey={detailTab}
                onSelectionChange={(key) => setDetailTab(String(key))}
                className="shrink-0 border-b border-secondary px-5"
            >
                <TabList
                    type="underline"
                    size="sm"
                    items={[
                        { id: "attributes", label: "Atributos" },
                        { id: "notes", label: "Notas" },
                    ]}
                    fullWidth
                />
            </Tabs>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
                {detailTab === "attributes" ? (
                    <dl className="space-y-4">
                        <AttributeRow label="E-mail" value={conversation.contactEmail} />
                        {contactAttributeFields.map((field) => (
                            <AttributeRow key={field.id} label={field.label} />
                        ))}
                        <div className="border-t border-secondary pt-4">
                            <h3 className={tessenTypography.overline}>Informações</h3>
                            <ul className="mt-3 space-y-3">
                                <li className="flex items-center gap-2 text-sm text-secondary">
                                    <Phone01 className="size-4 shrink-0 text-fg-quaternary" />
                                    {conversation.contactPhone}
                                </li>
                                <li className="flex items-center gap-2 text-sm text-secondary">
                                    <User01 className="size-4 shrink-0 text-fg-quaternary" />
                                    Convênio: Unimed
                                </li>
                                <li className="flex items-center gap-2 text-sm text-secondary">
                                    <MessageChatCircle className="size-4 shrink-0 text-fg-quaternary" />
                                    {conversation.aiHandledCount !== undefined
                                        ? `${conversation.aiHandledCount} pela IA, ${conversation.humanHandledCount ?? 0} por humano`
                                        : "3 atendimentos anteriores"}
                                </li>
                                {conversation.topSubject && (
                                    <li className="text-sm text-secondary">
                                        Assunto mais recorrente: {conversation.topSubject}
                                    </li>
                                )}
                                {conversation.preferredHours && (
                                    <li className="text-sm text-secondary">Horário preferido: {conversation.preferredHours}</li>
                                )}
                            </ul>
                        </div>
                        <div className="border-t border-secondary pt-4">
                            <h3 className={tessenTypography.overline}>Histórico</h3>
                            <ul className="mt-3 space-y-3">
                                {contactHistory.map((item) => (
                                    <li key={item.id} className="rounded-lg bg-secondary p-3">
                                        <p className="text-sm font-medium text-primary">{item.subject}</p>
                                        <div className="mt-1 flex items-center justify-between">
                                            <span className="text-xs text-tertiary">{item.date}</span>
                                            <StatusBadge status={item.status} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </dl>
                ) : (
                    <p className="text-sm text-tertiary">Nenhuma nota adicional para este contato.</p>
                )}
            </div>
        </div>
    );
};

const AttributeRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex items-start justify-between gap-3">
        <dt className="flex items-center gap-2 text-sm font-medium text-secondary">
            {label === "E-mail" && <Mail01 className="size-4 text-fg-quaternary" />}
            {label}
        </dt>
        <dd className="text-right text-sm">
            {value ? (
                <span className="text-primary">{value}</span>
            ) : (
                <Button color="link-color" size="sm">
                    + Adicionar
                </Button>
            )}
        </dd>
    </div>
);
