"use client";

import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { ContactStageBadge } from "@/components/application/tessen/tessen-badges";
import { TessenChannelIcon } from "@/components/application/tessen/tessen-channel-icon";
import { contactChannelItems, type TessenContact } from "@/components/application/tessen/tessen-data";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";

interface ContactProfileSlideoutProps {
    contact: TessenContact | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: () => void;
    onArchive: () => void;
    onUnarchive?: () => void;
}

export const ContactProfileSlideout = ({
    contact,
    isOpen,
    onOpenChange,
    onEdit,
    onArchive,
    onUnarchive,
}: ContactProfileSlideoutProps) => {
    if (!contact) return null;

    const originLabel = contactChannelItems.find((c) => c.id === contact.originChannel)?.label;

    return (
        <SlideoutMenu isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
            {({ close }) => (
                <>
                    <SlideoutMenu.Header onClose={close}>
                        <div className="flex flex-col items-center gap-3 pr-8 text-center">
                            <Avatar initials={contact.avatarInitials} size="xl" />
                            <div>
                                <h2 className={tessenTypography.profileName}>{contact.fullName}</h2>
                                <p className="mt-1 text-sm text-tertiary">{contact.phone}</p>
                            </div>
                            <ContactStageBadge stage={contact.stage} />
                        </div>
                    </SlideoutMenu.Header>

                    <SlideoutMenu.Content className="gap-8">
                        <section>
                            <h3 className={tessenTypography.overline}>Dados cadastrais</h3>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Canal de origem</dt>
                                    <dd className="flex items-center gap-1.5 font-medium text-primary">
                                        <TessenChannelIcon channel={contact.originChannel} showLabel />
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Primeiro contato</dt>
                                    <dd className="font-medium text-primary">{contact.firstContactAt}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Último contato</dt>
                                    <dd className="font-medium text-primary">{contact.lastContactAt}</dd>
                                </div>
                                {originLabel && (
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-tertiary">Canal preferencial</dt>
                                        <dd className="font-medium text-primary">
                                            {contactChannelItems.find((c) => c.id === contact.preferredChannel)?.label}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </section>

                        <section>
                            <h3 className={tessenTypography.overline}>Resumo de atividade</h3>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Total de conversas</dt>
                                    <dd className="font-medium text-primary">{contact.activity.totalConversations}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-tertiary">Agendamentos realizados</dt>
                                    <dd className="font-medium text-primary">{contact.activity.totalAppointments}</dd>
                                </div>
                                {contact.activity.lastAppointment && (
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-tertiary">Último agendamento</dt>
                                        <dd className="text-right font-medium text-primary">
                                            {contact.activity.lastAppointment.date}
                                            <span className="block text-xs font-normal text-tertiary">
                                                {contact.activity.lastAppointment.status}
                                            </span>
                                        </dd>
                                    </div>
                                )}
                                {contact.activity.nextAppointment && (
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-tertiary">Próximo agendamento</dt>
                                        <dd className="text-right font-medium text-primary">
                                            {contact.activity.nextAppointment.date}
                                            <span className="block text-xs font-normal text-tertiary">
                                                {contact.activity.nextAppointment.status}
                                            </span>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </section>

                        <section className="flex flex-col gap-2">
                            <Button color="secondary" size="sm">
                                Ver conversas →
                            </Button>
                            <Button color="secondary" size="sm">
                                Ver agendamentos →
                            </Button>
                            <Button color="secondary" size="sm" onClick={onEdit}>
                                Editar dados
                            </Button>
                            {contact.archived ? (
                                <Button color="link-color" size="sm" onClick={onUnarchive}>
                                    Desarquivar contato
                                </Button>
                            ) : (
                                <Button color="link-gray" size="sm" onClick={onArchive}>
                                    Arquivar contato
                                </Button>
                            )}
                        </section>
                    </SlideoutMenu.Content>
                </>
            )}
        </SlideoutMenu>
    );
};
