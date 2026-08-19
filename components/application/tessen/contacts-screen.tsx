"use client";

import { useMemo, useState } from "react";
import { Archive, ArrowUpRight, FilterLines, MessageChatCircle, Plus, SearchLg, Trash01, Users01 } from "@untitledui/icons";
import { toast } from "@/components/application/toast/toast";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover, type SortDescriptor } from "react-aria-components";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import {
    ArchiveContactModal,
    DeleteContactModal,
    EditContactModal,
    NewContactModal,
} from "@/components/application/tessen/contact-modals";
import { ContactProfileSlideout } from "@/components/application/tessen/contact-profile-slideout";
import { ContactStageBadge, CountBadge, LabelBadge, LeadStageBadge } from "@/components/application/tessen/tessen-badges";
import {
    formatContactLastContact,
    tessenContacts,
    tessenLeadContacts,
    type ContactStage,
    type TessenContact,
    type TessenLeadContact,
} from "@/components/application/tessen/tessen-data";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import type { TessenUserType } from "@/components/application/tessen/tessen-nav";
import { TessenPageHeader, TessenShell } from "@/components/application/tessen/tessen-shell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";

const PAGE_SIZE = 20;

type StageFilter = ContactStage | "archived";

const stageFilterOptions: { id: StageFilter; label: string }[] = [
    { id: "primeiro-contato", label: "Interessado" },
    { id: "agendado", label: "Agendado" },
    { id: "paciente", label: "Cliente" },
    { id: "inativo", label: "Inativo" },
    { id: "archived", label: "Arquivados" },
];

const defaultStageFilters = new Set(stageFilterOptions.filter((opt) => opt.id !== "archived").map((opt) => opt.id));

function matchesStageFilter(contact: TessenContact, filters: Set<StageFilter>): boolean {
    if (contact.archived) return filters.has("archived");
    return filters.has(contact.stage);
}

interface TessenContactsScreenProps {
    userType?: TessenUserType;
}

function sortPatientContacts(items: TessenContact[], sortDescriptor: SortDescriptor): TessenContact[] {
    return [...items].sort((a, b) => {
        if (sortDescriptor.column === "lastContactDaysAgo") {
            const first = a.lastContactDaysAgo;
            const second = b.lastContactDaysAgo;
            return sortDescriptor.direction === "descending" ? second - first : first - second;
        }
        const first = a[sortDescriptor.column as keyof TessenContact];
        const second = b[sortDescriptor.column as keyof TessenContact];
        if (typeof first === "string" && typeof second === "string") {
            return sortDescriptor.direction === "descending" ? second.localeCompare(first) : first.localeCompare(second);
        }
        return 0;
    });
}

function sortLeadContacts(items: TessenLeadContact[], sortDescriptor: SortDescriptor): TessenLeadContact[] {
    return [...items].sort((a, b) => {
        if (sortDescriptor.column === "lastContactDaysAgo") {
            const first = a.lastContactDaysAgo;
            const second = b.lastContactDaysAgo;
            return sortDescriptor.direction === "descending" ? second - first : first - second;
        }
        const first = a[sortDescriptor.column as keyof TessenLeadContact];
        const second = b[sortDescriptor.column as keyof TessenLeadContact];
        if (typeof first === "string" && typeof second === "string") {
            return sortDescriptor.direction === "descending" ? second.localeCompare(first) : first.localeCompare(second);
        }
        return 0;
    });
}

interface PatientContactsTableProps {
    contacts: TessenContact[];
    sortDescriptor: SortDescriptor;
    onSortChange: (descriptor: SortDescriptor) => void;
    onSelectContact: (contact: TessenContact) => void;
    onArchiveContact: (contact: TessenContact) => void;
    onDeleteContact: (contact: TessenContact) => void;
}

