"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageChatCircle, Send01, Settings01 } from "@untitledui/icons";
import { ContactDetailsModal } from "@/components/application/tessen/contact-details-modal";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import {
    conversationMessages,
    sortConversationsByPriority,
    type Conversation,
    type ConversationStatus,
    type Message,
} from "@/components/application/tessen/tessen-data";
import { StatusBadge } from "@/components/application/tessen/tessen-badges";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { TextArea } from "@/components/base/textarea/textarea";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

const listTabs = [
    { id: "new", label: "Novos" },
    { id: "pending", label: "Pendentes" },
];

const STATUS_GROUP_LABELS: Partial<Record<ConversationStatus, string>> = {
    aguardando: "Aguardando",
    novo: "Novos",
    "ia-ativa": "IA ativa",
    humano: "Em atendimento",
};

const simulatedAiReply = "Encontrei dois horários disponíveis para amanhã: 10h ou 15h. Qual fica melhor para você?";

function matchesListTab(conversation: Conversation, tab: string): boolean {
    if (tab === "new") return conversation.status === "novo";
    return ["aguardando", "ia-ativa", "humano"].includes(conversation.status);
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
        <aside className="flex h-full min-h-0 w-[340px] shrink-0 flex-col border-r border-secondary">
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

            <ul className="min-h-0 flex-1 overflow-y-auto bg-primary">
                {grouped.length === 0 ? (
                    <li className="px-4 py-8 text-center text-sm text-tertiary">Nenhuma conversa nesta visualização.</li>
                ) : (
                    grouped.map((group) => (
                        <li key={group.label}>
                            <div className="sticky top-0 z-10 border-b border-secondary bg-primary px-4 py-2">
                                <p className="text-xs font-semibold text-tertiary">{group.label}</p>
                            </div>
                            <ul>
                                {group.items.map((conversation) => (
                                    <li key={conversation.id} className="border-b border-secondary">
                                        <button
                                            type="button"
                                            onClick={() => onSelect(conversation.id)}
                                            className={cx(
                                                "flex w-full items-start gap-3 px-4 py-5 text-left transition duration-100 ease-linear hover:bg-primary_hover",
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
                                                <p className="mt-1 truncate text-sm text-secondary">{conversation.lastMessage}</p>
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
}

export const ConversationChatPanel = ({ conversation, messages }: ConversationChatPanelProps) => {
    const closed = isConversationClosed(conversation.status);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [takenOver, setTakenOver] = useState(false);
    const [message, setMessage] = useState("");
    const [liveMessages, setLiveMessages] = useState<Message[]>([]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const willTakeOver = !closed && !takenOver && conversation.status !== "humano";
    const displayStatus = takenOver ? "humano" : conversation.status;

    useEffect(() => {
        setTakenOver(false);
        setMessage("");
        setLiveMessages([]);
        setIsAiTyping(false);
    }, [conversation.id]);

    useEffect(() => {
        if (!willTakeOver) return;

        setIsAiTyping(true);
        timerRef.current = setTimeout(() => {
            setLiveMessages((prev) => [
                ...prev,
                {
                    id: `live-${conversation.id}`,
                    type: "ai",
                    content: simulatedAiReply,
                    timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                },
            ]);
            setIsAiTyping(false);

            timerRef.current = setTimeout(() => setIsAiTyping(true), 2200);
        }, 2200);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [conversation.id, willTakeOver]);

    const handleAssume = () => {
        setTakenOver(true);
    };

    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed) return;

        setLiveMessages((prev) => [
            ...prev,
            {
                id: `sent-${Date.now()}`,
                type: "out",
                content: trimmed,
                timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            },
        ]);
        setMessage("");
    };

    return (
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-primary">
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
                <StatusBadge status={displayStatus} />
            </div>

            <ContactDetailsModal
                conversation={conversation}
                isOpen={isContactModalOpen}
                onOpenChange={setIsContactModalOpen}
            />

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-5">
                {[...messages, ...liveMessages].map((msg) => (
                    <MessageBubble key={msg.id} message={msg} clientName={conversation.contactName} />
                ))}
                {willTakeOver && isAiTyping && <TypingIndicator />}
            </div>

            <div className="relative shrink-0 overflow-hidden border-t border-secondary bg-primary p-4 md:p-5">
                {willTakeOver && (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-16 -left-16 size-72 rounded-full bg-brand-solid/20 blur-2xl"
                    />
                )}
                {closed ? (
                    <p className="rounded-lg bg-secondary px-4 py-3 text-center text-sm text-tertiary">
                        Atendimento encerrado
                    </p>
                ) : willTakeOver ? (
                    <div className="relative flex items-center justify-between gap-16">
                        <div className="flex min-w-0 items-center gap-4">
                            <FeaturedIcon icon={MessageChatCircle} color="brand" theme="light" size="md" />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-primary">A IA está atendendo esta conversa</p>
                                <p className="text-sm text-tertiary">
                                    Assuma para responder diretamente. A IA fica indisponível nesta conversa.
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleAssume}>Assumir conversa</Button>
                    </div>
                ) : (
                    <>
                        <TextArea
                            placeholder="Digite sua mensagem..."
                            rows={3}
                            value={message}
                            onChange={setMessage}
                        />
                        <div className="mt-3 flex justify-end">
                            <Button iconLeading={Send01} isDisabled={!message.trim()} onClick={handleSend}>
                                Enviar
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const TypingIndicator = () => (
    <div className="flex animate-in fade-in justify-end duration-300">
        <div className="flex max-w-[85%] flex-col gap-1 md:max-w-[70%] items-end">
            <div className="rounded-xl rounded-br-none bg-gradient-to-br from-utility-purple-50 to-utility-purple-200 px-4 py-3 ring-1 ring-utility-purple-200 ring-inset">
                <div className="flex items-center gap-1">
                    <span className="size-1.5 animate-bounce rounded-full bg-utility-purple-500 [animation-delay:-0.3s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-utility-purple-500 [animation-delay:-0.15s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-utility-purple-500" />
                </div>
            </div>
        </div>
    </div>
);

const MessageBubble = ({ message, clientName }: { message: Message; clientName: string }) => {
    const isOutgoing = message.type === "out" || message.type === "ai";
    const senderName = message.type === "out" ? "Você" : message.type === "ai" ? "Atendente Tessen" : clientName;
    const textColor =
        message.type === "out" ? "text-utility-brand-700" : message.type === "ai" ? "text-utility-purple-700" : "text-primary";
    const metaColor =
        message.type === "out" ? "text-utility-brand-500" : message.type === "ai" ? "text-utility-purple-500" : "text-quaternary";

    return (
        <div className={cx("flex animate-in fade-in duration-300", isOutgoing ? "justify-end" : "justify-start")}>
            <div className={cx("flex max-w-[85%] flex-col gap-1 md:max-w-[70%]", isOutgoing && "items-end")}>
                <div
                    className={cx(
                        "rounded-xl px-4 py-3",
                        message.type === "out" && "rounded-br-none bg-utility-brand-50 ring-1 ring-utility-brand-200 ring-inset",
                        message.type === "ai" &&
                            "rounded-br-none bg-gradient-to-br from-utility-purple-50 to-utility-purple-200 ring-1 ring-utility-purple-200 ring-inset",
                        message.type === "in" && "rounded-bl-none bg-primary ring-1 ring-secondary ring-inset",
                    )}
                >
                    <div className="mb-1 flex items-center justify-between gap-3">
                        <span className={cx("text-xs font-semibold", metaColor)}>{senderName}</span>
                        <span className={cx("text-xs", metaColor)}>{message.timestamp}</span>
                    </div>
                    <p className={cx("text-sm", textColor)}>{message.content}</p>
                </div>
            </div>
        </div>
    );
};

export function getMessagesForConversation(conversationId: string): Message[] {
    return conversationMessages[conversationId] ?? [];
}
