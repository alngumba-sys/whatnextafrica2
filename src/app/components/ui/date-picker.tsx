"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DatePickerProps {
  id?: string;
  value?: string; // Date string in YYYY-MM-DD format
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  className,
  disabled = false,
}: DatePickerProps) {
  // Parse value from string to Date - handle empty strings and validate
  const parseDateValue = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr || dateStr.trim() === '') return undefined;
    const parsed = parse(dateStr, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? parsed : undefined;
  };

  const dateValue = parseDateValue(value);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(dateValue);

  React.useEffect(() => {
    const newDate = parseDateValue(value);
    setSelectedDate(newDate);
  }, [value]);

  const handleSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate && isValid(selectedDate) ? format(selectedDate, "dd/MM/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}