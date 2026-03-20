"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/** COSS-style alias — https://coss.com/ui/docs/components/dialog */
export const Dialog = BaseDialog.Root;

export const DialogRoot = BaseDialog.Root;

export const DialogTrigger = BaseDialog.Trigger;

export function DialogPortal({
  children,
  ...props
}: BaseDialog.Portal.Props): React.ReactElement {
  return <BaseDialog.Portal {...props}>{children}</BaseDialog.Portal>;
}

export function DialogBackdrop({
  className,
  ...props
}: BaseDialog.Backdrop.Props): React.ReactElement {
  return (
    <BaseDialog.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/35 backdrop-blur-md transition-[opacity,backdrop-filter] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:bg-black/50 dark:backdrop-blur-lg",
        className,
      )}
      data-slot="dialog-backdrop"
      {...props}
    />
  );
}

export function DialogPopup({
  className,
  children,
  showCloseButton = true,
  bottomStickOnMobile = true,
  closeProps,
  ...props
}: BaseDialog.Popup.Props & {
  showCloseButton?: boolean;
  bottomStickOnMobile?: boolean;
  closeProps?: BaseDialog.Close.Props;
}): React.ReactElement {
  return (
    <BaseDialog.Popup
      className={cn(
        "fixed z-[51] flex max-h-[min(88dvh,44rem)] w-[min(calc(100vw-1.5rem),28rem)] flex-col overflow-hidden rounded-2xl border border-white/25 bg-white/50 p-0 text-foreground shadow-[0_12px_48px_-16px_rgba(0,0,0,0.2)] outline-none backdrop-blur-2xl backdrop-saturate-150 transition-[opacity,transform] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:border-white/15 dark:bg-white/[0.1] dark:shadow-[0_20px_56px_-20px_rgba(0,0,0,0.65)]",
        "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 data-[ending-style]:scale-[0.98] data-[starting-style]:scale-[0.98]",
        bottomStickOnMobile &&
          "max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:max-h-[min(94dvh,46rem)] max-sm:w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl max-sm:border-x-0 max-sm:border-b-0 max-sm:data-[ending-style]:translate-y-2 max-sm:data-[starting-style]:translate-y-2",
        className,
      )}
      data-slot="dialog-popup"
      {...props}
    >
      {showCloseButton ? <DialogCloseIconButton {...closeProps} /> : null}
      {children}
    </BaseDialog.Popup>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-6 pb-3 pt-6 pe-12 in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pb-3",
        className,
      )}
      data-slot="dialog-header"
      {...props}
    />
  );
}

export function DialogPanel({
  className,
  scrollFade = true,
  children,
  ...props
}: React.ComponentProps<"div"> & { scrollFade?: boolean }): React.ReactElement {
  return (
    <div
      className={cn(
        "min-h-0 min-w-0 flex-1 overflow-y-auto px-6 pb-2 pt-0 in-[[data-slot=dialog-popup]:has([data-slot=dialog-header])]:pt-1",
        className,
      )}
      data-slot="dialog-panel"
      {...props}
    >
      {scrollFade ? (
        <ScrollArea scrollFade className="max-h-[min(55vh,28rem)]">
          {children}
        </ScrollArea>
      ) : (
        children
      )}
    </div>
  );
}

export function DialogTitle({
  className,
  ...props
}: BaseDialog.Title.Props): React.ReactElement {
  return (
    <BaseDialog.Title
      className={cn("font-heading text-lg font-semibold tracking-tight", className)}
      data-slot="dialog-title"
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: BaseDialog.Description.Props): React.ReactElement {
  return (
    <BaseDialog.Description
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="dialog-description"
      {...props}
    />
  );
}

export function DialogClose({
  className,
  ...props
}: BaseDialog.Close.Props): React.ReactElement {
  return <BaseDialog.Close className={className} data-slot="dialog-close" {...props} />;
}

export function DialogCloseIconButton({
  className,
  ...props
}: BaseDialog.Close.Props): React.ReactElement {
  return (
    <BaseDialog.Close
      className={cn(
        "absolute end-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-[color,background-color] hover:bg-white/25 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      aria-label="Fermer"
      {...props}
    >
      <XIcon className="size-4" />
    </BaseDialog.Close>
  );
}

export function DialogFooter({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "bare" }): React.ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end",
        variant === "default" &&
          "border-t border-border/60 bg-muted/50 py-4 dark:border-white/10 dark:bg-white/[0.06]",
        variant === "bare" &&
          "in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pt-3 pb-6 pt-4",
        className,
      )}
      data-slot="dialog-footer"
      {...props}
    />
  );
}

/** Backdrop / popup aliases (COSS naming) */
export { DialogBackdrop as DialogOverlay, DialogPopup as DialogContent };
