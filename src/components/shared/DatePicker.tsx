import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";           // your shadcn cn utility
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    date: string;                    // ISO string from your state (e.g. "2026-04-20")
    setDate: (date: string) => void;
    placeholder?: string;
    isArabic?: boolean;
}

export function DatePicker({ 
    date, 
    setDate, 
    placeholder = "Select date", 
    isArabic = false 
}: DatePickerProps) {
    
    const selectedDate = date ? new Date(date) : undefined;

    const handleSelect = (newDate: Date | undefined) => {
        if (newDate) {
            // Keep the same format your original input expects (YYYY-MM-DD)
            setDate(newDate.toISOString().split('T')[0]);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "flex-1 px-6 py-4 rounded-2xl justify-start text-left font-normal h-auto border border-gray-200 text-black bg-white",
                        isArabic && "text-end flex-row-reverse",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    {date ? format(selectedDate!, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align={isArabic ? "end" : "start"}>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                />
            </PopoverContent>
        </Popover>
    );
}