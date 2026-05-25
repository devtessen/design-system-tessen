"use client";

import { useMemo, useState } from "react";
import { Edit01, FilterLines, Plus, SearchLg } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import { ReactivateContactModal } from "@/components/application/tessen/reactivate-contact-modal";
import { conversations, type Conversation } from "@/components/application/tessen/tessen-data";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { EngagementBadge, LabelBadge, StatusBadge } from "@/components/application/tessen/tessen-badges";
import { TessenPageHeader, TessenShell } from "@/components/application/tessen/tessen-shell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Input } from "@/components/base/input/input";

function canReactivate(contact: Conversation): boolean {
    return (
        contact.status === "abandonado" ||
        contact.engagementLabel === "inativo" ||
        (contact.lastContactDaysAgo !== undefined && contact.lastContactDaysAgo >= 7)
    );
}

function formatLastContact(days?: number): string {
    if (days === undefined) return "—";
    if (days === 0) return "hoje";
    return `há ${days} ${days === 1 ? "dia" : "dias"}`;
}

export const TessenContactsScreen = () => {
    const [search, setSearch] = useState("");
    const [reactivateContact, setReactivateContact] = useState<Conversation | null>(null);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "contactName",
        direction: "ascending",
    });

    const filteredContacts = useMemo(() => {
        const filtered = conversations.filter(
            (c) =>
                c.contactName.toLowerCase().includes(search.toLowerCase()) ||
                c.contactPhone.includes(search),
        );

        return [...filtered].sort((a, b) => {
            if (sortDescriptor.column === "lastContactDaysAgo") {
                const first = a.lastContactDaysAgo ?? 999;
                const second = b.lastContactDaysAgo ?? 999;
                return sortDescriptor.direction === "descending" ? second - first : first - second;
            }
            const first = a[sortDescriptor.column as keyof typeof a];
            const second = b[sortDescriptor.column as keyof typeof b];
            if (typeof first === "string" && typeof second === "string") {
                return sortDescriptor.direction === "descending" ? second.localeCompare(first) : first.localeCompare(second);
            }
            return 0;
        });
    }, [search, sortDescriptor]);

    return (
        <TessenShell activeUrl="/contatos">
            <TessenPageHeader
                title="Contatos"
                description="Gerencie contatos, histórico e campos customizados por nicho"
                actions={
                    <>
                        <Button color="secondary" size="sm" iconLeading={FilterLines}>
                            Filtros
                        </Button>
                        <Button size="sm" iconLeading={Plus}>
                            Novo contato
                        </Button>
                    </>
                }
            />

            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <Input
                    size="sm"
                    placeholder="Buscar por nome ou telefone"
                    icon={SearchLg}
                    value={search}
                    onChange={setSearch}
                    className="max-w-md"
                />

                <TableCard.Root>
                    <TableCard.Header title="Todos os contatos" badge={`${filteredContacts.length} contatos`} titleClassName={tessenTypography.sectionTitle} />
                    <Table aria-label="Contatos" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                        <Table.Header>
                            <Table.Head id="contactName" label="Nome" isRowHeader allowsSorting className="w-full max-w-1/4" />
                            <Table.Head id="contactPhone" label="Telefone" allowsSorting />
                            <Table.Head id="niche" label="Nicho" />
                            <Table.Head id="lastContactDaysAgo" label="Último contato" allowsSorting />
                            <Table.Head id="status" label="Último atendimento" />
                            <Table.Head id="engagementLabel" label="Engajamento" />
                            <Table.Head id="actions" />
                        </Table.Header>
                        <Table.Body items={filteredContacts}>
                            {(item) => (
                                <Table.Row id={item.id}>
                                    <Table.Cell>
                                        <p className="flex items-center gap-3">
                                            <Avatar initials={item.avatarInitials} size="md" />
                                            <span className="text-sm font-medium text-primary">{item.contactName}</span>
                                        </p>
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap text-secondary">{item.contactPhone}</Table.Cell>
                                    <Table.Cell>
                                        <LabelBadge color="brand">{item.niche}</LabelBadge>
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap text-secondary">
                                        {formatLastContact(item.lastContactDaysAgo)}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <StatusBadge status={item.status} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.engagementLabel && item.contactsLast30Days !== undefined ? (
                                            <EngagementBadge label={item.engagementLabel} contactCount={item.contactsLast30Days} />
                                        ) : (
                                            "—"
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="px-4">
                                        <div className="flex justify-end gap-2">
                                            {canReactivate(item) && (
                                                <Button color="link-color" size="sm" onClick={() => setReactivateContact(item)}>
                                                    Reativar →
                                                </Button>
                                            )}
                                            <ButtonUtility size="xs" color="tertiary" tooltip="Editar" icon={Edit01} />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <PaginationPageMinimalCenter page={1} total={2} className="px-4 py-3 md:px-6 md:pt-3 md:pb-4" />
                </TableCard.Root>
            </div>

            {reactivateContact && (
                <ReactivateContactModal
                    contact={reactivateContact}
                    isOpen={Boolean(reactivateContact)}
                    onOpenChange={(open) => !open && setReactivateContact(null)}
                />
            )}
        </TessenShell>
    );
};
