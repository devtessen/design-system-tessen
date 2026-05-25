"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit05, Send01, Settings01, Stars02, Trash01 } from "@untitledui/icons";
import { AssumeAttendanceBanner } from "@/components/application/tessen/assume-attendance-banner";
import { ContactDetailsModal } from "@/components/application/tessen/contact-details-modal";
import { ConversationContextSidebar } from "@/components/application/tessen/conversation-context-sidebar";
import { MessageDeliveryIndicator } from "@/components/application/tessen/message-delivery-status";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import {
    conversationMessages,
    conversationNeedsAssumeAttendance,
    sortConversationsByPriority,
    type Conversation,
    type ConversationStatus,
    type Message,
} from "@/components/application/tessen/tessen-data";
import { ConfidenceBadge, StatusBadge } from "@/components/application/tessen/tessen-badges";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { TextArea } from "@/components/base/textarea/textarea";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

const listTabs = [
    { id: "new", label: "Novos" },
    { id: "pending", label: "Pendentes" },
];

type ResponseMode = "atendente" | "ia" | "nota";

const STATUS_GROUP_LABELS: Partial<Record<ConversationStatus, string>> = {
    aguardando: "Aguardando",
    novo: "Novos",
    "ia-ativa": "IA ativa",
    humano: "Em atendimento",
};

function matchesListTab(conversation: Conversation, tab: string): boolean {
    if (tab === "new") return conversation.status === "novo";
    return ["aguardando", "ia-ativa", "humano"].includes(conversation.status);
}

function getDefaultResponseMode(status: ConversationStatus): ResponseMode {
    if (status === "resolvido-ia" || status === "resolvido-humano" || status === "abandonado") {
        return "atendente";
    }
    if (status === "humano") return "atendente";
    return "ia";
}

function isConversationClosed(status: ConversationStatus): boolean {
    return status === "resolvido-ia" || status === "resolvido-humano" || status === "abandonado";
}

