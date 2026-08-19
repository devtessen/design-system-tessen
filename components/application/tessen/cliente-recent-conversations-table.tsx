"use client";

import { useMemo } from "react";
import { ArrowUpRight } from "@untitledui/icons";
import { Table, TableCard } from "@/components/application/table/table";
import { ClienteConversationStatusBadge } from "@/components/application/tessen/tessen-badges";
import { TessenChannelIcon } from "@/components/application/tessen/tessen-channel-icon";
import { conversationNeedsClienteHighlight, conversations } from "@/components/application/tessen/tessen-data";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Avatar } from "@/components/base/avatar/avatar";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { cx } from "@/utils/cx";

const RECENT_LIMIT = 10;

export const ClienteRecentConversationsTable = () => {
    const recentConversations = useMemo(() => {
        return [...conversations]
            .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
            .slice(0, RECENT_LIMIT);
    }, []);

    return (
        <TableCard.Root>
            <TableCard.Header
                title="Atendimentos recentes"
                badge={`${recentConversations.length} conversas`}
                titleClassName={tessenTypography.sectionTitle}
            />
            <Table aria-label="Atendimentos recentes">
                <Table.Header>
                    <Table.Head id="contactName" label="Contato" isRowHeader className="w-full max-w-1/3" />
                    <Table.Head id="status" label="Status" />
                    <Table.Head id="channel" label="Canal" />
                    <Table.Head id="timestamp" label="Horário" />
                    <Table.Head id="actions" />
                </Table.Header>
                <Table.Body items={recentConversations}>
                    {(item) => (
                        <Table.Row
                            id={item.id}
                            className={cx(
                                conversationNeedsClienteHighlight(item) && "bg-warning-primary",
                            )}
                        >
                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    <Avatar initials={item.avatarInitials} size="md" />
                                    <div>
                                        <p className="text-sm font-medium text-primary">{item.contactName}</p>
                                        <p className="line-clamp-1 text-sm text-tertiary">{item.lastMessage}</p>
                                    </div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <ClienteConversationStatusBadge status={item.status} />
                            </Table.Cell>
                            <Table.Cell>
                                <TessenChannelIcon channel={item.channel ?? "whatsapp"} />
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
        </TableCard.Root>
    );
};
