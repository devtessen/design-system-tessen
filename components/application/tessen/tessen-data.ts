import type { NavAccountType } from "@/components/application/app-navigation/base-components/nav-account-card";
import type { EngagementLabel } from "@/components/application/tessen/tessen-badges";

export type ConversationStatus = "novo" | "ia-ativa" | "aguardando" | "humano" | "resolvido-ia" | "resolvido-humano" | "abandonado";

export type ConversationChannel = "whatsapp" | "telegram" | "webchat";

export type ClienteConversationDisplayStatus = "novo" | "em-atendimento" | "aguardando" | "resolvido-ia" | "escalado";

export const clienteConversationDisplayLabels: Record<ClienteConversationDisplayStatus, string> = {
    novo: "Novo",
    "em-atendimento": "Em atendimento",
    aguardando: "Aguardando",
    "resolvido-ia": "Resolvido IA",
    escalado: "Escalado",
};

export const clienteConversationDisplayColors: Record<ClienteConversationDisplayStatus, "brand" | "success" | "warning" | "error" | "gray" | "blue"> = {
    novo: "blue",
    "em-atendimento": "brand",
    aguardando: "warning",
    "resolvido-ia": "success",
    escalado: "error",
};

export function getClienteConversationDisplayStatus(status: ConversationStatus): ClienteConversationDisplayStatus {
    switch (status) {
        case "novo":
            return "novo";
        case "ia-ativa":
            return "em-atendimento";
        case "aguardando":
        case "abandonado":
            return "aguardando";
        case "humano":
            return "escalado";
        case "resolvido-ia":
        case "resolvido-humano":
            return "resolvido-ia";
    }
}

export function conversationNeedsClienteHighlight(conversation: Conversation): boolean {
    const display = getClienteConversationDisplayStatus(conversation.status);
    return display === "aguardando" || display === "escalado";
}

export type AgentWorkspaceStatus = "ativo" | "pausado" | "erro";

export const agentWorkspaceStatus = {
    status: "ativo" as AgentWorkspaceStatus,
    label: "Agente ativo",
    errorChannel: undefined as string | undefined,
};

export type ClienteOverviewPeriod = "today" | "week" | "month";

export const clienteOverviewMetricsByPeriod: Record<
    ClienteOverviewPeriod,
    { pendentes: number; agendamentos: number; confirmados: number; noShows: number }
> = {
    today: { pendentes: 3, agendamentos: 8, confirmados: 5, noShows: 1 },
    week: { pendentes: 7, agendamentos: 34, confirmados: 28, noShows: 4 },
    month: { pendentes: 12, agendamentos: 142, confirmados: 118, noShows: 11 },
};

export const clienteOverviewMetricLabels = [
    { key: "pendentes" as const, label: "Pendentes" },
    { key: "agendamentos" as const, label: "Agendamentos" },
    { key: "confirmados" as const, label: "Confirmados" },
    { key: "noShows" as const, label: "No-shows" },
];

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
    channel?: ConversationChannel;
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
    type: "in" | "out" | "ai";
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
        channel: "whatsapp",
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
        channel: "whatsapp",
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
        channel: "telegram",
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
        channel: "whatsapp",
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
        channel: "webchat",
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
        channel: "whatsapp",
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
            type: "in",
            content: "Maria Silva, minha consulta original é amanhã às 14h.",
            timestamp: "14:33",
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

export type TessenNicheId = "clinica" | "salao" | "autonomo" | "startup";

export const tessenNicheLabels: Record<TessenNicheId, string> = {
    clinica: "Clínica médica",
    salao: "Salão e estética",
    autonomo: "Autônomo",
    startup: "Startup B2C",
};

export interface TessenNicheAgentPreset {
    agentName: string;
    tone: string;
    does: string[];
    doesNot: string[];
    minConfidence: number;
    timeoutMinutes: number;
    urgencyKeywords: string;
}

