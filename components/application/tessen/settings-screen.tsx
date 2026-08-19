"use client";

import { useState } from "react";
import { Save01 } from "@untitledui/icons";
import { Tabs } from "@/components/application/tabs/tabs";
import { type TessenNicheId, accountSettings, tessenAccounts, tessenClientAccounts, tessenNicheLabels } from "@/components/application/tessen/tessen-data";
import type { TessenUserType } from "@/components/application/tessen/tessen-nav";
import { TessenPageHeader, TessenShell } from "@/components/application/tessen/tessen-shell";
import { toast } from "@/components/application/toast/toast";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Slider } from "@/components/base/slider/slider";
import { Toggle } from "@/components/base/toggle/toggle";

const nicheItems = (Object.keys(tessenNicheLabels) as TessenNicheId[]).map((id) => ({
    id,
    label: tessenNicheLabels[id],
}));

const clientAccount = tessenClientAccounts[0];
const loggedInAccount = tessenAccounts[0];

const settingsTabs = [
    { id: "empresa", label: "Empresa" },
    { id: "horario", label: "Horário" },
    { id: "atendimento", label: "Atendimento" },
    { id: "notificacoes", label: "Notificações" },
    { id: "conta", label: "Conta" },
];

interface WeekdayHours {
    id: string;
    label: string;
    isOpen: boolean;
    start: string;
    end: string;
}

const defaultWeekdayHours: WeekdayHours[] = [
    { id: "seg", label: "Segunda-feira", isOpen: true, start: "08:00", end: "18:00" },
    { id: "ter", label: "Terça-feira", isOpen: true, start: "08:00", end: "18:00" },
    { id: "qua", label: "Quarta-feira", isOpen: true, start: "08:00", end: "18:00" },
    { id: "qui", label: "Quinta-feira", isOpen: true, start: "08:00", end: "18:00" },
    { id: "sex", label: "Sexta-feira", isOpen: true, start: "08:00", end: "18:00" },
    { id: "sab", label: "Sábado", isOpen: true, start: "09:00", end: "13:00" },
    { id: "dom", label: "Domingo", isOpen: false, start: "09:00", end: "13:00" },
];

interface TessenSettingsScreenProps {
    userType?: TessenUserType;
}

