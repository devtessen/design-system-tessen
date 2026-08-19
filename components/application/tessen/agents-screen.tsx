"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Plus, SearchLg } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import {
    tessenNicheAgents,
    tessenNicheAgentStatusLabels,
    type TessenNicheAgent,
    type TessenNicheAgentStatus,
    type TessenNicheId,
} from "@/components/application/tessen/tessen-data";
import { LabelBadge } from "@/components/application/tessen/tessen-badges";
import type { TessenUserType } from "@/components/application/tessen/tessen-nav";
import { TessenPageHeader, TessenShell } from "@/components/application/tessen/tessen-shell";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Input } from "@/components/base/input/input";

const statusBadgeColor: Record<TessenNicheAgentStatus, "success" | "warning"> = {
    ativo: "success",
    rascunho: "warning",
};

interface TessenAgentsScreenProps {
    userType?: TessenUserType;
    onConfigureAgent?: (nicheId: TessenNicheId) => void;
}

export const TessenAgentsScreen = ({ userType = "admin", onConfigureAgent }: TessenAgentsScreenProps) => {
    const [search, setSearch] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "nicheLabel",
        direction: "ascending",
    });

    const filteredAgents = useMemo(() => {
        const filtered = tessenNicheAgents.filter(
            (agent) =>
                agent.nicheLabel.toLowerCase().includes(search.toLowerCase()) ||
                agent.agentName.toLowerCase().includes(search.toLowerCase()),
        );

        return [...filtered].sort((a, b) => {
            if (sortDescriptor.column === "clientsCount" || sortDescriptor.column === "minConfidence") {
                const first = a[sortDescriptor.column as keyof TessenNicheAgent] as number;
                const second = b[sortDescriptor.column as keyof TessenNicheAgent] as number;
                return sortDescriptor.direction === "descending" ? second - first : first - second;
            }
            const first = a[sortDescriptor.column as keyof TessenNicheAgent];
            const second = b[sortDescriptor.column as keyof TessenNicheAgent];
            if (typeof first === "string" && typeof second === "string") {
                return sortDescriptor.direction === "descending" ? second.localeCompare(first) : first.localeCompare(second);
            }
            return 0;
        });
    }, [search, sortDescriptor]);

    return (
        <TessenShell activeUrl="/agentes" userType={userType}>
            <TessenPageHeader
                title="Agentes"
                description="Agentes de IA por nicho — cada conta cliente herda o agente do seu segmento"
                actions={
                    <Button size="sm" iconLeading={Plus}>
                        Novo agente de nicho
                    </Button>
                }
            />

            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <Input
                    size="sm"
                    placeholder="Buscar por nicho ou nome do agente"
                    icon={SearchLg}
                    value={search}
                    onChange={setSearch}
                    className="max-w-md"
                />

                <TableCard.Root>
                    <TableCard.Header
                        title="Agentes por nicho"
                        badge={`${filteredAgents.length} nichos`}
                        titleClassName={tessenTypography.sectionTitle}
                    />
                    <Table aria-label="Agentes por nicho" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                        <Table.Header>
                            <Table.Head id="nicheLabel" label="Nicho" isRowHeader allowsSorting className="w-full max-w-1/4" />
                            <Table.Head id="agentName" label="Agente" allowsSorting />
                            <Table.Head id="description" label="Descrição" className="hidden xl:table-cell" />
                            <Table.Head id="clientsCount" label="Clientes" allowsSorting />
                            <Table.Head id="minConfidence" label="Confiança mín." allowsSorting />
                            <Table.Head id="status" label="Status" />
                            <Table.Head id="updatedAt" label="Atualizado" allowsSorting className="hidden lg:table-cell" />
                            <Table.Head id="actions" />
                        </Table.Header>
                        <Table.Body items={filteredAgents}>
                            {(item) => (
                                <Table.Row id={item.id}>
                                    <Table.Cell>
                                        <LabelBadge color="brand">{item.nicheLabel}</LabelBadge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <p className="text-sm font-medium text-primary">{item.agentName}</p>
                                    </Table.Cell>
                                    <Table.Cell className="hidden max-w-xs truncate text-sm text-tertiary xl:table-cell">
                                        {item.description}
                                    </Table.Cell>
                                    <Table.Cell className="text-secondary">{item.clientsCount}</Table.Cell>
                                    <Table.Cell className="text-secondary">{item.minConfidence}%</Table.Cell>
                                    <Table.Cell>
                                        <Badge type="pill-color" color={statusBadgeColor[item.status]} size="sm">
                                            {tessenNicheAgentStatusLabels[item.status]}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="hidden whitespace-nowrap text-tertiary lg:table-cell">{item.updatedAt}</Table.Cell>
                                    <Table.Cell className="px-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                color="link-color"
                                                size="sm"
                                                onClick={() => onConfigureAgent?.(item.id)}
                                            >
                                                Configurar →
                                            </Button>
                                            <ButtonUtility size="xs" color="tertiary" tooltip="Abrir configuração" icon={ArrowUpRight} />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <PaginationPageMinimalCenter page={1} total={1} className="px-4 py-3 md:px-6 md:pt-3 md:pb-4" />
                </TableCard.Root>
            </div>
        </TessenShell>
    );
};
