import { useState } from "react";
import { withOverlayAware } from "@/components/internal/decorators";
import { ContactDetailsModal } from "@/components/application/tessen/contact-details-modal";
import { conversations } from "@/components/application/tessen/tessen-data";
import { Button } from "@/components/base/buttons/button";
import { Avatar } from "@/components/base/avatar/avatar";

const sampleConversation = conversations[0];

export default {
    title: "Application/Tessen/Modals",
    decorators: [
        withOverlayAware((Story) => (
            <div className="flex min-h-[480px] w-full items-center justify-center bg-secondary p-8">
                <Story />
            </div>
        )),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    "Modais do produto Tessen. Na tela de conversas, os detalhes do contato abrem ao clicar no nome do usuário no cabeçalho do chat.",
            },
        },
    },
};

/** Detalhes do contato — atributos, informações e histórico. Na inbox, abre ao clicar no nome no cabeçalho da conversa. */
export const DetalhesDoContato = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-primary p-6 text-center shadow-xs ring-1 ring-secondary ring-inset">
                <Avatar initials={sampleConversation.avatarInitials} size="lg" />
                <div>
                    <p className="text-sm text-tertiary">Simulação do cabeçalho do chat</p>
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="mt-1 rounded-sm text-sm font-semibold text-primary outline-focus-ring transition duration-100 ease-linear hover:text-brand-secondary focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        {sampleConversation.contactName}
                    </button>
                </div>
                <Button size="sm" color="secondary" onClick={() => setIsOpen(true)}>
                    Abrir detalhes do contato
                </Button>
            </div>
            <ContactDetailsModal conversation={sampleConversation} isOpen={isOpen} onOpenChange={setIsOpen} />
        </>
    );
};

DetalhesDoContato.storyName = "Detalhes do contato";
DetalhesDoContato.parameters = {
    docs: {
        description: {
            story: [
                "Modal com perfil do contato, abas **Atributos** e **Notas**, campos editáveis e histórico de atendimentos.",
                "",
                "**Uso na inbox:** clique no nome do contato no topo da conversa (ex.: Maria Silva) para abrir.",
                "",
                "**Componentes Untitled UI:** `ModalOverlay`, `Modal`, `Dialog`, `CloseButton`, `Avatar`, `Tabs`, `TabList`, `Button`, `Badge`.",
            ].join("\n"),
        },
    },
};
