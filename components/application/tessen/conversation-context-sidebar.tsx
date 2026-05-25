"use client";

import type { Conversation } from "@/components/application/tessen/tessen-data";
import { ConfidenceSidebarDisplay } from "@/components/application/tessen/tessen-badges";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { cx } from "@/utils/cx";

interface ConversationContextSidebarProps {
    conversation: Conversation;
    className?: string;
}

export const ConversationContextSidebar = ({ conversation, className }: ConversationContextSidebarProps) => {
    const intent = conversation.detectedIntent ?? "Intenção não identificada";
    const hasIntent = Boolean(conversation.detectedIntent);

    return (
        <aside
            className={cx(
                "hidden h-full w-[280px] shrink-0 flex-col border-l border-secondary bg-primary xl:flex",
                className,
            )}
        >
            <div className="flex-1 overflow-y-auto p-4">
                <section className="rounded-lg bg-secondary p-4 ring-1 ring-secondary ring-inset">
                    <h3 className={tessenTypography.overline}>Intenção detectada</h3>
                    <p className="mt-2 text-sm font-semibold text-primary">{intent}</p>
                    {conversation.intentConfidence !== undefined && hasIntent && (
                        <div className="mt-3">
                            <ConfidenceSidebarDisplay value={conversation.intentConfidence} />
                        </div>
                    )}
                    {conversation.lastIntent && (
                        <div className="mt-4 border-t border-secondary pt-3">
                            <p className="text-xs text-tertiary">Última intenção</p>
                            <p className="mt-0.5 text-sm font-medium text-primary">{conversation.lastIntent}</p>
                            {conversation.lastIntentDate && (
                                <p className="text-xs text-quaternary">({conversation.lastIntentDate})</p>
                            )}
                        </div>
                    )}
                </section>

                <section className="mt-4">
                    <h3 className={tessenTypography.overline}>Contato</h3>
                    <dl className="mt-3 space-y-2 text-sm">
                        <div>
                            <dt className="text-tertiary">Telefone</dt>
                            <dd className="font-medium text-primary">{conversation.contactPhone}</dd>
                        </div>
                        {conversation.topSubject && (
                            <div>
                                <dt className="text-tertiary">Assunto recorrente</dt>
                                <dd className="font-medium text-primary">{conversation.topSubject}</dd>
                            </div>
                        )}
                        {conversation.preferredHours && (
                            <div>
                                <dt className="text-tertiary">Horário preferido</dt>
                                <dd className="font-medium text-primary">{conversation.preferredHours}</dd>
                            </div>
                        )}
                        {(conversation.aiHandledCount !== undefined || conversation.humanHandledCount !== undefined) && (
                            <div>
                                <dt className="text-tertiary">Atendimentos</dt>
                                <dd className="font-medium text-primary">
                                    {conversation.aiHandledCount ?? 0} pela IA, {conversation.humanHandledCount ?? 0} por humano
                                </dd>
                            </div>
                        )}
                    </dl>
                </section>
            </div>
        </aside>
    );
};
