import { useState } from "react";
import type { TessenNicheId } from "./tessen-data";
import * as Demos from "./tessen.demo";
import { tessenInboxDecorator, tessenScreenDecorator } from "./tessen-story-shared";

export default {
    title: "Tessen/Admin",
    decorators: [tessenScreenDecorator],
};

export const PainelDeAtendimentos = () => <Demos.TessenDashboardScreen userType="admin" />;
export const Conversas = () => <Demos.TessenConversationsScreen userType="admin" />;
Conversas.decorators = [tessenInboxDecorator];

export const Contatos = () => <Demos.TessenContactsScreen userType="admin" />;
export const Relatorios = () => <Demos.TessenReportsScreen userType="admin" />;

export const Agentes = () => {
    const [selectedNiche, setSelectedNiche] = useState<TessenNicheId | null>(null);

    if (selectedNiche) {
        return <Demos.TessenAgentConfigScreen nicheId={selectedNiche} onBack={() => setSelectedNiche(null)} />;
    }

    return <Demos.TessenAgentsScreen onConfigureAgent={setSelectedNiche} />;
};

export const ConfiguracaoDoAgente = () => <Demos.TessenAgentConfigScreen nicheId="clinica" />;

PainelDeAtendimentos.storyName = "01 — Visão Geral";
Conversas.storyName = "02 — Conversas";
Contatos.storyName = "03 — Contatos";
Relatorios.storyName = "04 — Relatórios";
Agentes.storyName = "05 — Agentes";
ConfiguracaoDoAgente.storyName = "06 — Configuração do agente";
