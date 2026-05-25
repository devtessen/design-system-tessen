"use client";

import type { ReactNode } from "react";
import { SearchLg } from "@untitledui/icons";
import { MobileNavigationHeader } from "@/components/application/app-navigation/base-components/mobile-header";
import { NavAccountCard } from "@/components/application/app-navigation/base-components/nav-account-card";
import { NavItemBase } from "@/components/application/app-navigation/base-components/nav-item";
import { NavList } from "@/components/application/app-navigation/base-components/nav-list";
import type { NavItemDividerType, NavItemType } from "@/components/application/app-navigation/config";
import { tessenAccounts } from "@/components/application/tessen/tessen-data";
import { TessenLogo } from "@/components/application/tessen/tessen-logo";
import { Input } from "@/components/base/input/input";

interface TessenSidebarProps {
    activeUrl?: string;
    items: (NavItemType | NavItemDividerType)[];
    footerItems?: NavItemType[];
    featureCard?: ReactNode;
    showAccountCard?: boolean;
}

export const TessenSidebar = ({
    activeUrl,
    items,
    footerItems = [],
    featureCard,
    showAccountCard = true,
}: TessenSidebarProps) => {
    const MAIN_SIDEBAR_WIDTH = 276;

    const content = (
        <aside
            style={{ "--width": `${MAIN_SIDEBAR_WIDTH}px` } as React.CSSProperties}
            className="flex h-full w-full max-w-full flex-col justify-between overflow-auto bg-primary pt-4 shadow-xs ring-secondary ring-inset lg:w-(--width) lg:rounded-xl lg:pt-5 lg:ring-1"
        >
            <div className="flex flex-col gap-5 px-4 lg:px-5">
                <TessenLogo />
                <Input size="sm" shortcut aria-label="Buscar" placeholder="Buscar" icon={SearchLg} className="max-md:hidden" />
                <Input size="md" aria-label="Buscar" placeholder="Buscar" icon={SearchLg} className="md:hidden" />
            </div>

            <NavList activeUrl={activeUrl} items={items} />

            <div className="mt-auto flex flex-col gap-5 px-2 py-4 lg:gap-6 lg:px-4 lg:py-4">
                {footerItems.length > 0 && (
                    <ul className="flex flex-col px-2">
                        {footerItems.map((item) => (
                            <li key={item.label} className="py-px">
                                <NavItemBase badge={item.badge} icon={item.icon} href={item.href} type="link" current={item.href === activeUrl}>
                                    {item.label}
                                </NavItemBase>
                            </li>
                        ))}
                    </ul>
                )}
                {featureCard}
                {showAccountCard && <NavAccountCard items={tessenAccounts} selectedAccountId="joao" />}
            </div>
        </aside>
    );

    return (
        <>
            <MobileNavigationHeader>{content}</MobileNavigationHeader>
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:py-1 lg:pl-1">{content}</div>
            <div
                style={{ paddingLeft: MAIN_SIDEBAR_WIDTH + 4 }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
};
