// src/pages/reservation/components/StepBar.tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Step } from "../types/types";

const STEPS: Step[] = ["pricing", "calendar", "services", "confirmation"];

interface StepBarProps {
  current: Step;
}

export function StepBar({ current }: StepBarProps) {
  const currentIndex = STEPS.indexOf(current);

  return (
    <div className="flex items-center gap-0 mb-8 w-full max-w-lg mx-auto">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 shrink-0 transition-all",
              i < currentIndex
                ? "bg-navy border-navy text-white"
                : i === currentIndex
                ? "bg-white border-navy text-navy"
                : "bg-gray-100 border-gray-200 text-gray-400"
            )}
          >
            {i < currentIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-1 transition-all",
                i < currentIndex ? "bg-navy" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}