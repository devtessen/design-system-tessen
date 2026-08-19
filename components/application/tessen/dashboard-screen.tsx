"use client";

import { Plus } from "@untitledui/icons";
import { TessenAttendanceVolumeChart } from "@/components/application/tessen/tessen-attendance-volume-chart";
import {
    clienteOverviewMetricLabels,
    clienteOverviewMetricsByPeriod,
    dashboardKpis,
    type ClienteOverviewPeriod,
} from "@/components/application/tessen/tessen-data";
import { TessenClientsTable } from "@/components/application/tessen/tessen-clients-table";
import type { TessenUserType } from "@/components/application/tessen/tessen-nav";
import { TessenPeriodFilter } from "@/components/application/tessen/tessen-period-filter";
import { MetricCard, SimpleMetricCard, TessenPageHeader, TessenShell } from "@/components/application/tessen/tessen-shell";
import { Button } from "@/components/base/buttons/button";

interface TessenDashboardScreenProps {
    userType?: TessenUserType;
}

export const TessenDashboardScreen = ({ userType = "cliente" }: TessenDashboardScreenProps) => {
    const period: ClienteOverviewPeriod = "today";

    const clienteMetrics = clienteOverviewMetricsByPeriod[period];

    return (
        <TessenShell activeUrl="/painel" userType={userType}>
            <TessenPageHeader
                title="Visão Geral"
                description={
                    userType === "admin"
                        ? "Visão consolidada da operação — métricas agregadas dos clientes"
                        : "Visão geral do atendimento e da agenda"
                }
                actions={
                    <div className="flex items-center gap-3">
                        <TessenPeriodFilter />
                        {userType === "admin" && (
                            <Button size="sm" iconLeading={Plus}>
                                Novo cliente
                            </Button>
                        )}
                    </div>
                }
            />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {userType === "admin" ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {dashboardKpis.map((kpi) => (
                            <MetricCard
                                key={kpi.label}
                                label={kpi.label}
                                value={kpi.value}
                                trend={kpi.change}
                                hint={kpi.sublabel}
                                accent="success"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {clienteOverviewMetricLabels.map(({ key, label }) => (
                            <SimpleMetricCard key={key} label={label} value={clienteMetrics[key]} />
                        ))}
                    </div>
                )}

                {userType === "admin" ? <TessenClientsTable /> : <TessenAttendanceVolumeChart period={period} />}
            </div>
        </TessenShell>
    );
};
