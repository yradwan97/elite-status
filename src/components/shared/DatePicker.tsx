import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    dateRange: { from: string; to: string };
    setDateRange: (range: { from: string; to: string }) => void;
    placeholder?: string;
    isArabic?: boolean;
}

export function DatePicker({
    dateRange,
    setDateRange,
    placeholder = "Select dates",
    isArabic = false,
}: DatePickerProps) {
    const selected: DateRange = {
        from: dateRange.from ? new Date(dateRange.from) : undefined,
        to: dateRange.to ? new Date(dateRange.to) : undefined,
    };

    const handleSelect = (range: DateRange | undefined) => {
    const toLocalDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${month}/${day}/${year}`;
    };

    setDateRange({
        from: range?.from ? toLocalDate(range.from) : "",
        to: range?.to ? toLocalDate(range.to) : "",
    });
};

    const label = selected.from
        ? selected.to
            ? `${format(selected.from, "d/M")} – ${format(selected.to, "d/M")}`
            : format(selected.from, "d/M")
        : placeholder;

    return (
        <Popover>
            <PopoverTrigger asChild className="w-full flex lg:w-auto">
                <Button
                    variant="outline"
                    className={cn(
                        "flex-1 px-6 py-4 rounded-2xl cursor-pointer justify-start text-left font-normal h-auto border border-gray-500 lg:border-gray-200 text-black bg-white",
                        isArabic && "text-end flex-row-reverse",
                        !dateRange.from && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    <span>{label}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align={isArabic ? "end" : "start"}>
                <Calendar
                    mode="range"
                    selected={selected}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
}