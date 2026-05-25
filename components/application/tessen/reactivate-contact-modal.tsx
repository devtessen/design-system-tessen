"use client";

import { useState } from "react";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import type { Conversation } from "@/components/application/tessen/tessen-data";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { TextArea } from "@/components/base/textarea/textarea";

const defaultReactivateMessage = (name: string) =>
    `Olá, ${name}! 👋 Notei que você entrou em contato recentemente mas não conseguimos concluir seu atendimento. Posso ajudar com algo agora?`;

interface ReactivateContactModalProps {
    contact: Conversation;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ReactivateContactModal = ({ contact, isOpen, onOpenChange }: ReactivateContactModalProps) => {
    const [message, setMessage] = useState(() => defaultReactivateMessage(contact.contactName));

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
            <Modal className="w-full max-w-lg">
                <Dialog className="outline-hidden">
                    <div className="relative p-6">
                        <CloseButton size="sm" className="absolute top-4 right-4" onClick={() => onOpenChange(false)} />
                        <h2 className="text-lg font-semibold text-primary">Reativar contato</h2>
                        <p className="mt-1 text-sm text-tertiary">
                            Mensagem sugerida pela IA — edite antes de enviar para {contact.contactPhone}
                        </p>
                        <TextArea className="mt-4" rows={5} value={message} onChange={setMessage} />
                        <div className="mt-6 flex justify-end gap-3">
                            <Button color="secondary" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={() => onOpenChange(false)}>Enviar e reativar</Button>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};
