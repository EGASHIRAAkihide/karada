import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // Adjust the path based on your project structure
import { DayPicker } from "react-day-picker"; // Assuming you're using react-day-picker

export function DatePicker({ value, onChange, placeholder }: { value?: string, onChange: (date: string) => void, placeholder?: string }) {
  // Convert the string value to a Date object or undefined if it's undefined
  const selectedDate = value ? new Date(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <input
          type="text"
          placeholder={placeholder || "Select a date"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input"
        />
      </PopoverTrigger>
      <PopoverContent>
        {/* Use the correct event handler for DayPicker */}
        <DayPicker selected={selectedDate} onDayClick={(date) => onChange(date.toISOString())} />
      </PopoverContent>
    </Popover>
  );
}