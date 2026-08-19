import type { FC } from "react";
import { toast, Toaster } from "@/components/application/toast/toast";
import { Button } from "@/components/base/buttons/button";

type ToastVariant = "default" | "success" | "warning" | "error" | "info" | "loading";

const triggerToast = ({
    variant,
    title,
    description,
    withAction,
    actionLabel,
}: {
    variant: ToastVariant;
    title: string;
    description: string;
    withAction: boolean;
    actionLabel: string;
}) => {
    const action = withAction ? { label: actionLabel, onClick: () => toast.success("Ação desfeita") } : undefined;

    if (variant === "loading") {
        const id = toast.loading(title, { description });
        setTimeout(() => {
            toast.success("Concluído", { id, description: "A operação foi concluída com sucesso." });
        }, 2000);
        return;
    }

    const fn = { default: toast, success: toast.success, warning: toast.warning, error: toast.error, info: toast.info }[variant];
    fn(title, { description, action });
};

interface PlaygroundArgs {
    variant: ToastVariant;
    title: string;
    description: string;
    withAction: boolean;
    actionLabel: string;
}

const ToastDemo: FC<PlaygroundArgs> = (args) => <Button onClick={() => triggerToast(args)}>Disparar toast</Button>;

export default {
    title: "Application/Toasts",
    component: ToastDemo,
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-center justify-center bg-secondary p-8">
                <Story />
                <Toaster />
            </div>
        ),
    ],
    argTypes: {
        variant: { control: "select", options: ["default", "success", "warning", "error", "info", "loading"] },
        title: { control: "text" },
        description: { control: "text" },
        withAction: { control: "boolean", description: "Adiciona um botão de ação ao toast (ignorado quando variant é loading)" },
        actionLabel: { control: "text", if: { arg: "withAction" } },
    },
    args: {
        variant: "success" as ToastVariant,
        title: "Maria Silva foi arquivado",
        description: "O contato saiu da lista ativa.",
        withAction: false,
        actionLabel: "Desfazer",
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Notificações toast (sonner) estilizadas com os tokens do design system, disponíveis via `Toaster` (montado em `TessenShell`) e `toast()`. Ajuste os controles e clique no botão para disparar.",
            },
        },
    },
};

/** Playground — ajuste variação, textos e ação, depois clique para disparar o toast. */
export const Playground = (args: PlaygroundArgs) => <ToastDemo {...args} />;
Playground.storyName = "Playground";