export const nichePresets: Record<TessenNicheId, TessenNicheAgentPreset> = {
    clinica: {
        agentName: "Sofia",
        tone: "profissional",
        does: ["agendar", "convenios", "coletar-dados"],
        doesNot: ["diagnosticos", "exames"],
        minConfidence: 65,
        timeoutMinutes: 10,
        urgencyKeywords: "dor, emergência, urgente, febre alta",
    },
    salao: {
        agentName: "Lia",
        tone: "informal",
        does: ["agendar", "confirmacoes", "horarios"],
        doesNot: ["descontos"],
        minConfidence: 60,
        timeoutMinutes: 15,
        urgencyKeywords: "urgente, reclamação",
    },
    autonomo: {
        agentName: "Assistente",
        tone: "profissional",
        does: ["agendar", "coletar-dados", "horarios"],
        doesNot: ["diagnosticos", "descontos"],
        minConfidence: 70,
        timeoutMinutes: 10,
        urgencyKeywords: "urgente, emergência",
    },
    startup: {
        agentName: "Max",
        tone: "informal",
        does: ["horarios", "confirmacoes", "coletar-dados"],
        doesNot: ["descontos", "exames"],
        minConfidence: 55,
        timeoutMinutes: 20,
        urgencyKeywords: "bug, não funciona, urgente",
    },
};

export type TessenNicheAgentStatus = "ativo" | "rascunho";

export interface TessenNicheAgent {
    id: TessenNicheId;
    nicheLabel: string;
    agentName: string;
    description: string;
    clientsCount: number;
    minConfidence: number;
    status: TessenNicheAgentStatus;
    updatedAt: string;
}

export const tessenNicheAgents: TessenNicheAgent[] = [
    {
        id: "clinica",
        nicheLabel: tessenNicheLabels.clinica,
        agentName: nichePresets.clinica.agentName,
        description: "Agendamentos, convênios e triagem inicial para clínicas e consultórios médicos.",
        clientsCount: 2,
        minConfidence: nichePresets.clinica.minConfidence,
        status: "ativo",
        updatedAt: "Hoje, 09:42",
    },
    {
        id: "salao",
        nicheLabel: tessenNicheLabels.salao,
        agentName: nichePresets.salao.agentName,
        description: "Reservas, confirmações e informações de serviços para salões e estética.",
        clientsCount: 1,
        minConfidence: nichePresets.salao.minConfidence,
        status: "ativo",
        updatedAt: "Ontem, 16:20",
    },
    {
        id: "autonomo",
        nicheLabel: tessenNicheLabels.autonomo,
        agentName: nichePresets.autonomo.agentName,
        description: "Agenda simplificada e coleta de dados para profissionais autônomos.",
        clientsCount: 1,
        minConfidence: nichePresets.autonomo.minConfidence,
        status: "ativo",
        updatedAt: "22/05/2025",
    },
    {
        id: "startup",
        nicheLabel: tessenNicheLabels.startup,
        agentName: nichePresets.startup.agentName,
        description: "Suporte B2C com tom descontraído, horários e confirmações em escala.",
        clientsCount: 1,
        minConfidence: nichePresets.startup.minConfidence,
        status: "rascunho",
        updatedAt: "18/05/2025",
    },
];

export const tessenNicheAgentStatusLabels: Record<TessenNicheAgentStatus, string> = {
    ativo: "Ativo",
    rascunho: "Rascunho",
};

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

export interface AttendanceVolumeDatum {
    label: string;
    ia: number;
    humano: number;
    abandonado: number;
}

export const attendanceVolumeByPeriod: Record<ClienteOverviewPeriod, AttendanceVolumeDatum[]> = {
    today: [
        { label: "8h", ia: 4, humano: 1, abandonado: 0 },
        { label: "10h", ia: 7, humano: 2, abandonado: 0 },
        { label: "12h", ia: 11, humano: 3, abandonado: 1 },
        { label: "14h", ia: 9, humano: 4, abandonado: 0 },
        { label: "16h", ia: 8, humano: 2, abandonado: 1 },
        { label: "18h", ia: 6, humano: 1, abandonado: 0 },
    ],
    week: [
        { label: "Seg", ia: 45, humano: 12, abandonado: 3 },
        { label: "Ter", ia: 52, humano: 15, abandonado: 2 },
        { label: "Qua", ia: 48, humano: 11, abandonado: 4 },
        { label: "Qui", ia: 58, humano: 14, abandonado: 2 },
        { label: "Sex", ia: 41, humano: 10, abandonado: 3 },
        { label: "Sáb", ia: 22, humano: 4, abandonado: 1 },
        { label: "Dom", ia: 18, humano: 3, abandonado: 1 },
    ],
    month: [
        { label: "Sem 1", ia: 198, humano: 52, abandonado: 14 },
        { label: "Sem 2", ia: 212, humano: 48, abandonado: 11 },
        { label: "Sem 3", ia: 225, humano: 55, abandonado: 9 },
        { label: "Sem 4", ia: 231, humano: 49, abandonado: 12 },
    ],
};

