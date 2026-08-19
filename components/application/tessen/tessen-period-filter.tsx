"use client";

import { useMemo, useState } from "react";
import { endOfMonth, endOfWeek, getLocalTimeZone, startOfMonth, startOfWeek, today } from "@internationalized/date";
import { useControlledState } from "@react-stately/utils";
import { FilterLines } from "@untitledui/icons";
import { useDateFormatter } from "react-aria";
import type { DateRangePickerProps as AriaDateRangePickerProps, DateValue } from "react-aria-components";
import { DateRangePicker as AriaDateRangePicker, Dialog as AriaDialog, Group as AriaGroup, Popover as AriaPopover, useLocale } from "react-aria-components";
import { RangeCalendar, RangePresetButton } from "@/components/application/date-picker/range-calendar";
import { Button, type ButtonProps } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

const now = today(getLocalTimeZone());

interface TessenPeriodFilterProps extends Omit<AriaDateRangePickerProps<DateValue>, "children"> {
    size?: ButtonProps["size"];
    onApply?: () => void;
    onCancel?: () => void;
}

export const TessenPeriodFilter = ({ value: valueProp, defaultValue, onChange, onApply, onCancel, size = "sm", ...props }: TessenPeriodFilterProps) => {
    const { locale } = useLocale();
    const formatter = useDateFormatter({ month: "short", day: "numeric" });
    const [value, setValue] = useControlledState(valueProp, defaultValue || null, onChange);

    const presets = useMemo(
        () => ({
            today: { label: "Hoje", value: { start: now, end: now } },
            yesterday: { label: "Ontem", value: { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) } },
            thisWeek: { label: "Esta semana", value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) } },
            lastWeek: {
                label: "Semana passada",
                value: { start: startOfWeek(now, locale).subtract({ weeks: 1 }), end: endOfWeek(now, locale).subtract({ weeks: 1 }) },
            },
            thisMonth: { label: "Este mês", value: { start: startOfMonth(now), end: endOfMonth(now) } },
            lastMonth: {
                label: "Mês passado",
                value: { start: startOfMonth(now).subtract({ months: 1 }), end: endOfMonth(now).subtract({ months: 1 }) },
            },
        }),
        [locale],
    );

    return (
        <AriaDateRangePicker aria-label="Filtrar período" shouldCloseOnSelect={false} {...props} value={value} onChange={setValue}>
            <AriaGroup>
                <Button size={size} color="secondary" iconLeading={FilterLines}>
                    {!value ? "Filtrar" : `${formatter.format(value.start.toDate(getLocalTimeZone()))} – ${formatter.format(value.end.toDate(getLocalTimeZone()))}`}
                </Button>
            </AriaGroup>
            <AriaPopover
                placement="bottom right"
                offset={8}
                className={({ isEntering, isExiting }) =>
                    cx(
                        "origin-(--trigger-anchor-point) will-change-transform",
                        isEntering &&
                            "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                        isExiting &&
                            "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                    )
                }
            >
                <AriaDialog aria-label="Filtrar período" className="flex rounded-2xl bg-primary shadow-xl ring ring-secondary_alt focus:outline-hidden">
                    {({ close }) => (
                        <>
                            <div className="hidden w-38 flex-col gap-0.5 border-r border-solid border-secondary p-3 lg:flex">
                                {Object.values(presets).map((preset) => (
                                    <RangePresetButton key={preset.label} value={preset.value} onClick={() => setValue(preset.value)}>
                                        {preset.label}
                                    </RangePresetButton>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <RangeCalendar presets={{ lastWeek: presets.lastWeek, lastMonth: presets.lastMonth }} />
                                <div className="flex justify-end gap-3 border-t border-secondary p-4">
                                    <Button
                                        size="sm"
                                        color="secondary"
                                        onClick={() => {
                                            onCancel?.();
                                            close();
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="primary"
                                        onClick={() => {
                                            onApply?.();
                                            close();
                                        }}
                                    >
                                        Aplicar
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </AriaDialog>
            </AriaPopover>
        </AriaDateRangePicker>
    );
};
