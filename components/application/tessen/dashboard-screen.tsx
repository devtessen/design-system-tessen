"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, FilterLines, RefreshCw05 } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import {
    accountSettings,
    activityFeed,
    conversations,
    dashboardKpis,
    dashboardMetrics,
} from "@/components/application/tessen/tessen-data";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { ConfidenceBadge, OnlineBadge, StatusBadge, WaitingHumanAlert } from "@/components/application/tessen/tessen-badges";
import { MetricCard, TessenPageHeader, TessenShell } from "@/components/application/tessen/tessen-shell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { TabList, Tabs } from "@/components/application/tabs/tabs";

const activityIcons = {
    escalacao: "text-warning-primary",
    resolucao: "text-success-primary",
    mensagem: "text-brand-secondary",
    assuncao: "text-blue-600",
};

export const TessenDashboardScreen = () => {
    const [period, setPeriod] = useState<string>("today");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "timestamp",
        direction: "descending",
    });

    const slaExceeded = dashboardMetrics.oldestWaitingMinutes > accountSettings.slaThresholdMinutes;

    const sortedConversations = useMemo(() => {
        return [...conversations].sort((a, b) => {
            if (sortDescriptor.column === "confidence") {
                const first = a.confidence ?? 0;
                const second = b.confidence ?? 0;
                return sortDescriptor.direction === "descending" ? second - first : first - second;
            }
            return sortDescriptor.direction === "descending" ? b.timestamp.localeCompare(a.timestamp) : a.timestamp.localeCompare(b.timestamp);
        });
    }, [sortDescriptor]);

    return (
        <TessenShell activeUrl="/painel">
            <TessenPageHeader
                title="Painel de atendimentos"
                description="Visão geral do atendimento via WhatsApp — Clínica Saúde Total"
                actions={
                    <>
                        <Button color="secondary" size="sm" iconLeading={RefreshCw05}>
                            Atualizar
                        </Button>
                        <Button size="sm" iconLeading={FilterLines}>
                            Filtros
                        </Button>
                    </>
                }
            />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <Tabs selectedKey={period} onSelectionChange={(key) => setPeriod(String(key))}>
                    <TabList type="button-border" size="sm" items={[
                        { id: "today", label: "Hoje" },
                        { id: "week", label: "Semana" },
                        { id: "month", label: "Mês" },
                    ]} />
                </Tabs>

                {dashboardMetrics.waitingHuman > 0 && (
                    <WaitingHumanAlert
                        count={dashboardMetrics.waitingHuman}
                        oldestWaitingMinutes={dashboardMetrics.oldestWaitingMinutes}
                        slaExceeded={slaExceeded}
                    />
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {dashboardKpis.map((kpi) => (
                        <MetricCard
                            key={kpi.label}
                            label={kpi.label}
                            value={kpi.value}
                            trend={kpi.change}
                            hint={kpi.sublabel}
                            accent="success"
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset xl:col-span-1">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className={tessenTypography.sectionTitle}>Atividade ao vivo</h2>
                            <OnlineBadge />
                        </div>
                        <ul className="flex flex-col gap-4">
                            {activityFeed.map((event) => (
                                <li key={event.id} className="flex gap-3">
                                    <div className="mt-1 size-2 shrink-0 rounded-full bg-brand-solid" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-primary">
                                            <span className="font-medium">{event.contactName}</span>
                                            <span className="text-tertiary"> — {event.description}</span>
                                        </p>
                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                            <p className={`text-xs font-medium ${activityIcons[event.type]}`}>{event.timestamp}</p>
                                            {event.inlineAction === "assume" && (
                                                <Button color="link-color" size="sm">
                                                    Assumir →
                                                </Button>
                                            )}
                                            {event.inlineAction === "view" && (
                                                <Button color="link-gray" size="sm">
                                                    Ver conversa →
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="xl:col-span-2">
                        <TableCard.Root>
                            <TableCard.Header title="Atendimentos recentes" badge={`${conversations.length} conversas`} titleClassName={tessenTypography.sectionTitle} />
                            <Table aria-label="Atendimentos recentes" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                                <Table.Header>
                                    <Table.Head id="contactName" label="Contato" isRowHeader allowsSorting className="w-full max-w-1/3" />
                                    <Table.Head id="status" label="Status" />
                                    <Table.Head id="confidence" label="Confiança IA" allowsSorting />
                                    <Table.Head id="timestamp" label="Horário" allowsSorting />
                                    <Table.Head id="actions" />
                                </Table.Header>
                                <Table.Body items={sortedConversations}>
                                    {(item) => (
                                        <Table.Row id={item.id}>
                                            <Table.Cell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar initials={item.avatarInitials} size="md" />
                                                    <div>
                                                        <p className="text-sm font-medium text-primary">{item.contactName}</p>
                                                        <p className="text-sm text-tertiary">{item.lastMessage}</p>
                                                    </div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <StatusBadge status={item.status} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                {item.confidence !== undefined ? <ConfidenceBadge value={item.confidence} /> : "—"}
                                            </Table.Cell>
                                            <Table.Cell className="whitespace-nowrap text-tertiary">{item.timestamp}</Table.Cell>
                                            <Table.Cell className="px-4">
                                                <div className="flex justify-end">
                                                    <ButtonUtility size="xs" color="tertiary" tooltip="Abrir conversa" icon={ArrowUpRight} />
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                            <PaginationPageMinimalCenter page={1} total={3} className="px-4 py-3 md:px-6 md:pt-3 md:pb-4" />
                        </TableCard.Root>
                    </div>
                </div>
            </div>
        </TessenShell>
    );
};
