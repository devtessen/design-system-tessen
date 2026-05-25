import type { NavAccountType } from "@/components/application/app-navigation/base-components/nav-account-card";
import type { EngagementLabel } from "@/components/application/tessen/tessen-badges";

export type ConversationStatus = "novo" | "ia-ativa" | "aguardando" | "humano" | "resolvido-ia" | "resolvido-humano" | "abandonado";

export type EscalationReason = "unknown_subject" | "low_confidence" | "urgency_keyword" | "timeout" | "repeated_question";

export type MessageDeliveryStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export type InboxFolderId = "all" | "unassigned" | "assigned-me" | "resolved";

export interface Conversation {
    id: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    avatarInitials: string;
    lastMessage: string;
    timestamp: string;
    status: ConversationStatus;
    confidence?: number;
    niche?: string;
    engagementLabel?: EngagementLabel;
    contactsLast30Days?: number;
    lastContactDaysAgo?: number;
    assignedToMe?: boolean;
    waitingMinutes?: number;
    escalationReason?: EscalationReason;
    detectedIntent?: string;
    intentConfidence?: number;
    lastIntent?: string;
    lastIntentDate?: string;
    aiHandledCount?: number;
    humanHandledCount?: number;
    topSubject?: string;
    preferredHours?: string;
    abandonmentReason?: string;
    /** @deprecated Use engagementLabel — mantido para compatibilidade de demos antigas */
    engagementScore?: number;
}

export const accountSettings = {
    slaThresholdMinutes: 15,
    aiResolutionGoalPercent: 70,
};

export const inboxOrganizationOptions = [{ id: "tessen-clinic", label: "Clínica Saúde Total" }];

export const inboxChannelOptions = [
    { id: "all", label: "Todos os canais" },
    { id: "whatsapp", label: "WhatsApp" },
];

export const inboxFolders: { id: InboxFolderId; label: string }[] = [
    { id: "all", label: "Todas as conversas" },
    { id: "unassigned", label: "Sem atribuição" },
    { id: "assigned-me", label: "Atribuídas a mim" },
    { id: "resolved", label: "Resolvidas" },
];

export const customInboxes = [{ id: "vip", label: "Clientes VIP" }];

export const contactAttributeFields = [
    { id: "firstName", label: "Nome" },
    { id: "lastName", label: "Sobrenome" },
    { id: "phone", label: "Telefone" },
    { id: "url", label: "URL" },
] as const;

export interface Message {
    id: string;
    type: "in" | "out" | "ai" | "note";
    content: string;
    timestamp: string;
    sender?: string;
    deliveryStatus?: MessageDeliveryStatus;
}

export interface ActivityEvent {
    id: string;
    type: "escalacao" | "resolucao" | "mensagem" | "assuncao";
    description: string;
    contactName: string;
    conversationId: string;
    timestamp: string;
    inlineAction?: "assume" | "view";
}

export const dashboardMetrics = {
    totalToday: 87,
    resolvedByAi: 58,
    waitingHuman: 3,
    oldestWaitingMinutes: 45,
    avgResponseTime: "2m 14s",
    aiResolutionRate: 67,
    afterHoursCount: 23,
    afterHoursAiResolutionRate: 91,
};

export const dashboardKpis = [
    { label: "Total hoje", value: dashboardMetrics.totalToday, change: "+12%", trend: "up" as const, sublabel: "Mensagens recebidas" },
    {
        label: "Resolvidos pela IA",
        value: dashboardMetrics.resolvedByAi,
        change: "+4%",
        trend: "up" as const,
        sublabel: `${dashboardMetrics.aiResolutionRate}% do total`,
    },
    {
        label: "Fora do horário",
        value: dashboardMetrics.afterHoursCount,
        change: "31% do total",
        trend: "up" as const,
        sublabel: `${dashboardMetrics.afterHoursAiResolutionRate}% resolvidos pela IA`,
    },
    {
        label: "Tempo médio",
        value: dashboardMetrics.avgResponseTime,
        change: "-18s",
        trend: "up" as const,
        sublabel: "Primeira resposta",
    },
];

