"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getAttendanceVolumeData, type ClienteOverviewPeriod, type ReportVolumePeriod } from "@/components/application/tessen/tessen-data";
import { tessenTypography } from "@/components/application/tessen/tessen-typography";

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

interface TessenAttendanceVolumeChartProps {
    period?: ClienteOverviewPeriod | ReportVolumePeriod;
    className?: string;
}

export const TessenAttendanceVolumeChart = ({ period = "week", className }: TessenAttendanceVolumeChartProps) => {
    const data = useMemo(() => getAttendanceVolumeData(period), [period]);

    return (
        <div className={className ?? "rounded-xl bg-primary p-8 shadow-xs ring-1 ring-secondary ring-inset"}>
            <h2 className={tessenTypography.sectionTitle}>Volume de atendimentos</h2>
            <ResponsiveContainer initialDimension={{ width: 1, height: 1 }} className="mt-8 h-64!">
                <BarChart key={period} data={data} className="text-tertiary [&_.recharts-text]:text-xs">
                    <CartesianGrid vertical={false} stroke="currentColor" className="text-border-secondary" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} width={32} />
                    <Tooltip content={<VolumeTooltip />} cursor={{ fill: "transparent" }} />
                    <Legend content={() => null} />
                    <Bar dataKey="ia" name="IA resolveu" fill="currentColor" className="text-utility-purple-600" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="humano" name="Humano assumiu" fill="currentColor" className="text-utility-brand-600" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="abandonado" name="Abandonado" fill="currentColor" className="text-utility-neutral-400" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
            </ResponsiveContainer>
            <ul className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-tertiary">
                <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-utility-purple-600" /> IA resolveu
                </li>
                <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-utility-brand-600" /> Humano assumiu
                </li>
                <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-utility-neutral-400" /> Abandonado
                </li>
            </ul>
        </div>
    );
};
