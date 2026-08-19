import { type FC, useState } from "react";
import { Archive, AlertTriangle, LogOut01, Trash01 } from "@untitledui/icons";
import { ConfirmationModal } from "@/components/application/modals/confirmation-modal";
import { Button } from "@/components/base/buttons/button";

const iconsByKey = {
    trash: Trash01,
    archive: Archive,
    logout: LogOut01,
    alert: AlertTriangle,
};

type IconKey = keyof typeof iconsByKey;

interface PlaygroundArgs {
    triggerLabel: string;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel: string;
    icon: IconKey;
    iconColor: "error" | "warning" | "brand" | "success" | "gray";
    isDestructive: boolean;
}

const ConfirmationModalDemo: FC<PlaygroundArgs> = ({ triggerLabel, icon, ...args }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button color={args.isDestructive ? "primary-destructive" : "secondary"} onClick={() => setIsOpen(true)}>
                {triggerLabel}
            </Button>
            <ConfirmationModal {...args} icon={iconsByKey[icon]} isOpen={isOpen} onOpenChange={setIsOpen} onConfirm={() => {}} />
        </>
    );
};

export default {
    title: "Application/Modals",
    component: ConfirmationModalDemo,
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-center justify-center bg-secondary p-8">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        triggerLabel: { control: "text", description: "Texto do botão que abre o modal (apenas para a demo)" },
        title: { control: "text" },
        description: { control: "text" },
        confirmLabel: { control: "text" },
        cancelLabel: { control: "text" },
        icon: { control: "select", options: Object.keys(iconsByKey) },
        iconColor: { control: "select", options: ["error", "warning", "brand", "success", "gray"] },
        isDestructive: { control: "boolean", description: "Cor do botão de confirmação: destrutiva (vermelho) ou primária" },
    },
    args: {
        triggerLabel: "Excluir contato",
        title: "Excluir Maria Silva?",
        description: "Essa ação é permanente. Todo o histórico de conversas e agendamentos deste contato será removido e não poderá ser recuperado.",
        confirmLabel: "Excluir",
        cancelLabel: "Cancelar",
        icon: "trash" as IconKey,
        iconColor: "error",
        isDestructive: true,
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Modal de confirmação reutilizável (`ConfirmationModal`), construído sobre os primitivos `ModalOverlay`/`Modal`/`Dialog` e `FeaturedIcon`. Ajuste os controles abaixo e clique no botão para abrir o modal com as props escolhidas.",
            },
        },
    },
};

/** Playground — ajuste os controles e clique no botão para ver o modal atualizado em tempo real. */
export const Playground = (args: PlaygroundArgs) => <ConfirmationModalDemo {...args} />;
Playground.storyName = "Playground";

/** Ação reversível que ainda exige atenção do usuário (ex.: arquivar). */
export const Aviso = (args: PlaygroundArgs) => <ConfirmationModalDemo {...args} />;
Aviso.storyName = "Aviso";
Aviso.args = {
    triggerLabel: "Arquivar contato",
    title: "Arquivar Maria Silva?",
    description: "O histórico será mantido, mas o contato não aparecerá mais na lista ativa e não receberá follow-ups automáticos do agente.",
    confirmLabel: "Arquivar",
    icon: "archive" as IconKey,
    iconColor: "warning",
    isDestructive: false,
};

/** Confirmação neutra, sem ação destrutiva. */
export const Neutra = (args: PlaygroundArgs) => <ConfirmationModalDemo {...args} />;
Neutra.storyName = "Neutra";
Neutra.args = {
    triggerLabel: "Sair da conta",
    title: "Sair da conta?",
    description: "Você precisará entrar novamente para acessar o painel.",
    confirmLabel: "Sair",
    icon: "logout" as IconKey,
    iconColor: "brand",
    isDestructive: false,
};
