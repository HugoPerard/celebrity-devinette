"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DayButton as DefaultDayButton,
  type DayButtonProps,
} from "react-day-picker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CircleCheckIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function puzzlePreviewSrc(isoDate: string): string {
  return `/puzzles/${isoDate}.png`;
}

type ArchiveDayButtonProps = DayButtonProps & {
  availableSet: ReadonlySet<string>;
  isSolved: (iso: string) => boolean;
};

function ArchiveDayButtonInner(props: ArchiveDayButtonProps) {
  const { availableSet, isSolved, ...dayButtonProps } = props;
  const { day, modifiers, className, children } = dayButtonProps;
  const iso = day.isoDate;
  const hasPuzzle = availableSet.has(iso);

  if (!hasPuzzle || modifiers.disabled) {
    return <DefaultDayButton {...dayButtonProps} />;
  }

  const solved = isSolved(iso);

  return (
    <DefaultDayButton
      {...dayButtonProps}
      className={cn(
        className,
        "h-auto min-h-(--cell-size) flex-col gap-0.5 p-1",
      )}
    >
      <span className="relative mx-auto aspect-square w-[88%] max-w-[3.25rem] overflow-hidden rounded-md bg-muted">
        <img
          src={puzzlePreviewSrc(iso)}
          alt=""
          className="size-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {solved ? (
          <span
            className="absolute inset-0 flex items-center justify-center bg-background/45"
            aria-hidden
          >
            <CircleCheckIcon
              className="size-5 text-primary drop-shadow-sm"
              aria-hidden
            />
          </span>
        ) : null}
      </span>
      <span className="text-[0.65rem] font-medium leading-none tabular-nums">
        {children}
      </span>
    </DefaultDayButton>
  );
}

export function ArchiveCalendarModal({
  open,
  onOpenChange,
  selectedDate,
  availableDates,
  minDate,
  maxDate,
  onSelectDate,
  isDateSolved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  availableDates: string[] | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  onSelectDate: (date: Date) => void;
  isDateSolved: (iso: string) => boolean;
}) {
  const availableSet = useMemo(
    () => new Set(availableDates ?? []),
    [availableDates],
  );

  const [month, setMonth] = useState<Date | undefined>(() =>
    selectedDate ?? maxDate ?? minDate ?? new Date(),
  );

  useEffect(() => {
    if (open) {
      setMonth(selectedDate ?? maxDate ?? minDate ?? new Date());
    }
  }, [open, selectedDate, maxDate, minDate]);

  const ArchiveDayButton = useCallback(
    (props: DayButtonProps) => (
      <ArchiveDayButtonInner
        {...props}
        availableSet={availableSet}
        isSolved={isDateSolved}
      />
    ),
    [availableSet, isDateSolved],
  );

  const components = useMemo(
    () => ({ DayButton: ArchiveDayButton }),
    [ArchiveDayButton],
  );

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const iso = format(date, "yyyy-MM-dd");
    if (!availableSet.has(iso)) return;
    onSelectDate(date);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup
          showCloseButton
          bottomStickOnMobile
          className="flex max-sm:max-h-[min(96dvh,48rem)] w-[100vw] flex-col border-white/30 p-0 dark:border-white/18"
        >
          <DialogHeader>
            <DialogTitle>Choisir une date</DialogTitle>
            <DialogDescription>
              Aperçu des devinettes disponibles. La coche indique une réponse
              déjà trouvée sur cet appareil.
            </DialogDescription>
          </DialogHeader>
          <DialogPanel
            scrollFade={false}
            className="border-t border-white/15 px-2 pb-2 pt-1 dark:border-white/10"
          >
            <Calendar
              mode="single"
              locale={fr}
              month={month}
              onMonthChange={setMonth}
              selected={selectedDate}
              onSelect={handleSelect}
              components={components}
              className="mx-auto w-fit [--cell-size:--spacing(14)] sm:[--cell-size:--spacing(13)]"
              disabled={(d) =>
                (availableDates?.length ?? 0) > 0 &&
                !availableDates?.includes(format(d, "yyyy-MM-dd"))
              }
              fromDate={minDate}
              toDate={maxDate}
            />
          </DialogPanel>
          <DialogFooter variant="bare">
            <DialogClose
              className={cn(
                buttonVariants({ variant: "secondary", size: "default" }),
              )}
            >
              Fermer
            </DialogClose>
          </DialogFooter>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
