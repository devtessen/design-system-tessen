import { tessenInboxDecorator, tessenScreenDecorator } from "./tessen-story-shared";
import * as Demos from "./tessen.demo";

export default {
    title: "Tessen/Cliente",
    decorators: [tessenScreenDecorator],
};

export const VisaoGeral = () => <Demos.TessenDashboardScreen userType="cliente" />;
export const Agendamentos = () => <Demos.TessenAppointmentsScreen userType="cliente" />;
export const Conversas = () => <Demos.TessenConversationsScreen userType="cliente" />;
Conversas.decorators = [tessenInboxDecorator];

export const Contatos = () => <Demos.TessenContactsScreen userType="cliente" />;
export const Configuracoes = () => <Demos.TessenSettingsScreen userType="cliente" />;

VisaoGeral.storyName = "01 — Visão Geral";
Agendamentos.storyName = "02 — Agendamentos";
Conversas.storyName = "03 — Conversas";
Contatos.storyName = "04 — Contatos";
Configuracoes.storyName = "05 — Configurações";
