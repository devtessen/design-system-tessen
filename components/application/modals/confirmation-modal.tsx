"use client";

import type { FC, ReactNode } from "react";
import { Dialog as AriaDialog, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";

interface ConfirmationModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: ReactNode;
    icon?: FC<{ className?: string }>;
    /** @default "error" */
    iconColor?: "error" | "warning" | "brand" | "success" | "gray";
    /** @default "Cancelar" */
    cancelLabel?: string;
    confirmLabel: string;
    /** @default true */
    isDestructive?: boolean;
}

export const ConfirmationModal = ({
    isOpen,
    onOpenChange,
    onConfirm,
    title,
    description,
    icon,
    iconColor = "error",
    cancelLabel = "Cancelar",
    confirmLabel,
    isDestructive = true,
}: ConfirmationModalProps) => {
    return (
        <AriaModalOverlay
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable
            className="fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 px-4 pt-4 pb-4 outline-hidden backdrop-blur-[6px] sm:items-center sm:justify-center sm:px-8 sm:pt-8 sm:pb-8"
        >
            <AriaModal className="w-full max-w-100 rounded-xl bg-primary align-middle shadow-xl outline-hidden sm:rounded-2xl">
                <AriaDialog className="relative w-full p-6 outline-hidden">
                    <CloseButton size="sm" className="absolute top-4 right-4" onClick={() => onOpenChange(false)} />
                    {icon && <FeaturedIcon icon={icon} color={iconColor} theme="light" size="lg" />}
                    <h2 className="mt-4 text-lg font-semibold text-primary">{title}</h2>
                    <div className="mt-1 text-sm text-tertiary">{description}</div>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button color="secondary" size="md" onClick={() => onOpenChange(false)} className="flex-1">
                            {cancelLabel}
                        </Button>
                        <Button
                            color={isDestructive ? "primary-destructive" : "primary"}
                            size="md"
                            className="flex-1"
                            onClick={() => {
                                onConfirm();
                                onOpenChange(false);
                            }}
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </AriaDialog>
            </AriaModal>
        </AriaModalOverlay>
    );
};
