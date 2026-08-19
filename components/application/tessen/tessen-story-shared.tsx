import type { Decorator } from "@storybook/react";
import { withOverlayAware } from "@/components/internal/decorators";

export const tessenScreenDecorator: Decorator = withOverlayAware((Story) => (
    <div className="min-h-screen w-full">
        <Story />
    </div>
));

export const tessenInboxDecorator: Decorator = withOverlayAware((Story) => (
    <div className="h-dvh max-h-dvh w-full overflow-hidden">
        <Story />
    </div>
));

export const tessenModalDecorator: Decorator = withOverlayAware((Story) => (
    <div className="flex min-h-[480px] w-full items-center justify-center bg-secondary p-8">
        <Story />
    </div>
));

