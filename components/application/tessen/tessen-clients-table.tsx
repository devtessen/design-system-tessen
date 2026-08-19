"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, SearchLg } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import {
    tessenClientAccounts,
    tessenClientStatusLabels,
    type TessenClientAccount,
    type TessenClientStatus,
} from "@/components/application/tessen/tessen-data";
import { LabelBadge } from "@/components/application/tessen/tessen-badges";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Badge } from "@/components/base/badges/badges";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Input } from "@/components/base/input/input";

const statusBadgeColor: Record<TessenClientStatus, "success" | "warning" | "gray"> = {
    ativo: "success",
    trial: "warning",
    inativo: "gray",
};

interface TessenClientsTableProps {
    showSearch?: boolean;
}

export const TessenClientsTable = ({ showSearch = true }: TessenClientsTableProps) => {
    const [search, setSearch] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });

    const filteredClients = useMemo(() => {
        const filtered = tessenClientAccounts.filter(
            (client) =>
                client.name.toLowerCase().includes(search.toLowerCase()) ||
                client.niche.toLowerCase().includes(search.toLowerCase()),
        );

        return [...filtered].sort((a, b) => {
            if (sortDescriptor.column === "conversationsToday" || sortDescriptor.column === "aiResolutionRate") {
                const first = a[sortDescriptor.column as keyof TessenClientAccount] as number;
                const second = b[sortDescriptor.column as keyof TessenClientAccount] as number;
                return sortDescriptor.direction === "descending" ? second - first : first - second;
            }
            const first = a[sortDescriptor.column as keyof TessenClientAccount];
            const second = b[sortDescriptor.column as keyof TessenClientAccount];
            if (typeof first === "string" && typeof second === "string") {
                return sortDescriptor.direction === "descending" ? second.localeCompare(first) : first.localeCompare(second);
            }
            return 0;
        });
    }, [search, sortDescriptor]);

    return (
        <div className="flex flex-col gap-4">
            {showSearch && (
                <Input
                    size="sm"
                    placeholder="Buscar por nome ou nicho"
                    icon={SearchLg}
                    value={search}
                    onChange={setSearch}
                    className="max-w-md"
                />
            )}

            <TableCard.Root>
                <TableCard.Header
                    title="Clientes"
                    badge={`${filteredClients.length} contas`}
                    titleClassName={tessenTypography.sectionTitle}
                />
                <Table aria-label="Clientes Tessen" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                    <Table.Header>
                        <Table.Head id="name" label="Cliente" isRowHeader allowsSorting className="w-full max-w-1/4" />
                        <Table.Head id="niche" label="Nicho" allowsSorting />
                        <Table.Head id="plan" label="Plano" />
                        <Table.Head id="status" label="Status" />
                        <Table.Head id="agentName" label="Agente" />
                        <Table.Head id="conversationsToday" label="Atend. hoje" allowsSorting />
                        <Table.Head id="aiResolutionRate" label="Resolução IA" allowsSorting />
                        <Table.Head id="createdAt" label="Cliente desde" allowsSorting />
                        <Table.Head id="actions" />
                    </Table.Header>
                    <Table.Body items={filteredClients}>
                        {(item) => (
                            <Table.Row id={item.id}>
                                <Table.Cell>
                                    <p className="text-sm font-medium text-primary">{item.name}</p>
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap">
                                    <LabelBadge color="brand">{item.niche}</LabelBadge>
                                </Table.Cell>
                                <Table.Cell className="text-secondary">{item.plan}</Table.Cell>
                                <Table.Cell>
                                    <Badge type="pill-color" color={statusBadgeColor[item.status]} size="sm">
                                        {tessenClientStatusLabels[item.status]}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell className="text-secondary">{item.agentName}</Table.Cell>
                                <Table.Cell className="font-medium text-primary">{item.conversationsToday}</Table.Cell>
                                <Table.Cell className="text-secondary">
                                    {item.status === "inativo" ? "—" : `${item.aiResolutionRate}%`}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap text-tertiary">{item.createdAt}</Table.Cell>
                                <Table.Cell className="px-4">
                                    <div className="flex justify-end">
                                        <ButtonUtility size="xs" color="tertiary" tooltip="Ver conta" icon={ArrowUpRight} />
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
                <PaginationPageMinimalCenter page={1} total={1} className="px-4 py-3 md:px-6 md:pt-3 md:pb-4" />
            </TableCard.Root>
        </div>
    );
};
