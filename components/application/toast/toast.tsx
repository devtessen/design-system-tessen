"use client";

import { AlertTriangle, CheckCircle, InfoCircle, Loading03, XCircle } from "@untitledui/icons";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

const icons: ToasterProps["icons"] = {
    success: <CheckCircle className="size-5 shrink-0 text-fg-success-primary" />,
    error: <XCircle className="size-5 shrink-0 text-fg-error-primary" />,
    warning: <AlertTriangle className="size-5 shrink-0 text-fg-warning-primary" />,
    info: <InfoCircle className="size-5 shrink-0 text-fg-brand-primary" />,
    loading: <Loading03 className="size-5 shrink-0 animate-spin text-fg-quaternary" />,
};

/** Toaster do design system — estiliza o sonner com os tokens de cor e tipografia do projeto. */
export const Toaster = (props: ToasterProps) => (
    <SonnerToaster
        position="top-right"
        icons={icons}
        toastOptions={{
            unstyled: true,
            classNames: {
                toast: "flex w-full items-start gap-3 rounded-xl bg-primary p-4 shadow-lg ring-1 ring-secondary",
                title: "text-sm font-semibold text-primary",
                description: "mt-0.5 text-sm text-tertiary",
                actionButton: "!rounded-lg !bg-brand-solid !px-3 !py-1.5 !text-xs !font-semibold !text-white",
                cancelButton: "!rounded-lg !bg-secondary !px-3 !py-1.5 !text-xs !font-semibold !text-secondary",
                closeButton: "!border-secondary !bg-primary !text-fg-quaternary",
            },
        }}
        {...props}
    />
);

export { toast } from "sonner";