export type ReportVolumePeriod = "day" | "week" | "month";

const reportToOverviewPeriod: Record<ReportVolumePeriod, ClienteOverviewPeriod> = {
    day: "today",
    week: "week",
    month: "month",
};

export function toClienteOverviewPeriod(period: ClienteOverviewPeriod | ReportVolumePeriod): ClienteOverviewPeriod {
    if (period === "day") return "today";
    return period;
}

export function getAttendanceVolumeData(period: ClienteOverviewPeriod | ReportVolumePeriod): AttendanceVolumeDatum[] {
    return attendanceVolumeByPeriod[toClienteOverviewPeriod(period)];
}

/** @deprecated Use attendanceVolumeByPeriod.week */
export const dailyVolumeData = attendanceVolumeByPeriod.week;

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

export type TessenClientStatus = "ativo" | "trial" | "inativo";

export interface TessenClientAccount {
    id: string;
    name: string;
    niche: string;
    plan: string;
    status: TessenClientStatus;
    agentName: string;
    conversationsToday: number;
    aiResolutionRate: number;
    createdAt: string;
}

export const tessenClientAccounts: TessenClientAccount[] = [
    {
        id: "saude-total",
        name: "Clínica Saúde Total",
        niche: "Clínica médica",
        plan: "Profissional",
        status: "ativo",
        agentName: "Sofia",
        conversationsToday: 87,
        aiResolutionRate: 67,
        createdAt: "12/01/2025",
    },
    {
        id: "estetica-bella",
        name: "Estética Bella",
        niche: "Salão e estética",
        plan: "Profissional",
        status: "ativo",
        agentName: "Lia",
        conversationsToday: 42,
        aiResolutionRate: 71,
        createdAt: "03/02/2025",
    },
    {
        id: "dr-silva",
        name: "Dr. Silva — Consultório",
        niche: "Autônomo",
        plan: "Essencial",
        status: "trial",
        agentName: "Assistente",
        conversationsToday: 12,
        aiResolutionRate: 58,
        createdAt: "18/04/2025",
    },
    {
        id: "fit-startup",
        name: "FitApp Suporte",
        niche: "Startup B2C",
        plan: "Essencial",
        status: "ativo",
        agentName: "Max",
        conversationsToday: 156,
        aiResolutionRate: 74,
        createdAt: "28/11/2024",
    },
    {
        id: "odontoprime",
        name: "OdontoPrime",
        niche: "Clínica médica",
        plan: "Profissional",
        status: "inativo",
        agentName: "Ana",
        conversationsToday: 0,
        aiResolutionRate: 0,
        createdAt: "05/09/2024",
    },
];

export const tessenClientStatusLabels: Record<TessenClientStatus, string> = {
    ativo: "Ativo",
    trial: "Trial",
    inativo: "Inativo",
};

export type AppointmentStatus = "confirmado" | "aguardando-confirmacao" | "nao-confirmou" | "cancelado";

export type AppointmentSource = ConversationChannel | "manual";

export interface Appointment {
    id: string;
    patientName: string;
    patientInitials: string;
    patientAge: number;
    patientGender: "Feminino" | "Masculino";
    time: string;
    date: string;
    dayLabel: string;
    service?: string;
    notes?: string;
    status: AppointmentStatus;
    cancellationReason?: string;
    source: AppointmentSource;
    followUpSent?: string;
    followUpResponse?: string;
    conversationId?: string;
    hasMessagingChannel: boolean;
}

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
    confirmado: "Confirmado",
    "aguardando-confirmacao": "Aguardando confirmação",
    "nao-confirmou": "Cancelado",
    cancelado: "Cancelado",
};

export const appointmentStatusColors: Record<AppointmentStatus, "success" | "warning" | "error" | "gray"> = {
    confirmado: "success",
    "aguardando-confirmacao": "warning",
    "nao-confirmou": "error",
    cancelado: "error",
};

