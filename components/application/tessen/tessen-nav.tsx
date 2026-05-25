"use client";

import {
    BarChartSquare02,
    LifeBuoy01,
    MessageChatCircle,
    PieChart03,
    Settings01,
    Stars01,
    Users01,
} from "@untitledui/icons";
import type { NavItemDividerType, NavItemType } from "@/components/application/app-navigation/config";
import { CountBadge } from "@/components/application/tessen/tessen-badges";

export const tessenNavItems: (NavItemType | NavItemDividerType)[] = [
    {
        label: "Painel",
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
        label: "Agente",
        href: "/agente",
        icon: Stars01,
    },
];

export const tessenFooterItems: NavItemType[] = [
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
