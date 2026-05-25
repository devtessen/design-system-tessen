"use client";

import { useState } from "react";
import { Play, Save01 } from "@untitledui/icons";
import { AgentSandboxPanel } from "@/components/application/tessen/agent-sandbox-panel";
import { nichePresets, thresholdImpactByValue } from "@/components/application/tessen/tessen-data";
import { TessenPageHeader, TessenShell } from "@/components/application/tessen/tessen-shell";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Slider } from "@/components/base/slider/slider";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";

const nicheItems = [
    { id: "clinica", label: "Clínica médica" },
    { id: "salao", label: "Salão e estética" },
    { id: "autonomo", label: "Autônomo" },
    { id: "startup", label: "Startup B2C" },
];

const toneItems = [
    { id: "profissional", label: "Profissional e cordial" },
    { id: "informal", label: "Informal e descontraído" },
    { id: "formal", label: "Formal e técnico" },
];

const agentDoesOptions = [
    { id: "agendar", label: "Agendar, remarcar e cancelar consultas" },
    { id: "convenios", label: "Responder dúvidas sobre convênios e planos" },
    { id: "coletar-dados", label: "Coletar dados do paciente na primeira mensagem" },
    { id: "confirmacoes", label: "Enviar confirmações e lembretes" },
    { id: "horarios", label: "Informar horários de funcionamento" },
    { id: "outro-faz", label: "Outro" },
];

const agentNeverOptions = [
    { id: "diagnosticos", label: "Fornecer orientações médicas ou diagnósticos" },
    { id: "exames", label: "Informar resultados de exames" },
    { id: "descontos", label: "Prometer valores ou descontos não autorizados" },
    { id: "outro-nao", label: "Outro" },
];

function buildPromptFromSelections(does: Set<string>, doesNot: Set<string>, tone: string): string {
    const doesLabels = agentDoesOptions.filter((o) => does.has(o.id)).map((o) => o.label);
    const notLabels = agentNeverOptions.filter((o) => doesNot.has(o.id)).map((o) => o.label);
    const toneLabel = toneItems.find((t) => t.id === tone)?.label ?? tone;

    return [
        "Você é a assistente virtual da clínica.",
        "",
        "O agente deve:",
        ...doesLabels.map((l) => `- ${l}`),
        "",
        "O agente nunca deve:",
        ...notLabels.map((l) => `- ${l}`),
        "",
        `Tom de voz: ${toneLabel}.`,
    ].join("\n");
}