export const activityFeed: ActivityEvent[] = [
    {
        id: "1",
        type: "escalacao",
        description: "Escalação por baixa confiança",
        contactName: "Maria Silva",
        conversationId: "1",
        timestamp: "há 2 min",
        inlineAction: "assume",
    },
    {
        id: "2",
        type: "resolucao",
        description: "Atendimento resolvido pela IA",
        contactName: "João Pereira",
        conversationId: "2",
        timestamp: "há 5 min",
    },
    {
        id: "3",
        type: "mensagem",
        description: "Nova mensagem recebida",
        contactName: "Ana Costa",
        conversationId: "3",
        timestamp: "há 8 min",
        inlineAction: "view",
    },
    {
        id: "4",
        type: "assuncao",
        description: "Atendente assumiu a conversa",
        contactName: "Carlos Mendes",
        conversationId: "4",
        timestamp: "há 12 min",
    },
    {
        id: "5",
        type: "resolucao",
        description: "Atendimento resolvido pela IA",
        contactName: "Fernanda Lima",
        conversationId: "5",
        timestamp: "há 18 min",
    },
];

const STATUS_PRIORITY_WEIGHT: Record<ConversationStatus, number> = {
    aguardando: 3,
    novo: 3,
    "ia-ativa": 2,
    humano: 1,
    "resolvido-ia": 0,
    "resolvido-humano": 0,
    abandonado: 0,
};

/** Ordenação composta: peso do status + minutos aguardando / 10 (PRD UX-007). */
export function getConversationPriority(conversation: Conversation): number {
    const statusWeight = conversation.escalationReason === "urgency_keyword" ? 4 : STATUS_PRIORITY_WEIGHT[conversation.status];
    const waitingPart = (conversation.waitingMinutes ?? 0) / 10;
    return statusWeight * 3 + waitingPart;
}

export function sortConversationsByPriority(items: Conversation[]): Conversation[] {
    return [...items].sort((a, b) => getConversationPriority(b) - getConversationPriority(a));
}

export function formatWaitingDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/** Conversa que precisa de intervenção humana (ex.: escalação ou fila de espera). */
export function conversationNeedsAssumeAttendance(conversation: Conversation): boolean {
    return conversation.status === "aguardando";
}

