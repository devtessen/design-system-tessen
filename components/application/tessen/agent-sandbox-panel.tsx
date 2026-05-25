"use client";

import { useState } from "react";
import { RefreshCw05, Stars02, XClose } from "@untitledui/icons";
import { ConfidenceBadge } from "@/components/application/tessen/tessen-badges";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Button } from "@/components/base/buttons/button";
import { TextArea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";

interface SandboxMessage {
    id: string;
    role: "user" | "agent";
    content: string;
    confidence?: number;
}

interface AgentSandboxPanelProps {
    hasUnsavedChanges: boolean;
    isAgentActive: boolean;
    onClose: () => void;
    onActivate: () => void;
}

export const AgentSandboxPanel = ({
    hasUnsavedChanges,
    isAgentActive,
    onClose,
    onActivate,
}: AgentSandboxPanelProps) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<SandboxMessage[]>([
        {
            id: "welcome",
            role: "agent",
            content: "Olá! Sou a assistente virtual. Como posso ajudar você hoje?",
            confidence: 88,
        },
    ]);

    const statusBanner = hasUnsavedChanges
        ? "Testando configuração não salva — salve antes de ativar"
        : isAgentActive
          ? "Este é o agente que está atendendo seus pacientes agora"
          : "Testando configuração atual do agente";

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg: SandboxMessage = { id: `u-${Date.now()}`, role: "user", content: input.trim() };
        const agentMsg: SandboxMessage = {
            id: `a-${Date.now()}`,
            role: "agent",
            content: "Entendi sua mensagem. Em produção, o agente responderia com base na configuração atual.",
            confidence: 82,
        };
        setMessages((prev) => [...prev, userMsg, agentMsg]);
        setInput("");
    };

    const handleClear = () => {
        setMessages([
            {
                id: "welcome",
                role: "agent",
                content: "Olá! Sou a assistente virtual. Como posso ajudar você hoje?",
                confidence: 88,
            },
        ]);
    };

    return (
        <aside className="flex h-full w-full max-w-md shrink-0 flex-col border-l border-secondary bg-primary shadow-lg">
            <div className="flex items-center justify-between border-b border-secondary px-4 py-3">
                <div>
                    <h2 className={tessenTypography.cardTitle}>Modo sandbox</h2>
                    <p className="text-xs text-tertiary">Nada é enviado para o WhatsApp</p>
                </div>
                <Button color="tertiary" size="sm" iconLeading={XClose} aria-label="Fechar sandbox" onClick={onClose} />
            </div>

            <div
                className={cx(
                    "mx-4 mt-3 rounded-lg px-3 py-2 text-xs font-medium",
                    hasUnsavedChanges ? "bg-warning-primary text-warning-primary" : "bg-brand-primary text-brand-secondary",
                )}
            >
                {statusBanner}
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cx("flex flex-col gap-1", msg.role === "user" ? "items-end" : "items-start")}
                    >
                        {msg.role === "agent" && (
                            <div className="flex items-center gap-1">
                                <Stars02 className="size-3.5 text-brand-secondary" />
                                <span className="text-xs text-tertiary">Agente</span>
                            </div>
                        )}
                        <div
                            className={cx(
                                "max-w-[90%] rounded-xl px-3 py-2 text-sm",
                                msg.role === "user" ? "bg-brand-solid text-primary_on-brand" : "bg-secondary text-primary",
                            )}
                        >
                            {msg.content}
                        </div>
                        {msg.confidence !== undefined && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-tertiary">Confiança:</span>
                                <ConfidenceBadge value={msg.confidence} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="border-t border-secondary p-4">
                <TextArea
                    placeholder="Digite como se fosse um paciente..."
                    rows={2}
                    value={input}
                    onChange={setInput}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={handleSend} isDisabled={!input.trim()}>
                        Enviar
                    </Button>
                    <Button size="sm" color="secondary" iconLeading={RefreshCw05} onClick={handleClear}>
                        Limpar conversa
                    </Button>
                    <Button size="sm" color="primary" onClick={onActivate}>
                        Usar esse agente →
                    </Button>
                </div>
            </div>
        </aside>
    );
};
