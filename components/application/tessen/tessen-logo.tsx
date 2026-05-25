"use client";

import type { HTMLAttributes } from "react";
import { cx } from "@/utils/cx";

const LOGO_BLACK = "/logos/Horizontal_Tessen_Black.png";
const LOGO_WHITE = "/logos/Horizontal_Tessen_White.png";

export const TessenLogo = (props: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div {...props} className={cx("flex h-6 w-max items-center", props.className)} aria-label="Tessen">
            <img src={LOGO_BLACK} alt="" className="h-6 w-auto dark:hidden" />
            <img src={LOGO_WHITE} alt="" className="h-6 w-auto not-dark:hidden" />
        </div>
    );
};
