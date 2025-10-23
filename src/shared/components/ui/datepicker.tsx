"use client"

import * as React from "react"
import { ChevronDownIcon, CalendarIcon } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"

type Variant = "button" | "button-input" | "input-time"

type DatePickerProps = {
	variant?: Variant
	label?: string
	id?: string
	value?: Date | undefined
	onChange?: (d: Date | undefined) => void
	initialMonth?: Date | undefined
}

/** Reusable DatePicker with three variants:
 * - 'button' -> a button that opens a calendar popover
 * - 'button-input' -> button calendar + separate time input
 * - 'input-time' -> text input + calendar trigger icon
 */
export function DatePicker({ variant = "button", label, id, value, onChange, initialMonth }: DatePickerProps) {
	const [open, setOpen] = React.useState(false)
	const [date, setDate] = React.useState<Date | undefined>(value)
	const [month, setMonth] = React.useState<Date | undefined>(initialMonth ?? value)

	React.useEffect(() => setDate(value), [value])

	const handleSelect = (d: Date | undefined) => {
		setDate(d)
		onChange?.(d)
		setOpen(false)
	}

	if (variant === "button") {
		return (
			<div className="flex flex-col gap-3">
				{label ? <Label htmlFor={id} className="px-1">{label}</Label> : null}
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" id={id} className="w-48 justify-between font-normal">
							{date ? date.toLocaleDateString() : "Select date"}
							<ChevronDownIcon />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto overflow-hidden p-0" align="start">
						<Calendar
							mode="single"
							selected={date}
							captionLayout="dropdown"
							onSelect={handleSelect}
						/>
					</PopoverContent>
				</Popover>
			</div>
		)
	}

	if (variant === "button-input") {
		return (
			<div className="flex gap-4">
				<div className="flex flex-col gap-3">
					{label ? <Label htmlFor={id} className="px-1">Date</Label> : null}
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button variant="outline" id={id} className="w-32 justify-between font-normal">
								{date ? date.toLocaleDateString() : "Select date"}
								<ChevronDownIcon />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto overflow-hidden p-0" align="start">
							<Calendar mode="single" selected={date} captionLayout="dropdown" onSelect={handleSelect} />
						</PopoverContent>
					</Popover>
				</div>
				<div className="flex flex-col gap-3">
					<Label htmlFor={`${id}-time`} className="px-1">Time</Label>
					<Input type="time" id={`${id}-time`} step="1" defaultValue="10:30:00" className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden" />
				</div>
			</div>
		)
	}

	const formatDate = (d: Date | undefined) => d ? d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" }) : ""
	const isValidDate = (d: Date | undefined) => !!d && !isNaN(d.getTime())

	return (
		<div className="flex flex-col gap-3">
			{label ? <Label htmlFor={id} className="px-1">{label}</Label> : null}
			<div className="relative flex gap-2">
				<Input
					id={id}
					value={formatDate(date)}
					placeholder={formatDate(initialMonth)}
					className="bg-background pr-10"
					onChange={(e) => {
						const parsed = new Date(e.target.value)
						if (isValidDate(parsed)) {
							setDate(parsed)
							onChange?.(parsed)
							setMonth(parsed)
						}
					}}
					onKeyDown={(e) => {
						if (e.key === "ArrowDown") {
							e.preventDefault()
							setOpen(true)
						}
					}}
				/>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button id={`${id}-trigger`} variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
							<CalendarIcon className="size-3.5" />
							<span className="sr-only">Select date</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
						<Calendar mode="single" selected={date} captionLayout="dropdown" month={month} onMonthChange={setMonth} onSelect={(d) => { setDate(d); onChange?.(d); setOpen(false); }} />
					</PopoverContent>
				</Popover>
			</div>
		</div>
	)
}

// Wrapper components for the three examples
export function DateOfBirthPicker() {
	return <DatePicker variant="button" label="Date of birth" id="dob" />
}

export function PickerWithInput() {
	return <DatePicker variant="button-input" id="date-picker" />
}

export function DateAndTimePicker() {
	return <DatePicker variant="input-time" label="Subscription Date" id="subscription-date" initialMonth={new Date("2025-06-01")} />
}

