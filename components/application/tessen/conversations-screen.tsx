"use client";

import { useMemo, useState } from "react";
import {
    ConversationChatPanel,
    ConversationListPanel,
    getMessagesForConversation,
} from "@/components/application/tessen/conversation-inbox-panels";
import { conversations } from "@/components/application/tessen/tessen-data";
import type { TessenUserType } from "@/components/application/tessen/tessen-nav";
import { TessenShell } from "@/components/application/tessen/tessen-shell";

interface TessenConversationsScreenProps {
    userType?: TessenUserType;
}

export const TessenConversationsScreen = ({ userType = "cliente" }: TessenConversationsScreenProps) => {
    const [selectedId, setSelectedId] = useState(conversations[0]?.id ?? "");

    const selectedConversation = useMemo(
        () => conversations.find((c) => c.id === selectedId) ?? conversations[0],
        [selectedId],
    );

    const messages = useMemo(
        () => (selectedConversation ? getMessagesForConversation(selectedConversation.id) : []),
        [selectedConversation],
    );

    if (!selectedConversation) {
        return null;
    }

    return (
        <TessenShell
            activeUrl="/conversas"
            userType={userType}
            className="h-dvh max-h-dvh overflow-hidden"
            mainClassName="flex h-full min-h-0 flex-1 flex-row overflow-hidden"
        >
            <div className="flex h-full min-h-0 min-w-0 flex-1 overflow-hidden">
                <ConversationListPanel
                    conversations={conversations}
                    selectedId={selectedConversation.id}
                    onSelect={setSelectedId}
                />

                <ConversationChatPanel conversation={selectedConversation} messages={messages} />
            </div>
        </TessenShell>
    );
};