export const TessenSettingsScreen = ({ userType = "cliente" }: TessenSettingsScreenProps) => {
    const [businessName, setBusinessName] = useState(clientAccount.name);
    const [niche, setNiche] = useState<TessenNicheId>("clinica");
    const [phone, setPhone] = useState("(11) 4002-8922");
    const [address, setAddress] = useState("Av. Paulista, 1200 — São Paulo, SP");

    const [weekdayHours, setWeekdayHours] = useState<WeekdayHours[]>(defaultWeekdayHours);

    const [slaThresholdMinutes, setSlaThresholdMinutes] = useState(accountSettings.slaThresholdMinutes);
    const [aiResolutionGoalPercent, setAiResolutionGoalPercent] = useState(accountSettings.aiResolutionGoalPercent);

    const [notifyEscalation, setNotifyEscalation] = useState(true);
    const [notifySlaExceeded, setNotifySlaExceeded] = useState(false);

    const [accountName, setAccountName] = useState(loggedInAccount.name);

    const updateWeekday = (id: string, patch: Partial<WeekdayHours>) => {
        setWeekdayHours((prev) => prev.map((day) => (day.id === id ? { ...day, ...patch } : day)));
    };

    const handleSave = () => {
        toast.success("Configurações salvas");
    };

    return (
        <TessenShell activeUrl="/configuracoes" userType={userType}>
            <TessenPageHeader
                title="Configurações"
                description="Gerencie os dados do seu negócio, preferências de atendimento e notificações"
                actions={
                    <Button iconLeading={Save01} onClick={handleSave}>
                        Salvar alterações
                    </Button>
                }
            />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <Tabs>
                    <Tabs.List type="button-border" size="sm" items={settingsTabs}>
                        {(tab) => <Tabs.Item {...tab} />}
                    </Tabs.List>

                    <div className="mt-6 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
                        <Tabs.Panel id="empresa">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <Input label="Nome do negócio" value={businessName} onChange={setBusinessName} />
                                <Select
                                    label="Nicho"
                                    items={nicheItems}
                                    selectedKey={niche}
                                    onSelectionChange={(key) => setNiche(String(key) as TessenNicheId)}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                                <Input label="Telefone" value={phone} onChange={setPhone} />
                                <Input label="Endereço" value={address} onChange={setAddress} />
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel id="horario">
                            <ul className="divide-y divide-secondary">
                                {weekdayHours.map((day) => (
                                    <li key={day.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
                                        <div className="flex w-40 items-center gap-3">
                                            <Toggle isSelected={day.isOpen} onChange={(v) => updateWeekday(day.id, { isOpen: v })} />
                                            <span className="text-sm font-medium text-primary">{day.label}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Input
                                                aria-label={`Início — ${day.label}`}
                                                type="time"
                                                value={day.start}
                                                onChange={(v) => updateWeekday(day.id, { start: v })}
                                                isDisabled={!day.isOpen}
                                                className="w-32"
                                            />
                                            <span className="text-sm text-tertiary">até</span>
                                            <Input
                                                aria-label={`Fim — ${day.label}`}
                                                type="time"
                                                value={day.end}
                                                onChange={(v) => updateWeekday(day.id, { end: v })}
                                                isDisabled={!day.isOpen}
                                                className="w-32"
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Tabs.Panel>

                        <Tabs.Panel id="atendimento">
                            <div className="space-y-6">
                                <Input
                                    label="Alertar atendente após (minutos)"
                                    type="number"
                                    value={String(slaThresholdMinutes)}
                                    onChange={(v) => setSlaThresholdMinutes(Number(v) || 0)}
                                    className="md:max-w-xs"
                                />
                                <div>
                                    <p className="text-sm font-medium text-secondary">Meta de resolução por IA: {aiResolutionGoalPercent}%</p>
                                    <Slider
                                        aria-label="Meta de resolução por IA"
                                        minValue={0}
                                        maxValue={100}
                                        value={aiResolutionGoalPercent}
                                        onChange={(v) => setAiResolutionGoalPercent(typeof v === "number" ? v : v[0])}
                                        labelPosition="top-floating"
                                        labelFormatter={(v) => `${v}%`}
                                        formatOptions={{ style: "decimal", maximumFractionDigits: 0 }}
                                    />
                                </div>
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel id="notificacoes">
                            <ul className="divide-y divide-secondary">
                                <li className="flex items-center justify-between gap-4 py-4 first:pt-0">
                                    <p className="text-sm font-medium text-primary">E-mail quando um atendimento é escalado</p>
                                    <Toggle isSelected={notifyEscalation} onChange={setNotifyEscalation} />
                                </li>
                                <li className="flex items-center justify-between gap-4 py-4 last:pb-0">
                                    <p className="text-sm font-medium text-primary">Alerta quando o SLA é excedido</p>
                                    <Toggle isSelected={notifySlaExceeded} onChange={setNotifySlaExceeded} />
                                </li>
                            </ul>
                        </Tabs.Panel>

                        <Tabs.Panel id="conta">
                            <div className="flex items-center gap-4">
                                <Avatar size="md" src={loggedInAccount.avatar} alt={loggedInAccount.name} status="online" />
                                <div>
                                    <p className="text-sm font-medium text-primary">{loggedInAccount.name}</p>
                                    <p className="text-sm text-tertiary">{loggedInAccount.email}</p>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:items-end">
                                <Input label="Nome" value={accountName} onChange={setAccountName} />
                                <Button color="secondary" className="md:w-fit">
                                    Alterar senha
                                </Button>
                            </div>
                        </Tabs.Panel>
                    </div>
                </Tabs>
            </div>
        </TessenShell>
    );
};