function PatientContactsTable({
    contacts,
    sortDescriptor,
    onSortChange,
    onSelectContact,
    onArchiveContact,
    onDeleteContact,
}: PatientContactsTableProps) {
    return (
        <TableCard.Root className="flex h-full min-h-0 flex-col">
            <TableCard.Header title="Contatos" badge={`${contacts.length} contatos`} titleClassName={tessenTypography.sectionTitle} />
            <div className="min-h-0 flex-1 overflow-auto">
                <Table aria-label="Contatos" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                    <Table.Header>
                        <Table.Head id="fullName" label="Nome" isRowHeader allowsSorting className="w-full max-w-1/4" />
                        <Table.Head id="phone" label="Telefone" allowsSorting />
                        <Table.Head id="stage" label="Estágio" />
                        <Table.Head id="lastContactDaysAgo" label="Último contato" allowsSorting />
                        <Table.Head id="actions" />
                    </Table.Header>
                    <Table.Body items={contacts}>
                        {(item) => (
                            <Table.Row
                                id={item.id}
                                className="cursor-pointer"
                                onAction={() => onSelectContact(item)}
                            >
                                <Table.Cell>
                                    <p className="flex items-center gap-3">
                                        <Avatar initials={item.avatarInitials} size="md" />
                                        <span className="text-sm font-medium text-primary">{item.fullName}</span>
                                    </p>
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap text-secondary">{item.phone}</Table.Cell>
                                <Table.Cell>
                                    <ContactStageBadge stage={item.stage} />
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap text-secondary">
                                    {formatContactLastContact(item.lastContactDaysAgo)}
                                </Table.Cell>
                                <Table.Cell className="px-4">
                                    <div className="flex justify-end">
                                        <Dropdown.Root>
                                            <Dropdown.DotsButton />
                                            <Dropdown.Popover className="w-48">
                                                <Dropdown.Menu>
                                                    <Dropdown.Item icon={ArrowUpRight} onAction={() => onSelectContact(item)}>
                                                        Abrir detalhes
                                                    </Dropdown.Item>
                                                    <Dropdown.Item icon={MessageChatCircle} onAction={() => onSelectContact(item)}>
                                                        Ver conversa
                                                    </Dropdown.Item>
                                                    <Dropdown.Item icon={Archive} onAction={() => onArchiveContact(item)}>
                                                        Arquivar
                                                    </Dropdown.Item>
                                                    <Dropdown.Item icon={Trash01} onAction={() => onDeleteContact(item)}>
                                                        Excluir
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown.Popover>
                                        </Dropdown.Root>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
        </TableCard.Root>
    );
}

interface LeadContactsTableProps {
    leads: TessenLeadContact[];
    sortDescriptor: SortDescriptor;
    onSortChange: (descriptor: SortDescriptor) => void;
}

function LeadContactsTable({ leads, sortDescriptor, onSortChange }: LeadContactsTableProps) {
    return (
        <TableCard.Root>
            <TableCard.Header title="Leads" badge={`${leads.length} empresas`} titleClassName={tessenTypography.sectionTitle} />
            <Table aria-label="Leads comerciais" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                <Table.Header>
                    <Table.Head id="clientName" label="Cliente" isRowHeader allowsSorting className="w-full max-w-1/4" />
                    <Table.Head id="niche" label="Nicho" allowsSorting />
                    <Table.Head id="contactName" label="Contato" allowsSorting />
                    <Table.Head id="phone" label="Telefone" allowsSorting />
                    <Table.Head id="stage" label="Estágio" />
                    <Table.Head id="lastContactDaysAgo" label="Último contato" allowsSorting />
                    <Table.Head id="actions" />
                </Table.Header>
                <Table.Body items={leads}>
                    {(item) => (
                        <Table.Row id={item.id}>
                            <Table.Cell>
                                <p className="text-sm font-medium text-primary">{item.clientName}</p>
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap">
                                <LabelBadge color="brand">{item.niche}</LabelBadge>
                            </Table.Cell>
                            <Table.Cell>
                                <p className="flex items-center gap-3">
                                    <Avatar initials={item.avatarInitials} size="md" />
                                    <span className="min-w-0">
                                        <span className="block text-sm font-medium text-primary">{item.contactName}</span>
                                        <span className="block truncate text-sm text-tertiary">{item.contactEmail}</span>
                                    </span>
                                </p>
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap text-secondary">{item.phone}</Table.Cell>
                            <Table.Cell>
                                <LeadStageBadge stage={item.stage} />
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap text-secondary">
                                {formatContactLastContact(item.lastContactDaysAgo)}
                            </Table.Cell>
                            <Table.Cell className="px-4">
                                <div className="flex justify-end">
                                    <ButtonUtility size="xs" color="tertiary" tooltip="Ver lead" icon={ArrowUpRight} />
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
}

function TessenContactsAdminScreen() {
    const [search, setSearch] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "clientName",
        direction: "ascending",
    });

    const filteredLeads = useMemo(() => {
        const term = search.toLowerCase().trim();
        let list = tessenLeadContacts;
        if (term) {
            list = list.filter(
                (lead) =>
                    lead.clientName.toLowerCase().includes(term) ||
                    lead.niche.toLowerCase().includes(term) ||
                    lead.contactName.toLowerCase().includes(term) ||
                    lead.contactEmail.toLowerCase().includes(term) ||
                    lead.phone.includes(search),
            );
        }
        return sortLeadContacts(list, sortDescriptor);
    }, [search, sortDescriptor]);

    const showNoResults = filteredLeads.length === 0 && search.trim().length > 0;

    return (
        <TessenShell activeUrl="/contatos" userType="admin">
            <TessenPageHeader
                title="Contatos"
                description="Leads comerciais — um contato por empresa interessada em contratar a Tessen"
                actions={
                    <Button size="sm" iconLeading={Plus}>
                        Novo lead
                    </Button>
                }
            />

            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <Input
                    size="sm"
                    placeholder="Buscar por cliente, nicho ou contato"
                    icon={SearchLg}
                    value={search}
                    onChange={setSearch}
                    className="max-w-md"
                />

                {showNoResults ? (
                    <div className="rounded-xl bg-primary px-6 py-10 text-center shadow-xs ring-1 ring-secondary ring-inset">
                        <p className="text-sm text-secondary">
                            Nenhum lead encontrado para &quot;{search}&quot;.
                        </p>
                    </div>
                ) : (
                    <LeadContactsTable
                        leads={filteredLeads}
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                    />
                )}
            </div>
        </TessenShell>
    );
}

function TessenContactsClienteScreen() {
    const [contacts, setContacts] = useState<TessenContact[]>(tessenContacts);
    const [search, setSearch] = useState("");
    const [stageFilters, setStageFilters] = useState<Set<StageFilter>>(new Set(defaultStageFilters));
    const [draftStageFilters, setDraftStageFilters] = useState<Set<StageFilter>>(new Set(defaultStageFilters));
    const [filterOpen, setFilterOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedContact, setSelectedContact] = useState<TessenContact | null>(null);
    const [newOpen, setNewOpen] = useState(false);
    const [editContact, setEditContact] = useState<TessenContact | null>(null);
    const [archiveContact, setArchiveContact] = useState<TessenContact | null>(null);
    const [deleteContact, setDeleteContact] = useState<TessenContact | null>(null);
    const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "fullName",
        direction: "ascending",
    });

    const filteredContacts = useMemo(() => {
        let list = contacts.filter((c) => matchesStageFilter(c, stageFilters));

        if (search.trim()) {
            const term = search.toLowerCase();
            list = list.filter(
                (c) => c.fullName.toLowerCase().includes(term) || c.phone.includes(search),
            );
        }

        return sortPatientContacts(list, sortDescriptor);
    }, [contacts, search, stageFilters, sortDescriptor]);

    const totalPages = Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE));
    const paginatedContacts = filteredContacts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const activeCount = contacts.filter((c) => !c.archived).length;
    const showEmptyBase = activeCount === 0 && !stageFilters.has("archived");
    const showNoFiltersSelected = !showEmptyBase && stageFilters.size === 0;
    const showNoResults =
        !showEmptyBase && !showNoFiltersSelected && filteredContacts.length === 0 && search.trim().length > 0;

    const toggleDraftStageFilter = (id: StageFilter, isSelected: boolean) => {
        setDraftStageFilters((prev) => {
            const next = new Set(prev);
            if (isSelected) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    const handleNewContact = (
        data: Omit<TessenContact, "id" | "activity" | "archived" | "lastContactDaysAgo" | "lastContactAt">,
    ) => {
        const newContact: TessenContact = {
            ...data,
            id: `c-${Date.now()}`,
            archived: false,
            lastContactAt: "Hoje",
            lastContactDaysAgo: 0,
            activity: { totalConversations: 0, totalAppointments: 0 },
        };
        setContacts((prev) => [newContact, ...prev]);
        setPage(1);
    };

    const handleDuplicate = (existing: TessenContact) => {
        setDuplicateNotice(`Contato já cadastrado: ${existing.fullName}`);
        setSelectedContact(existing);
    };

    return (
        <TessenShell
            activeUrl="/contatos"
            userType="cliente"
            className="h-dvh max-h-dvh overflow-hidden"
            mainClassName="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
        >
            <TessenPageHeader
                title="Contatos"
                description="Visualize os contatos da sua base"
                actions={
                    <div className="flex items-center gap-3">
                        {!showEmptyBase && (
                            <>
                                <Input
                                    size="sm"
                                    placeholder="Buscar por nome ou telefone"
                                    icon={SearchLg}
                                    value={search}
                                    onChange={(v) => {
                                        setSearch(v);
                                        setPage(1);
                                    }}
                                    className="w-[280px]"
                                />
                                <AriaDialogTrigger
                                    isOpen={filterOpen}
                                    onOpenChange={(open) => {
                                        setFilterOpen(open);
                                        if (open) setDraftStageFilters(new Set(stageFilters));
                                    }}
                                >
                                    <Button
                                        size="sm"
                                        color="secondary"
                                        iconLeading={
                                            stageFilters.size === 0 ? (
                                                FilterLines
                                            ) : (
                                                <CountBadge color="brand" className="px-1.5">
                                                    {stageFilters.size}
                                                </CountBadge>
                                            )
                                        }
                                    >
                                        Filtrar
                                    </Button>
                                    <AriaPopover placement="bottom right" offset={8} className="will-change-transform">
                                        <AriaDialog aria-label="Filtrar por estágio" className="flex w-56 flex-col gap-3 rounded-xl bg-primary p-3 shadow-xl ring ring-secondary_alt focus:outline-hidden">
                                            <div className="flex flex-col gap-1">
                                                {stageFilterOptions.map((opt) => (
                                                    <Checkbox
                                                        key={opt.id}
                                                        label={opt.label}
                                                        size="sm"
                                                        isSelected={draftStageFilters.has(opt.id)}
                                                        onChange={(isSelected) => toggleDraftStageFilter(opt.id, isSelected)}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between gap-2 border-t border-secondary pt-3">
                                                <Button
                                                    size="sm"
                                                    color="secondary"
                                                    isDisabled={draftStageFilters.size === 0}
                                                    onClick={() => setDraftStageFilters(new Set())}
                                                >
                                                    Limpar filtros
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="primary"
                                                    onClick={() => {
                                                        setStageFilters(draftStageFilters);
                                                        setFilterOpen(false);
                                                        setPage(1);
                                                    }}
                                                >
                                                    Aplicar
                                                </Button>
                                            </div>
                                        </AriaDialog>
                                    </AriaPopover>
                                </AriaDialogTrigger>
                            </>
                        )}
                        <Button size="sm" iconLeading={Plus} onClick={() => setNewOpen(true)}>
                            Novo contato
                        </Button>
                    </div>
                }
            />

            <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
                {duplicateNotice && (
                    <div className="rounded-lg bg-brand-primary px-4 py-3 text-sm text-brand-secondary">
                        {duplicateNotice}
                        <Button color="link-color" size="sm" className="ml-2" onClick={() => setDuplicateNotice(null)}>
                            Fechar
                        </Button>
                    </div>
                )}

                {showEmptyBase ? (
                    <div className="flex min-h-0 flex-1 items-center justify-center">
                        <EmptyState size="md">
                            <EmptyState.Header>
                                <EmptyState.FeaturedIcon icon={Users01} color="gray" theme="modern" />
                            </EmptyState.Header>
                            <EmptyState.Content>
                                <EmptyState.Title>Nenhum contato ainda</EmptyState.Title>
                                <EmptyState.Description>
                                    Os contatos aparecem automaticamente quando clientes enviam mensagens.
                                </EmptyState.Description>
                            </EmptyState.Content>
                        </EmptyState>
                    </div>
                ) : showNoFiltersSelected ? (
                    <TableCard.Root className="flex min-h-0 flex-1 flex-col">
                        <TableCard.Header title="Contatos" badge="0 contatos" titleClassName={tessenTypography.sectionTitle} />
                        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto px-8 py-20">
                            <EmptyState size="sm">
                                <EmptyState.Header pattern="none">
                                    <EmptyState.FeaturedIcon icon={FilterLines} color="gray" theme="modern-neue" />
                                </EmptyState.Header>
                                <EmptyState.Content>
                                    <EmptyState.Title>Nenhum filtro selecionado</EmptyState.Title>
                                    <EmptyState.Description>Selecione ao menos um estágio em "Filtrar" para visualizar os contatos.</EmptyState.Description>
                                </EmptyState.Content>
                            </EmptyState>
                        </div>
                    </TableCard.Root>
                ) : showNoResults ? (
                    <div className="rounded-xl bg-primary px-6 py-10 text-center shadow-xs ring-1 ring-secondary ring-inset">
                        <p className="text-sm text-secondary">
                            Nenhum contato encontrado para &quot;{search}&quot;.
                        </p>
                        <Button color="link-color" size="sm" className="mt-3" onClick={() => setNewOpen(true)}>
                            Cadastrar novo contato
                        </Button>
                    </div>
                ) : (
                    <div className="flex min-h-0 flex-1 flex-col gap-4">
                        <PatientContactsTable
                            contacts={paginatedContacts}
                            sortDescriptor={sortDescriptor}
                            onSortChange={(descriptor) => {
                                setSortDescriptor(descriptor);
                                setPage(1);
                            }}
                            onSelectContact={setSelectedContact}
                            onArchiveContact={setArchiveContact}
                            onDeleteContact={setDeleteContact}
                        />

                        {filteredContacts.length > PAGE_SIZE && (
                            <PaginationPageMinimalCenter
                                page={page}
                                total={totalPages}
                                onPageChange={setPage}
                                className="pt-2"
                            />
                        )}
                    </div>
                )}
            </div>

            <ContactProfileSlideout
                contact={selectedContact}
                isOpen={Boolean(selectedContact)}
                onOpenChange={(open) => !open && setSelectedContact(null)}
                onEdit={() => {
                    if (selectedContact) setEditContact(selectedContact);
                }}
                onArchive={() => {
                    if (selectedContact) setArchiveContact(selectedContact);
                }}
                onUnarchive={() => {
                    if (selectedContact) {
                        setContacts((prev) =>
                            prev.map((c) => (c.id === selectedContact.id ? { ...c, archived: false } : c)),
                        );
                        setSelectedContact({ ...selectedContact, archived: false });
                    }
                }}
            />

            <NewContactModal
                isOpen={newOpen}
                onOpenChange={setNewOpen}
                existingContacts={contacts}
                onSave={handleNewContact}
                onDuplicateFound={handleDuplicate}
            />

            <EditContactModal
                contact={editContact}
                isOpen={Boolean(editContact)}
                onOpenChange={(open) => !open && setEditContact(null)}
                existingContacts={contacts}
                onSave={(updated) => {
                    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
                    if (selectedContact?.id === updated.id) setSelectedContact(updated);
                }}
                onDuplicateFound={handleDuplicate}
            />

            <ArchiveContactModal
                contact={archiveContact}
                isOpen={Boolean(archiveContact)}
                onOpenChange={(open) => !open && setArchiveContact(null)}
                onConfirm={() => {
                    if (!archiveContact) return;
                    setContacts((prev) =>
                        prev.map((c) => (c.id === archiveContact.id ? { ...c, archived: true } : c)),
                    );
                    toast.success(`${archiveContact.fullName} foi arquivado`, {
                        description: "O contato saiu da lista ativa.",
                    });
                    setSelectedContact(null);
                    setArchiveContact(null);
                }}
            />

            <DeleteContactModal
                contact={deleteContact}
                isOpen={Boolean(deleteContact)}
                onOpenChange={(open) => !open && setDeleteContact(null)}
                onConfirm={() => {
                    if (!deleteContact) return;
                    setContacts((prev) => prev.filter((c) => c.id !== deleteContact.id));
                    if (selectedContact?.id === deleteContact.id) setSelectedContact(null);
                    setDeleteContact(null);
                }}
            />
        </TessenShell>
    );
}

export const TessenContactsScreen = ({ userType = "cliente" }: TessenContactsScreenProps) => {
    if (userType === "admin") {
        return <TessenContactsAdminScreen />;
    }
    return <TessenContactsClienteScreen />;
};