export const conversations: Conversation[] = [
    {
        id: "1",
        contactName: "Maria Silva",
        contactPhone: "+55 48 99912-3456",
        contactEmail: "maria.silva@email.com",
        avatarInitials: "MS",
        assignedToMe: false,
        lastMessage: "Preciso remarcar minha consulta de amanhã",
        timestamp: "14:32",
        status: "aguardando",
        confidence: 42,
        niche: "Clínica",
        engagementLabel: "frequente",
        contactsLast30Days: 4,
        lastContactDaysAgo: 0,
        waitingMinutes: 45,
        escalationReason: "low_confidence",
        detectedIntent: "Remarcar consulta",
        intentConfidence: 42,
        lastIntent: "Agendamento",
        lastIntentDate: "20 mai, atendimento anterior",
        aiHandledCount: 8,
        humanHandledCount: 2,
        topSubject: "Agendamento (60%)",
        preferredHours: "Manhã (9h–11h)",
    },
    {
        id: "2",
        contactName: "João Pereira",
        contactPhone: "+55 48 98876-5432",
        avatarInitials: "JP",
        lastMessage: "Qual o horário de funcionamento?",
        timestamp: "14:28",
        status: "resolvido-ia",
        confidence: 91,
        niche: "Clínica",
        engagementLabel: "esporadico",
        contactsLast30Days: 2,
        lastContactDaysAgo: 1,
        detectedIntent: "Dúvida sobre convênio",
        intentConfidence: 91,
    },
    {
        id: "3",
        contactName: "Ana Costa",
        contactPhone: "+55 48 99765-4321",
        avatarInitials: "AC",
        lastMessage: "Vocês aceitam plano Unimed?",
        timestamp: "14:25",
        status: "novo",
        confidence: 78,
        niche: "Clínica",
        engagementLabel: "frequente",
        contactsLast30Days: 3,
        lastContactDaysAgo: 0,
        detectedIntent: "Dúvida sobre convênio",
        intentConfidence: 78,
    },
    {
        id: "4",
        contactName: "Carlos Mendes",
        contactPhone: "+55 48 99654-3210",
        avatarInitials: "CM",
        lastMessage: "Obrigado, já resolvi!",
        timestamp: "14:10",
        status: "humano",
        confidence: 55,
        niche: "Clínica",
        engagementLabel: "frequente",
        contactsLast30Days: 5,
        lastContactDaysAgo: 0,
        assignedToMe: true,
    },
    {
        id: "5",
        contactName: "Fernanda Lima",
        contactPhone: "+55 48 99543-2109",
        avatarInitials: "FL",
        lastMessage: "Quero agendar uma consulta para sexta",
        timestamp: "13:55",
        status: "resolvido-ia",
        confidence: 88,
        niche: "Clínica",
        engagementLabel: "esporadico",
        contactsLast30Days: 1,
        lastContactDaysAgo: 5,
    },
    {
        id: "6",
        contactName: "Roberto Alves",
        contactPhone: "+55 48 99432-1098",
        avatarInitials: "RA",
        lastMessage: "Ainda estou aguardando retorno",
        timestamp: "13:40",
        status: "abandonado",
        confidence: 35,
        niche: "Clínica",
        engagementLabel: "em-risco",
        contactsLast30Days: 1,
        lastContactDaysAgo: 14,
        abandonmentReason: "timeout",
    },
];

export const conversationMessages: Record<string, Message[]> = {
    "1": [
        {
            id: "m1",
            type: "in",
            content: "Olá, boa tarde!",
            timestamp: "14:20",
        },
        {
            id: "m2",
            type: "ai",
            content: "Olá! Bem-vindo à Clínica Saúde Total. Sou a assistente virtual. Como posso ajudar você hoje?",
            timestamp: "14:20",
            sender: "Assistente Saúde",
            deliveryStatus: "read",
        },
        {
            id: "m3",
            type: "in",
            content: "Preciso remarcar minha consulta de amanhã",
            timestamp: "14:32",
        },
        {
            id: "m4",
            type: "ai",
            content: "Entendo que você precisa remarcar. Para confirmar, poderia me informar seu nome completo e a data original da consulta?",
            timestamp: "14:32",
            sender: "Assistente Saúde",
            deliveryStatus: "delivered",
        },
        {
            id: "m5",
            type: "note",
            content: "Cliente frequente — priorizar remarcação.",
            timestamp: "14:33",
            sender: "João",
        },
        {
            id: "m6",
            type: "out",
            content: "Claro! Vou verificar os horários disponíveis para você.",
            timestamp: "14:35",
            deliveryStatus: "read",
        },
    ],
};

export const escalationBreakdown = [
    { reason: "unknown_subject" as EscalationReason, label: "Assunto não reconhecido", count: 26, percent: 42 },
    { reason: "low_confidence" as EscalationReason, label: "Baixa confiança", count: 20, percent: 31 },
    { reason: "urgency_keyword" as EscalationReason, label: "Palavra de urgência", count: 11, percent: 18 },
    { reason: "timeout" as EscalationReason, label: "Timeout (10 min)", count: 6, percent: 9 },
];

export const escalationReasonLabels: Record<EscalationReason, string> = {
    unknown_subject: "Assunto não reconhecido",
    low_confidence: "Baixa confiança",
    urgency_keyword: "Palavra de urgência",
    timeout: "Timeout",
    repeated_question: "Pergunta repetida",
};

