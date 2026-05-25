"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import {
    accountSettings,
    confidenceTrendData,
    csatMetrics,
    dailyVolumeData,
    escalationBreakdown,
    reportKpis,
    topIntents,
} from "@/components/application/tessen/tessen-data";
import { MetricCard, TessenPageHeader, TessenShell } from "@/components/application/tessen/tessen-shell";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";
import { Button } from "@/components/base/buttons/button";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { DownloadCloud02 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

const VolumeTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: Record<string, number | string> }>; label?: string }) => {
    if (!active || !payload?.[0]) return null;
    const data = payload[0].payload;
    const ia = Number(data.ia);
    const humano = Number(data.humano);
    const abandonado = Number(data.abandonado);
    const total = ia + humano + abandonado;

    return (
        <div className="rounded-lg bg-primary-solid px-3 py-2 text-xs text-white shadow-lg">
            <p className="font-semibold">{label}</p>
            <p className="mt-1">Total: {total} atendimentos</p>
            <p>IA resolveu: {ia} ({total ? Math.round((ia / total) * 100) : 0}%)</p>
            <p>Humano assumiu: {humano} ({total ? Math.round((humano / total) * 100) : 0}%)</p>
            <p>Abandonados: {abandonado} ({total ? Math.round((abandonado / total) * 100) : 0}%)</p>
        </div>
    );
};

export const TessenReportsScreen = () => {
    const [period, setPeriod] = useState("week");
    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    const csatSmallSample = csatMetrics.sampleSize < 10;

    return (
        <TessenShell activeUrl="/relatorios">
            <TessenPageHeader
                title="Relatórios"
                description="Métricas de desempenho do agente e qualidade de atendimento"
                actions={
                    <Button color="secondary" size="sm" iconLeading={DownloadCloud02}>
                        Exportar
                    </Button>
                }
            />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <Tabs selectedKey={period} onSelectionChange={(key) => setPeriod(String(key))}>
                    <TabList
                        type="button-border"
                        size="sm"
                        items={[
                            { id: "day", label: "Diário" },
                            { id: "week", label: "Semanal" },
                            { id: "month", label: "Mensal" },
                        ]}
                    />
                </Tabs>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {reportKpis.map((kpi) => (
                        <MetricCard
                            key={kpi.label}
                            label={kpi.label}
                            value={kpi.value}
                            trend={kpi.change}
                            hint={"sublabel" in kpi ? kpi.sublabel : undefined}
                            accent="success"
                        />
                    ))}
                </div>

                <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
                    <h2 className={tessenTypography.sectionTitle}>CSAT</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <p className={tessenTypography.statValue}>{csatMetrics.overall}/5</p>
                            <p className="text-sm text-tertiary">
                                CSAT geral {csatMetrics.overallChange} · baseado em {csatMetrics.sampleSize} avaliações · {csatMetrics.periodDays} dias
                            </p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-primary">CSAT da IA: {csatMetrics.ai.score}/5</p>
                            <p className="text-sm text-tertiary">({csatMetrics.ai.sample} avaliações)</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-primary">CSAT humano: {csatMetrics.human.score}/5</p>
                            <p className="text-sm text-tertiary">({csatMetrics.human.sample} avaliações)</p>
                        </div>
                    </div>
                    {csatSmallSample && (
                        <p className="mt-3 text-sm text-warning-primary">
                            Amostra pequena — dado pode não ser representativo
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
                        <h2 className={tessenTypography.sectionTitle}>Volume de atendimentos</h2>
                        <ul className="mt-2 flex flex-wrap gap-4 text-sm text-tertiary">
                            <li className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-utility-brand-600" /> IA resolveu
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-utility-brand-300" /> Humano assumiu
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-utility-neutral-400" /> Abandonado
                            </li>
                        </ul>
                        <ResponsiveContainer initialDimension={{ width: 1, height: 1 }} className="mt-4 h-64!">
                            <BarChart data={dailyVolumeData} className="text-tertiary [&_.recharts-text]:text-xs">
                                <CartesianGrid vertical={false} stroke="currentColor" className="text-border-secondary" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} width={32} />
                                <Tooltip content={<VolumeTooltip />} cursor={{ fill: "transparent" }} />
                                <Legend content={() => null} />
                                <ReferenceLine
                                    y={50}
                                    stroke="currentColor"
                                    strokeDasharray="4 4"
                                    className="text-tertiary"
                                    label={{ value: `Meta: ${accountSettings.aiResolutionGoalPercent}%`, position: "insideTopRight", fill: "currentColor", fontSize: 11 }}
                                />
                                <Bar dataKey="ia" name="IA resolveu" fill="currentColor" className="text-utility-brand-600" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="humano" name="Humano assumiu" fill="currentColor" className="text-utility-brand-300" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="abandonado" name="Abandonado" fill="currentColor" className="text-utility-neutral-400" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
                        <h2 className={tessenTypography.sectionTitle}>Evolução da confiança média</h2>
                        <ResponsiveContainer initialDimension={{ width: 1, height: 1 }} className="mt-6 h-64!">
                            <LineChart data={confidenceTrendData} className="text-tertiary [&_.recharts-text]:text-xs">
                                <CartesianGrid vertical={false} stroke="currentColor" className="text-border-secondary" />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                                <YAxis domain={[50, 80]} axisLine={false} tickLine={false} width={32} unit="%" />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="confidence"
                                    name="Confiança média"
                                    stroke="currentColor"
                                    className="text-utility-brand-600"
                                    strokeWidth={2}
                                    dot={{ fill: "currentColor", r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
                    <h2 className={tessenTypography.sectionTitle}>Por que a IA escalou</h2>
                    <p className="mt-1 text-sm text-tertiary">Últimos 7 dias — 63 escalações</p>
                    <ul className="mt-6 space-y-4">
                        {escalationBreakdown.map((row) => (
                            <li key={row.reason}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedReason(selectedReason === row.reason ? null : row.reason)}
                                    className="w-full text-left outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={cx("font-medium", selectedReason === row.reason && "text-brand-secondary")}>
                                            {row.label}
                                        </span>
                                        <span className="text-tertiary">
                                            {row.percent}% ({row.count})
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-quaternary">
                                        <div
                                            className="h-full rounded-full bg-brand-solid transition duration-100 ease-linear"
                                            style={{ width: `${row.percent}%` }}
                                        />
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                    {selectedReason && (
                        <p className="mt-4 text-sm text-tertiary">
                            Lista filtrada: contato, hora e mensagem que causou a escalação (dados da API).
                        </p>
                    )}
                </div>

                <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
                    <h2 className={tessenTypography.sectionTitle}>Assuntos mais recorrentes</h2>
                    <ul className="mt-4 space-y-3">
                        {topIntents.map((item) => (
                            <li key={item.intent} className="flex items-center justify-between text-sm">
                                <span className="font-medium text-primary">{item.intent}</span>
                                <span className="text-tertiary">{item.percent}%</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <MetricCard label="Novos vs recorrentes" value="Novos: 12 (16%)" trend="84% recorrentes" hint="Recorrentes: 62 (84%)" accent="success" />
                    <MetricCard label="Fora do horário" value="23" trend="31% do total" hint="91% resolvidos pela IA" accent="success" />
                </div>
            </div>
        </TessenShell>
    );
};