export const appointments: Appointment[] = [
    {
        id: "a1",
        patientName: "Maria Silva",
        patientInitials: "MS",
        patientAge: 34,
        patientGender: "Feminino",
        time: "09:00",
        date: "2026-06-04",
        dayLabel: "Hoje",
        service: "Consulta clínica geral",
        notes: "Primeira consulta — pediu horário da manhã",
        status: "aguardando-confirmacao",
        source: "whatsapp",
        followUpSent: "Ontem, 18:30",
        followUpResponse: "Sem resposta",
        conversationId: "1",
        hasMessagingChannel: true,
    },
    {
        id: "a2",
        patientName: "João Pereira",
        patientInitials: "JP",
        patientAge: 41,
        patientGender: "Masculino",
        time: "10:30",
        date: "2026-06-04",
        dayLabel: "Hoje",
        service: "Retorno",
        status: "confirmado",
        source: "whatsapp",
        followUpSent: "Hoje, 08:00",
        followUpResponse: "Confirmado",
        conversationId: "2",
        hasMessagingChannel: true,
    },
    {
        id: "a3",
        patientName: "Ana Costa",
        patientInitials: "AC",
        patientAge: 28,
        patientGender: "Feminino",
        time: "14:00",
        date: "2026-06-04",
        dayLabel: "Hoje",
        service: "Avaliação estética",
        status: "confirmado",
        source: "telegram",
        conversationId: "3",
        hasMessagingChannel: true,
    },
    {
        id: "a4",
        patientName: "Carlos Mendes",
        patientInitials: "CM",
        patientAge: 52,
        patientGender: "Masculino",
        time: "15:30",
        date: "2026-06-04",
        dayLabel: "Hoje",
        status: "nao-confirmou",
        source: "whatsapp",
        followUpSent: "Hoje, 09:15",
        hasMessagingChannel: true,
        conversationId: "4",
    },
    {
        id: "a5",
        patientName: "Fernanda Lima",
        patientInitials: "FL",
        patientAge: 23,
        patientGender: "Feminino",
        time: "11:00",
        date: "2026-06-05",
        dayLabel: "Qui, 05/06",
        service: "Consulta",
        status: "aguardando-confirmacao",
        source: "webchat",
        hasMessagingChannel: false,
        conversationId: "5",
    },
    {
        id: "a6",
        patientName: "Roberto Alves",
        patientInitials: "RA",
        patientAge: 47,
        patientGender: "Masculino",
        time: "16:00",
        date: "2026-06-06",
        dayLabel: "Sex, 06/06",
        status: "cancelado",
        cancellationReason: "Paciente remarcou para outra clínica",
        source: "manual",
        hasMessagingChannel: true,
    },
    {
        id: "a7",
        patientName: "Patrícia Souza",
        patientInitials: "PS",
        patientAge: 39,
        patientGender: "Feminino",
        time: "09:30",
        date: "2026-06-09",
        dayLabel: "Seg, 09/06",
        service: "Exame de rotina",
        status: "confirmado",
        source: "whatsapp",
        hasMessagingChannel: true,
    },
    {
        id: "a8",
        patientName: "Lucas Ferreira",
        patientInitials: "LF",
        patientAge: 30,
        patientGender: "Masculino",
        time: "13:00",
        date: "2026-06-10",
        dayLabel: "Ter, 10/06",
        status: "aguardando-confirmacao",
        source: "whatsapp",
        followUpSent: "Hoje, 10:00",
        hasMessagingChannel: true,
    },
];

export const calendarIntegrationOnline = true;

export type ContactStage = "primeiro-contato" | "agendado" | "paciente" | "inativo";

export const contactStageLabels: Record<ContactStage, string> = {
    "primeiro-contato": "Interessado",
    agendado: "Agendado",
    paciente: "Cliente",
    inativo: "Inativo",
};

export const contactStageColors: Record<ContactStage, "gray" | "brand" | "success" | "indigo"> = {
    "primeiro-contato": "gray",
    agendado: "brand",
    paciente: "success",
    inativo: "gray",
};

export interface ContactActivitySummary {
    totalConversations: number;
    totalAppointments: number;
    lastAppointment?: { date: string; status: string };
    nextAppointment?: { date: string; status: string };
}

export interface TessenContact {
    id: string;
    fullName: string;
    phone: string;
    avatarInitials: string;
    originChannel: ConversationChannel;
    preferredChannel: ConversationChannel;
    stage: ContactStage;
    firstContactAt: string;
    lastContactAt: string;
    lastContactDaysAgo: number;
    archived: boolean;
    activity: ContactActivitySummary;
    conversationId?: string;
}

