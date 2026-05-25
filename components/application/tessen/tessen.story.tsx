import { withOverlayAware } from "@/components/internal/decorators";
import * as Demos from "./tessen.demo";

export default {
    title: "Application/Tessen",
    decorators: [
        withOverlayAware((Story) => (
            <div className="min-h-screen w-full">
                <Story />
            </div>
        )),
    ],
};

export const PainelDeAtendimentos = () => <Demos.TessenDashboardScreen />;
export const Conversas = () => <Demos.TessenConversationsScreen />;
Conversas.decorators = [
    withOverlayAware((Story) => (
        <div className="h-dvh max-h-dvh w-full overflow-hidden">
            <Story />
        </div>
    )),
];

export const ConversaIndividual = () => <Demos.TessenConversationDetailScreen />;
ConversaIndividual.decorators = Conversas.decorators;
export const Contatos = () => <Demos.TessenContactsScreen />;
export const ConfiguracaoDoAgente = () => <Demos.TessenAgentConfigScreen />;
export const Relatorios = () => <Demos.TessenReportsScreen />;

PainelDeAtendimentos.storyName = "01 — Painel de atendimentos";
Conversas.storyName = "02 — Conversas";
ConversaIndividual.storyName = "03 — Conversa individual";
Contatos.storyName = "04 — Contatos";
ConfiguracaoDoAgente.storyName = "05 — Configuração do agente";
Relatorios.storyName = "06 — Relatórios";
