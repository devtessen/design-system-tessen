"use client";

import {
    BarChartSquare02,
    Calendar,
    LifeBuoy01,
    MessageChatCircle,
    PieChart03,
    Settings01,
    Stars01,
    Users01,
} from "@untitledui/icons";
import type { NavItemDividerType, NavItemType } from "@/components/application/app-navigation/config";
import { CountBadge } from "@/components/application/tessen/tessen-badges";

export type TessenUserType = "cliente" | "admin";

const tessenFooterItems: NavItemType[] = [
    {
        label: "Configurações",
        href: "/configuracoes",
        icon: Settings01,
    },
    {
        label: "Suporte",
        href: "/suporte",
        icon: LifeBuoy01,
    },
];

/** Navegação do usuário cliente (clínica / negócio atendido). */
export const tessenClienteNavItems: (NavItemType | NavItemDividerType)[] = [
    {
        label: "Visão Geral",
        href: "/painel",
        icon: BarChartSquare02,
    },
    {
        label: "Agendamentos",
        href: "/agendamentos",
        icon: Calendar,
    },
    { divider: true },
    {
        label: "Conversas",
        href: "/conversas",
        icon: MessageChatCircle,
        badge: <CountBadge color="brand" className="ml-3">3</CountBadge>,
    },
    {
        label: "Contatos",
        href: "/contatos",
        icon: Users01,
    },
];

/** Navegação do usuário admin (interno Tessen). */
export const tessenAdminNavItems: (NavItemType | NavItemDividerType)[] = [
    {
        label: "Visão Geral",
        href: "/painel",
        icon: BarChartSquare02,
    },
    {
        label: "Relatórios",
        href: "/relatorios",
        icon: PieChart03,
    },
    { divider: true },
    {
        label: "Conversas",
        href: "/conversas",
        icon: MessageChatCircle,
        badge: <CountBadge color="brand" className="ml-3">3</CountBadge>,
    },
    {
        label: "Contatos",
        href: "/contatos",
        icon: Users01,
    },
    { divider: true },
    {
        label: "Agentes",
        href: "/agentes",
        icon: Stars01,
    },
];

export function getTessenNavItems(userType: TessenUserType) {
    return userType === "admin" ? tessenAdminNavItems : tessenClienteNavItems;
}

/** @deprecated Use getTessenNavItems("cliente") */
export const tessenNavItems = tessenClienteNavItems;

export { tessenFooterItems };