interface ConversationListPanelProps {
    conversations: Conversation[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export const ConversationListPanel = ({ conversations, selectedId, onSelect }: ConversationListPanelProps) => {
    const [listTab, setListTab] = useState("pending");

    const grouped = useMemo(() => {
        const filtered = sortConversationsByPriority(conversations.filter((c) => matchesListTab(c, listTab)));
        const groups: { label: string; items: Conversation[] }[] = [];
        let currentLabel: string | null = null;

        for (const conversation of filtered) {
            const label =
                conversation.escalationReason === "urgency_keyword"
                    ? "Urgente"
                    : (STATUS_GROUP_LABELS[conversation.status] ?? conversation.status);
            if (label !== currentLabel) {
                currentLabel = label;
                groups.push({ label, items: [] });
            }
            groups[groups.length - 1].items.push(conversation);
        }

        return groups;
    }, [conversations, listTab]);

    return (
        <aside className="flex h-full min-h-0 w-[340px] shrink-0 flex-col border-r border-secondary bg-primary">
            <div className="shrink-0 border-b border-secondary px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h2 className={tessenTypography.cardTitle}>Conversas</h2>
                        <BadgeWithDot color="success" type="modern" size="sm">
                            Disponível
                        </BadgeWithDot>
                    </div>
                    <Tooltip title="Ordenado por urgência: status e tempo de espera" placement="bottom">
                        <Button color="tertiary" size="sm" iconLeading={Settings01} aria-label="Critério de ordenação" />
                    </Tooltip>
                </div>
                <Tabs selectedKey={listTab} onSelectionChange={(key) => setListTab(String(key))} className="mt-3">
                    <TabList type="button-border" size="sm" items={listTabs} fullWidth />
                </Tabs>
            </div>

            <ul className="min-h-0 flex-1 overflow-y-auto">
                {grouped.length === 0 ? (
                    <li className="px-4 py-8 text-center text-sm text-tertiary">Nenhuma conversa nesta visualização.</li>
                ) : (
                    grouped.map((group) => (
                        <li key={group.label}>
                            <div className="sticky top-0 z-10 border-b border-secondary bg-secondary_subtle px-4 py-2">
                                <p className="text-xs font-semibold text-tertiary">{group.label}</p>
                            </div>
                            <ul>
                                {group.items.map((conversation) => (
                                    <li key={conversation.id} className="border-b border-secondary">
                                        <button
                                            type="button"
                                            onClick={() => onSelect(conversation.id)}
                                            className={cx(
                                                "flex w-full items-start gap-3 px-4 py-3 text-left transition duration-100 ease-linear hover:bg-primary_hover",
                                                selectedId === conversation.id && "bg-active",
                                            )}
                                        >
                                            <Avatar
                                                initials={conversation.avatarInitials}
                                                size="md"
                                                status={conversation.status === "aguardando" ? "online" : undefined}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="truncate text-sm font-semibold text-primary">{conversation.contactName}</p>
                                                    <span className="shrink-0 text-xs text-quaternary">{conversation.timestamp}</span>
                                                </div>
                                                <p className="mt-0.5 truncate text-sm text-secondary">{conversation.lastMessage}</p>
                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    <StatusBadge status={conversation.status} />
                                                    {conversation.confidence !== undefined && (
                                                        <ConfidenceBadge value={conversation.confidence} />
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))
                )}
            </ul>
        </aside>
    );
};

interface ConversationChatPanelProps {
    conversation: Conversation;
    messages: Message[];
    onAssume?: () => void;
}

export const ConversationChatPanel = ({ conversation, messages, onAssume }: ConversationChatPanelProps) => {
    const closed = isConversationClosed(conversation.status);
    const defaultMode = getDefaultResponseMode(conversation.status);
    const [responseMode, setResponseMode] = useState<ResponseMode>(defaultMode);
    const [draftByMode, setDraftByMode] = useState<Record<ResponseMode, string>>({
        atendente: "",
        ia: "",
        nota: "",
    });
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [hasAssumed, setHasAssumed] = useState(false);

    const message = draftByMode[responseMode];
    const needsAssume = conversationNeedsAssumeAttendance(conversation) && !hasAssumed;
    const secondaryModes = (["atendente", "ia", "nota"] as ResponseMode[]).filter((m) => m !== responseMode);

    useEffect(() => {
        setResponseMode(getDefaultResponseMode(conversation.status));
        setHasAssumed(false);
    }, [conversation.id, conversation.status]);

    const setMessage = (value: string) => {
        setDraftByMode((prev) => ({ ...prev, [responseMode]: value }));
    };

    const handleAssume = () => {
        setHasAssumed(true);
        setResponseMode("atendente");
        onAssume?.();
    };

    return (
        <div className="flex h-full min-h-0 min-w-0 flex-1">
            <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-secondary">
                <div className="flex shrink-0 items-center justify-between border-b border-secondary bg-primary px-4 py-3 md:px-5">
                    <div className="flex items-center gap-3">
                        <Avatar initials={conversation.avatarInitials} size="md" />
                        <div>
                            <button
                                type="button"
                                onClick={() => setIsContactModalOpen(true)}
                                className="rounded-sm text-left outline-focus-ring transition duration-100 ease-linear hover:text-brand-secondary focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <span className="text-sm font-semibold text-primary">{conversation.contactName}</span>
                            </button>
                            <p className="text-xs text-tertiary">{conversation.contactPhone}</p>
                        </div>
                    </div>
                    <StatusBadge status={hasAssumed ? "humano" : conversation.status} />
                </div>

                {needsAssume && conversation.escalationReason && (
                    <AssumeAttendanceBanner
                        escalationReason={conversation.escalationReason}
                        onAssume={handleAssume}
                    />
                )}

                <ContactDetailsModal
                    conversation={conversation}
                    isOpen={isContactModalOpen}
                    onOpenChange={setIsContactModalOpen}
                />

                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-5">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                </div>

                <div className="shrink-0 border-t border-secondary bg-primary p-4 md:p-5">
                    {closed ? (
                        <p className="rounded-lg bg-secondary px-4 py-3 text-center text-sm text-tertiary">
                            Atendimento encerrado
                        </p>
                    ) : (
                        <>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">
                                    {responseMode === "atendente"
                                        ? "Atendente"
                                        : responseMode === "ia"
                                          ? "Modo IA"
                                          : "Nota interna"}
                                </span>
                                {secondaryModes.length > 0 && (
                                    <Dropdown.Root>
                                        <Dropdown.DotsButton aria-label="Mais opções de resposta" />
                                        <Dropdown.Popover>
                                            <Dropdown.Menu
                                                onAction={(key) => setResponseMode(String(key) as ResponseMode)}
                                            >
                                                {secondaryModes.map((mode) => (
                                                    <Dropdown.Item
                                                        key={mode}
                                                        id={mode}
                                                        label={
                                                            mode === "atendente"
                                                                ? "Atendente"
                                                                : mode === "ia"
                                                                  ? "Modo IA"
                                                                  : "Nota interna"
                                                        }
                                                    />
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown.Root>
                                )}
                                <Tooltip title="Mais opções de resposta" placement="top">
                                    <span className="sr-only">Mais opções</span>
                                </Tooltip>
                            </div>
                            {responseMode === "nota" || responseMode === "ia" ? (
                                <TextArea
                                    placeholder={
                                        responseMode === "nota"
                                            ? "Adicionar nota interna (não visível para o cliente)..."
                                            : "Instruir o agente sobre como responder..."
                                    }
                                    rows={3}
                                    value={message}
                                    onChange={setMessage}
                                />
                            ) : (
                                <TextArea
                                    placeholder="Digite sua mensagem..."
                                    rows={3}
                                    value={message}
                                    onChange={setMessage}
                                />
                            )}
                            <div className="mt-3 flex justify-end">
                                <Button iconLeading={Send01} isDisabled={!message.trim()}>
                                    {responseMode === "nota"
                                        ? "Salvar nota"
                                        : responseMode === "ia"
                                          ? "Instruir agente"
                                          : "Enviar"}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ConversationContextSidebar conversation={conversation} />
        </div>
    );
};

const MessageBubble = ({ message }: { message: Message }) => {
    if (message.type === "note") {
        return (
            <div className="mx-auto w-full max-w-2xl rounded-lg border border-dashed border-secondary bg-secondary_subtle px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-tertiary">
                        Nota de {message.sender ?? "João"} · {message.timestamp}
                    </p>
                    <div className="flex shrink-0 gap-1">
                        <Button color="tertiary" size="sm" iconLeading={Edit05} aria-label="Editar nota" />
                        <Button color="tertiary" size="sm" iconLeading={Trash01} aria-label="Excluir nota" />
                    </div>
                </div>
                <p className="mt-2 text-sm text-primary">{message.content}</p>
            </div>
        );
    }

    const isOutgoing = message.type === "out" || message.type === "ai";

    return (
        <div className={cx("flex", isOutgoing ? "justify-end" : "justify-start")}>
            <div className={cx("flex max-w-[85%] flex-col gap-1 md:max-w-[70%]", isOutgoing && "items-end")}>
                {message.type === "out" && <span className="text-xs font-medium text-tertiary">Você</span>}
                {message.type === "ai" && (
                    <div className="flex items-center gap-1.5">
                        <Stars02 className="size-3.5 text-utility-brand-500" />
                        <span className="text-xs font-medium text-utility-brand-700">{message.sender}</span>
                    </div>
                )}
                <div
                    className={cx(
                        "rounded-xl px-4 py-3",
                        message.type === "in" && "bg-primary ring-1 ring-secondary ring-inset",
                        message.type === "ai" &&
                            "bg-utility-brand-50 text-utility-brand-700 ring-1 ring-utility-brand-200 ring-inset",
                        message.type === "out" && "bg-brand-solid",
                    )}
                >
                    <p
                        className={cx(
                            "text-sm",
                            message.type === "out" && "text-primary_on-brand",
                            message.type === "ai" && "text-utility-brand-700",
                            message.type === "in" && "text-primary",
                        )}
                    >
                        {message.content}
                    </p>
                    <div
                        className={cx(
                            "mt-1 flex items-center gap-1.5",
                            message.type === "out" && "text-tertiary_on-brand",
                            message.type === "ai" && "text-utility-brand-500",
                            message.type === "in" && "text-quaternary",
                        )}
                    >
                        <span className="text-xs">{message.timestamp}</span>
                        {isOutgoing && (
                            <MessageDeliveryIndicator status={message.deliveryStatus} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export function getMessagesForConversation(conversationId: string): Message[] {
    return conversationMessages[conversationId] ?? [];
}