export const TessenAgentConfigScreen = () => {
    const [autoConfirm, setAutoConfirm] = useState(true);
    const [collectData, setCollectData] = useState(true);
    const [silentMode, setSilentMode] = useState(false);
    const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
    const [nicheBanner, setNicheBanner] = useState<string | null>(null);
    const [agentName, setAgentName] = useState("Assistente Saúde");
    const [tone, setTone] = useState("profissional");
    const [does, setDoes] = useState<Set<string>>(new Set(["agendar", "convenios"]));
    const [doesNot, setDoesNot] = useState<Set<string>>(new Set(["diagnosticos", "exames"]));
    const [minConfidence, setMinConfidence] = useState(65);
    const [timeoutMinutes, setTimeoutMinutes] = useState(10);
    const [urgencyKeywords, setUrgencyKeywords] = useState("urgente, emergência");
    const [showPrompt, setShowPrompt] = useState(false);
    const [promptEdited, setPromptEdited] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState(() =>
        buildPromptFromSelections(new Set(["agendar", "convenios"]), new Set(["diagnosticos", "exames"]), "profissional"),
    );
    const [sandboxOpen, setSandboxOpen] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

    const escalationEstimate =
        thresholdImpactByValue[minConfidence] ??
        thresholdImpactByValue[70] ??
        28;

    const applyNichePreset = (nicheId: string) => {
        if (nicheId !== "clinica") return;
        const preset = nichePresets.clinica;
        setAgentName(preset.agentName);
        setTone(preset.tone);
        setDoes(new Set(preset.does));
        setDoesNot(new Set(preset.doesNot));
        setMinConfidence(preset.minConfidence);
        setTimeoutMinutes(preset.timeoutMinutes);
        setUrgencyKeywords(preset.urgencyKeywords);
        const prompt = buildPromptFromSelections(new Set(preset.does), new Set(preset.doesNot), preset.tone);
        setGeneratedPrompt(prompt);
        setPromptEdited(false);
        setNicheBanner("Configurações pré-definidas para Clínica médica aplicadas — ajuste o que precisar");
        setHasUnsavedChanges(true);
    };

    const toggleSet = (set: Set<string>, id: string, checked: boolean) => {
        const next = new Set(set);
        if (checked) next.add(id);
        else next.delete(id);
        return next;
    };

    const regeneratePrompt = (nextDoes: Set<string>, nextNot: Set<string>, nextTone: string) => {
        if (!promptEdited) {
            setGeneratedPrompt(buildPromptFromSelections(nextDoes, nextNot, nextTone));
        }
        setHasUnsavedChanges(true);
    };

    return (
        <TessenShell activeUrl="/agente" className={sandboxOpen ? "overflow-hidden" : undefined}>
            <div className="flex min-h-0 flex-1">
                <div className="flex min-w-0 flex-1 flex-col overflow-auto">
                    <TessenPageHeader
                        title="Configuração do agente"
                        description="Personalize persona, tom de voz e regras de escalação do agente de IA"
                        actions={
                            <>
                                <Button color="secondary" iconLeading={Play} onClick={() => setSandboxOpen(true)}>
                                    Testar agente →
                                </Button>
                                <Button iconLeading={Save01} onClick={() => setHasUnsavedChanges(false)}>
                                    Salvar alterações
                                </Button>
                            </>
                        }
                    />

                    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                        {nicheBanner && (
                            <div className="rounded-lg bg-brand-primary px-4 py-3 text-sm text-brand-secondary">
                                {nicheBanner}
                            </div>
                        )}

                        <section className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
                            <h2 className={tessenTypography.sectionTitle}>Identidade do agente</h2>
                            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <Input
                                    label="Nome do agente"
                                    value={agentName}
                                    onChange={(v) => {
                                        setAgentName(v);
                                        setHasUnsavedChanges(true);
                                    }}
                                />
                                <Select
                                    label="Nicho"
                                    placeholder="Selecione o nicho"
                                    items={nicheItems}
                                    selectedKey={selectedNiche ?? undefined}
                                    onSelectionChange={(key) => {
                                        const id = String(key);
                                        setSelectedNiche(id);
                                        applyNichePreset(id);
                                    }}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                                <Select
                                    label="Tom de voz"
                                    items={toneItems}
                                    selectedKey={tone}
                                    onSelectionChange={(key) => {
                                        const next = String(key);
                                        setTone(next);
                                        regeneratePrompt(does, doesNot, next);
                                    }}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                            </div>
                        </section>

                        <section className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
                            <h2 className={tessenTypography.sectionTitle}>O que o agente faz</h2>
                            <ul className="mt-4 space-y-3">
                                {agentDoesOptions.map((opt) => (
                                    <li key={opt.id}>
                                        <Checkbox
                                            label={opt.label}
                                            isSelected={does.has(opt.id)}
                                            onChange={(checked) => {
                                                const next = toggleSet(does, opt.id, checked);
                                                setDoes(next);
                                                regeneratePrompt(next, doesNot, tone);
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
                            <h2 className={tessenTypography.sectionTitle}>O que o agente nunca deve fazer</h2>
                            <ul className="mt-4 space-y-3">
                                {agentNeverOptions.map((opt) => (
                                    <li key={opt.id}>
                                        <Checkbox
                                            label={opt.label}
                                            isSelected={doesNot.has(opt.id)}
                                            onChange={(checked) => {
                                                const next = toggleSet(doesNot, opt.id, checked);
                                                setDoesNot(next);
                                                regeneratePrompt(does, next, tone);
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h2 className={tessenTypography.sectionTitle}>Prompt de sistema</h2>
                                <Badge type="color" color={promptEdited ? "warning" : "brand"} size="sm">
                                    {promptEdited ? "Editado manualmente" : "Gerado automaticamente"}
                                </Badge>
                            </div>
                            <Button
                                color="link-color"
                                size="sm"
                                className="mt-2"
                                onClick={() => setShowPrompt((v) => !v)}
                            >
                                {showPrompt ? "Ocultar prompt" : "Ver prompt gerado →"}
                            </Button>
                            {showPrompt && (
                                <TextArea
                                    className="mt-4"
                                    rows={8}
                                    value={generatedPrompt}
                                    onChange={(v) => {
                                        setGeneratedPrompt(v);
                                        setPromptEdited(true);
                                        setHasUnsavedChanges(true);
                                    }}
                                />
                            )}
                        </section>

                        <section className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
                            <h2 className={tessenTypography.sectionTitle}>Regras de escalação</h2>
                            <div className="mt-6 space-y-6">
                                <div>
                                    <p className="text-sm font-medium text-secondary">
                                        Confiança mínima: {minConfidence}%
                                    </p>
                                    <Slider
                                        aria-label="Confiança mínima"
                                        minValue={30}
                                        maxValue={95}
                                        value={minConfidence}
                                        onChange={(v) => setMinConfidence(typeof v === "number" ? v : v[0])}
                                        labelPosition="top-floating"
                                        labelFormatter={(v) => `${v}%`}
                                        formatOptions={{ style: "decimal", maximumFractionDigits: 0 }}
                                    />
                                    <div className="mt-2 flex justify-between text-xs text-tertiary">
                                        <span>30–50% Permissivo</span>
                                        <span>51–75% Equilibrado</span>
                                        <span>76–95% Conservador</span>
                                    </div>
                                    <p className="mt-4 text-sm text-secondary">
                                        Com esse threshold, estimamos que:
                                    </p>
                                    <p className="text-sm font-medium text-primary">
                                        → {escalationEstimate}% dos atendimentos serão escalados para humano
                                    </p>
                                    <p className="text-xs text-tertiary">(baseado nos últimos 7 dias de atendimento)</p>
                                </div>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <Input
                                        label="Limite de tempo (minutos)"
                                        type="number"
                                        value={String(timeoutMinutes)}
                                        onChange={(v) => setTimeoutMinutes(Number(v) || 10)}
                                    />
                                    <Input
                                        label="Palavras-chave de urgência"
                                        value={urgencyKeywords}
                                        onChange={setUrgencyKeywords}
                                        className="md:col-span-2"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
                            <h2 className={tessenTypography.sectionTitle}>Comportamento</h2>
                            <ul className="mt-6 divide-y divide-secondary">
                                <li className="flex items-center justify-between gap-4 py-4 first:pt-0">
                                    <div>
                                        <p className="text-sm font-medium text-primary">Confirmação automática de agendamentos</p>
                                    </div>
                                    <ToggleRow isSelected={autoConfirm} onChange={setAutoConfirm} />
                                </li>
                                <li className="flex items-center justify-between gap-4 py-4">
                                    <div>
                                        <p className="text-sm font-medium text-primary">Coleta de dados no início</p>
                                    </div>
                                    <ToggleRow isSelected={collectData} onChange={setCollectData} />
                                </li>
                                <li className="flex items-center justify-between gap-4 py-4 last:pb-0">
                                    <div>
                                        <p className="text-sm font-medium text-primary">Modo silencioso fora do horário</p>
                                    </div>
                                    <ToggleRow isSelected={silentMode} onChange={setSilentMode} />
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>

                {sandboxOpen && (
                    <AgentSandboxPanel
                        hasUnsavedChanges={hasUnsavedChanges}
                        isAgentActive={!hasUnsavedChanges}
                        onClose={() => setSandboxOpen(false)}
                        onActivate={() => {
                            setHasUnsavedChanges(false);
                            setSandboxOpen(false);
                        }}
                    />
                )}
            </div>
        </TessenShell>
    );
};

const ToggleRow = ({ isSelected, onChange }: { isSelected: boolean; onChange: (v: boolean) => void }) => (
    <Toggle isSelected={isSelected} onChange={onChange} />
);
