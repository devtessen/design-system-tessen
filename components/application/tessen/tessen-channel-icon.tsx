"use client";

import { Globe02, MessageChatCircle, Send01 } from "@untitledui/icons";
import type { ConversationChannel, AppointmentSource } from "@/components/application/tessen/tessen-data";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

const channelConfig: Record<ConversationChannel, { label: string; Icon: typeof MessageChatCircle }> = {
    whatsapp: { label: "WhatsApp", Icon: MessageChatCircle },
    telegram: { label: "Telegram", Icon: Send01 },
    webchat: { label: "Webchat", Icon: Globe02 },
};

interface TessenChannelIconProps {
    channel?: ConversationChannel | AppointmentSource;
    className?: string;
    showLabel?: boolean;
    showIcon?: boolean;
}

export const TessenChannelIcon = ({ channel = "whatsapp", className, showLabel = false, showIcon = true }: TessenChannelIconProps) => {
    if (channel === "manual") {
        return <span className={cx("text-sm text-tertiary", className)}>Manual</span>;
    }

    const { label, Icon } = channelConfig[channel];

    const icon = (
        <span className={cx("inline-flex items-center gap-1.5", className)}>
            {showIcon && <Icon className="size-4 text-fg-tertiary" aria-hidden="true" />}
            {showLabel && <span className="text-sm text-secondary">{label}</span>}
        </span>
    );

    if (showLabel) return icon;

    return (
        <Tooltip title={label} placement="top">
            {icon}
        </Tooltip>
    );
};