/** Estágio comercial — lead que pode contratar a Tessen (visão admin). */
export type TessenLeadStage = "prospeccao" | "qualificado" | "demo" | "proposta" | "fechado" | "perdido";

export const tessenLeadStageLabels: Record<TessenLeadStage, string> = {
    prospeccao: "Prospecção",
    qualificado: "Qualificado",
    demo: "Demo agendada",
    proposta: "Proposta enviada",
    fechado: "Cliente",
    perdido: "Perdido",
};

export const tessenLeadStageColors: Record<TessenLeadStage, "gray" | "brand" | "indigo" | "warning" | "success" | "error"> = {
    prospeccao: "gray",
    qualificado: "brand",
    demo: "indigo",
    proposta: "warning",
    fechado: "success",
    perdido: "error",
};

/** Um contato por empresa — pessoa decisora interessada em contratar a Tessen. */
export interface TessenLeadContact {
    id: string;
    clientName: string;
    niche: string;
    contactName: string;
    contactEmail: string;
    phone: string;
    avatarInitials: string;
    stage: TessenLeadStage;
    lastContactAt: string;
    lastContactDaysAgo: number;
}

export const tessenLeadContacts: TessenLeadContact[] = [
    {
        id: "lead-saude-total",
        clientName: "Clínica Saúde Total",
        niche: "Clínica médica",
        contactName: "Patrícia Nogueira",
        contactEmail: "patricia@clinicasaudetotal.com.br",
        phone: "+55 48 3322-1100",
        avatarInitials: "PN",
        stage: "fechado",
        lastContactAt: "Hoje",
        lastContactDaysAgo: 0,
    },
    {
        id: "lead-estetica-bella",
        clientName: "Estética Bella",
        niche: "Salão e estética",
        contactName: "Camila Rocha",
        contactEmail: "camila@esteticabella.com.br",
        phone: "+55 11 3456-7890",
        avatarInitials: "CR",
        stage: "fechado",
        lastContactAt: "Ontem",
        lastContactDaysAgo: 1,
    },
    {
        id: "lead-dr-silva",
        clientName: "Dr. Silva — Consultório",
        niche: "Autônomo",
        contactName: "Dr. Marcelo Silva",
        contactEmail: "contato@drsilva.med.br",
        phone: "+55 21 99876-5432",
        avatarInitials: "MS",
        stage: "proposta",
        lastContactAt: "há 3 dias",
        lastContactDaysAgo: 3,
    },
    {
        id: "lead-fit-startup",
        clientName: "FitApp Suporte",
        niche: "Startup B2C",
        contactName: "Lucas Ferreira",
        contactEmail: "lucas@fitapp.io",
        phone: "+55 11 91234-5678",
        avatarInitials: "LF",
        stage: "fechado",
        lastContactAt: "há 5 dias",
        lastContactDaysAgo: 5,
    },
    {
        id: "lead-horizonte",
        clientName: "Clínica Horizonte",
        niche: "Clínica médica",
        contactName: "Dr. Ricardo Mendes",
        contactEmail: "ricardo@clinicahorizonte.com.br",
        phone: "+55 11 98765-4321",
        avatarInitials: "RM",
        stage: "demo",
        lastContactAt: "há 2 dias",
        lastContactDaysAgo: 2,
    },
    {
        id: "lead-vitalis",
        clientName: "Vitalis Odontologia",
        niche: "Clínica médica",
        contactName: "Fernanda Lima",
        contactEmail: "fernanda@vitalisodonto.com.br",
        phone: "+55 31 97654-3210",
        avatarInitials: "FL",
        stage: "qualificado",
        lastContactAt: "há 7 dias",
        lastContactDaysAgo: 7,
    },
    {
        id: "lead-spa-luna",
        clientName: "Spa Luna",
        niche: "Salão e estética",
        contactName: "Juliana Martins",
        contactEmail: "juliana@spaluna.com.br",
        phone: "+55 48 99109-8765",
        avatarInitials: "JM",
        stage: "prospeccao",
        lastContactAt: "há 12 dias",
        lastContactDaysAgo: 12,
    },
    {
        id: "lead-techclinic",
        clientName: "TechClinic Labs",
        niche: "Startup B2C",
        contactName: "Diego Santos",
        contactEmail: "diego@techclinic.io",
        phone: "+55 11 98876-5431",
        avatarInitials: "DS",
        stage: "perdido",
        lastContactAt: "há 45 dias",
        lastContactDaysAgo: 45,
    },
];