export const thresholdImpactByValue: Record<number, number> = {
    30: 12,
    40: 18,
    50: 22,
    55: 24,
    60: 26,
    65: 28,
    70: 32,
    75: 38,
    80: 45,
    85: 52,
    90: 61,
    95: 72,
};

export const nichePresets = {
    clinica: {
        agentName: "Sofia",
        tone: "profissional",
        does: ["agendar", "convenios", "coletar-dados"],
        doesNot: ["diagnosticos", "exames"],
        minConfidence: 65,
        timeoutMinutes: 10,
        urgencyKeywords: "dor, emergência, urgente, febre alta",
    },
} as const;

export const csatMetrics = {
    overall: 4.6,
    overallChange: "+0.2",
    sampleSize: 34,
    periodDays: 7,
    ai: { score: 4.4, sample: 28 },
    human: { score: 4.9, sample: 6 },
};

export const topIntents = [
    { intent: "Agendamento", percent: 34 },
    { intent: "Remarcação", percent: 22 },
    { intent: "Dúvida sobre convênio", percent: 18 },
    { intent: "Cancelamento", percent: 12 },
    { intent: "Horário de funcionamento", percent: 8 },
];

export const contactHistory = [
    { id: "h1", date: "24/05/2025", subject: "Agendamento de consulta", status: "resolvido-ia" as ConversationStatus },
    { id: "h2", date: "18/05/2025", subject: "Dúvida sobre convênio", status: "resolvido-humano" as ConversationStatus },
    { id: "h3", date: "10/05/2025", subject: "Cancelamento", status: "resolvido-ia" as ConversationStatus },
];

export const reportKpis = [
    { label: "Taxa de resolução IA", value: "67%", change: "+4%", trend: "up" as const },
    { label: "Tempo médio de resposta", value: "2m 14s", change: "-18s", trend: "up" as const },
    { label: "Taxa de escalação", value: "28%", change: "-3%", trend: "up" as const, sublabel: "Média: 4m30s antes de escalar" },
    { label: "Fora do horário", value: "23", change: "31% do total", trend: "up" as const, sublabel: "91% resolvidos pela IA" },
];

export const dailyVolumeData = [
    { day: "Seg", ia: 45, humano: 12, abandonado: 3 },
    { day: "Ter", ia: 52, humano: 15, abandonado: 2 },
    { day: "Qua", ia: 48, humano: 11, abandonado: 4 },
    { day: "Qui", ia: 58, humano: 14, abandonado: 2 },
    { day: "Sáb", ia: 22, humano: 4, abandonado: 1 },
    { day: "Dom", ia: 18, humano: 3, abandonado: 1 },
];

export const confidenceTrendData = [
    { week: "Sem 1", confidence: 62 },
    { week: "Sem 2", confidence: 64 },
    { week: "Sem 3", confidence: 66 },
    { week: "Sem 4", confidence: 67 },
];

export const statusLabels: Record<ConversationStatus, string> = {
    novo: "Novo",
    "ia-ativa": "IA ativa",
    aguardando: "Aguardando",
    humano: "Em atendimento",
    "resolvido-ia": "Resolvido IA",
    "resolvido-humano": "Resolvido humano",
    abandonado: "Abandonado",
};

export const statusColors: Record<ConversationStatus, "brand" | "success" | "warning" | "error" | "gray" | "blue"> = {
    novo: "blue",
    "ia-ativa": "brand",
    aguardando: "warning",
    humano: "blue",
    "resolvido-ia": "success",
    "resolvido-humano": "success",
    abandonado: "gray",
};

export const tessenAccounts: NavAccountType[] = [
    {
        id: "joao",
        name: "João",
        email: "joao@tessen.com",
        avatar: "https://www.untitledui.com/images/avatars/drew-cano?fm=webp&q=80",
        status: "online",
    },
];