export const tessenContactsTotalCount = 124;

export const tessenContacts: TessenContact[] = [
    {
        id: "c1",
        fullName: "Maria Silva",
        phone: "+55 48 99912-3456",
        avatarInitials: "MS",
        originChannel: "whatsapp",
        preferredChannel: "whatsapp",
        stage: "agendado",
        firstContactAt: "12/03/2025",
        lastContactAt: "Hoje",
        lastContactDaysAgo: 0,
        archived: false,
        conversationId: "1",
        activity: {
            totalConversations: 4,
            totalAppointments: 2,
            lastAppointment: { date: "28/05/2025", status: "Confirmado" },
            nextAppointment: { date: "05/06/2025, 09:00", status: "Aguardando confirmação" },
        },
    },
    {
        id: "c2",
        fullName: "João Pereira",
        phone: "+55 48 98876-5432",
        avatarInitials: "JP",
        originChannel: "whatsapp",
        preferredChannel: "whatsapp",
        stage: "paciente",
        firstContactAt: "08/01/2025",
        lastContactAt: "Ontem",
        lastContactDaysAgo: 1,
        archived: false,
        conversationId: "2",
        activity: {
            totalConversations: 6,
            totalAppointments: 3,
            lastAppointment: { date: "20/05/2025", status: "Compareceu" },
        },
    },
    {
        id: "c3",
        fullName: "Ana Costa",
        phone: "+55 48 99765-4321",
        avatarInitials: "AC",
        originChannel: "telegram",
        preferredChannel: "telegram",
        stage: "primeiro-contato",
        firstContactAt: "Hoje",
        lastContactAt: "Hoje",
        lastContactDaysAgo: 0,
        archived: false,
        conversationId: "3",
        activity: { totalConversations: 1, totalAppointments: 0 },
    },
    {
        id: "c4",
        fullName: "Carlos Mendes",
        phone: "+55 48 99654-3210",
        avatarInitials: "CM",
        originChannel: "whatsapp",
        preferredChannel: "whatsapp",
        stage: "paciente",
        firstContactAt: "15/11/2024",
        lastContactAt: "Hoje",
        lastContactDaysAgo: 0,
        archived: false,
        conversationId: "4",
        activity: {
            totalConversations: 12,
            totalAppointments: 5,
            lastAppointment: { date: "10/05/2025", status: "Compareceu" },
            nextAppointment: { date: "12/06/2025, 15:30", status: "Confirmado" },
        },
    },
    {
        id: "c5",
        fullName: "Fernanda Lima",
        phone: "+55 48 99543-2109",
        avatarInitials: "FL",
        originChannel: "webchat",
        preferredChannel: "webchat",
        stage: "agendado",
        firstContactAt: "22/04/2025",
        lastContactAt: "há 5 dias",
        lastContactDaysAgo: 5,
        archived: false,
        conversationId: "5",
        activity: {
            totalConversations: 3,
            totalAppointments: 1,
            nextAppointment: { date: "06/06/2025, 11:00", status: "Aguardando confirmação" },
        },
    },
    {
        id: "c6",
        fullName: "Roberto Alves",
        phone: "+55 48 99432-1098",
        avatarInitials: "RA",
        originChannel: "whatsapp",
        preferredChannel: "whatsapp",
        stage: "primeiro-contato",
        firstContactAt: "18/05/2025",
        lastContactAt: "há 14 dias",
        lastContactDaysAgo: 14,
        archived: false,
        conversationId: "6",
        activity: { totalConversations: 2, totalAppointments: 0 },
    },
    {
        id: "c7",
        fullName: "Patrícia Souza",
        phone: "+55 48 99321-0987",
        avatarInitials: "PS",
        originChannel: "whatsapp",
        preferredChannel: "whatsapp",
        stage: "paciente",
        firstContactAt: "03/02/2025",
        lastContactAt: "há 3 dias",
        lastContactDaysAgo: 3,
        archived: false,
        activity: {
            totalConversations: 5,
            totalAppointments: 2,
            lastAppointment: { date: "01/06/2025", status: "Compareceu" },
        },
    },
    {
        id: "c8",
        fullName: "Lucas Ferreira",
        phone: "+55 48 99210-9876",
        avatarInitials: "LF",
        originChannel: "telegram",
        preferredChannel: "telegram",
        stage: "paciente",
        firstContactAt: "10/10/2024",
        lastContactAt: "há 2 dias",
        lastContactDaysAgo: 2,
        archived: false,
        activity: {
            totalConversations: 9,
            totalAppointments: 4,
            lastAppointment: { date: "25/05/2025", status: "Compareceu" },
            nextAppointment: { date: "10/06/2025, 13:00", status: "Confirmado" },
        },
    },
    {
        id: "c9",
        fullName: "Juliana Martins",
        phone: "+55 48 99109-8765",
        avatarInitials: "JM",
        originChannel: "whatsapp",
        preferredChannel: "whatsapp",
        stage: "agendado",
        firstContactAt: "14/05/2025",
        lastContactAt: "há 7 dias",
        lastContactDaysAgo: 7,
        archived: false,
        activity: {
            totalConversations: 2,
            totalAppointments: 1,
            nextAppointment: { date: "08/06/2025, 10:00", status: "Confirmado" },
        },
    },
    {
        id: "c10",
        fullName: "Ricardo Nunes",
        phone: "+55 48 99098-7654",
        avatarInitials: "RN",
        originChannel: "webchat",
        preferredChannel: "webchat",
        stage: "inativo",
        firstContactAt: "20/05/2025",
        lastContactAt: "há 10 dias",
        lastContactDaysAgo: 10,
        archived: false,
        activity: { totalConversations: 1, totalAppointments: 0 },
    },
    {
        id: "c11",
        fullName: "Camila Rocha",
        phone: "+55 48 98987-6543",
        avatarInitials: "CR",
        originChannel: "whatsapp",
        preferredChannel: "whatsapp",
        stage: "paciente",
        firstContactAt: "28/12/2024",
        lastContactAt: "há 4 dias",
        lastContactDaysAgo: 4,
        archived: false,
        activity: {
            totalConversations: 7,
            totalAppointments: 2,
            lastAppointment: { date: "15/05/2025", status: "Compareceu" },
        },
    },
    {
        id: "c12",
        fullName: "Diego Santos",
        phone: "+55 48 98876-5431",
        avatarInitials: "DS",
        originChannel: "whatsapp",
        preferredChannel: "whatsapp",
        stage: "paciente",
        firstContactAt: "05/08/2024",
        lastContactAt: "há 1 dia",
        lastContactDaysAgo: 1,
        archived: false,
        activity: {
            totalConversations: 15,
            totalAppointments: 6,
            lastAppointment: { date: "30/05/2025", status: "Compareceu" },
            nextAppointment: { date: "11/06/2025, 16:00", status: "Confirmado" },
        },
    },
    {
        id: "c-archived",
        fullName: "Helena Vieira",
        phone: "+55 48 97765-4321",
        avatarInitials: "HV",
        originChannel: "whatsapp",
        preferredChannel: "whatsapp",
        stage: "paciente",
        firstContactAt: "02/01/2024",
        lastContactAt: "há 90 dias",
        lastContactDaysAgo: 90,
        archived: true,
        activity: {
            totalConversations: 4,
            totalAppointments: 2,
            lastAppointment: { date: "10/01/2025", status: "Compareceu" },
        },
    },
];

export const contactChannelItems: { id: ConversationChannel; label: string }[] = [
    { id: "whatsapp", label: "WhatsApp" },
    { id: "telegram", label: "Telegram" },
    { id: "webchat", label: "Webchat" },
];

export function formatContactLastContact(days: number): string {
    if (days === 0) return "Hoje";
    if (days === 1) return "Ontem";
    return `há ${days} ${days === 1 ? "dia" : "dias"}`;
}

export function findContactByPhone(contacts: TessenContact[], phone: string): TessenContact | undefined {
    const normalized = phone.replace(/\D/g, "");
    return contacts.find((c) => c.phone.replace(/\D/g, "") === normalized);
}

export const tessenAccounts: NavAccountType[] = [
    {
        id: "joao",
        name: "João",
        email: "joao@tessen.com",
        avatar: "https://www.untitledui.com/images/avatars/drew-cano?fm=webp&q=80",
        status: "online",
    },
];
