import moment, { Moment } from "moment";
import React from "react";
declare type StartWeekType = "monday" | "saturday" | "sunday";
declare enum Views {
    'month' = 0,
    'day' = 1,
    'year' = 2
}
interface DaterangepickerProps {
    startDate?: Moment | Date;
    endDate?: Moment | Date;
    onChange: any;
    startWeek?: StartWeekType;
    datePicker: boolean;
    locale: string;
    minDate?: Moment | Date;
    maxDate?: Moment | Date;
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    showOnlyDaysInMonths?: boolean;
    disableFuture?: boolean;
    shortenWeekDays?: boolean;
    calendarMonthFormat?: "M" | "Mo" | "MM" | "MMM" | "MMMM";
    minimumYear?: number;
    maxYear?: number;
    numberOfYears?: number;
}
interface DaterangepickerState {
    datePicker: boolean;
    currentDate: moment.Moment;
    date: Moment;
    activeView: Views;
    startWeek: StartWeekType;
    year: {
        min: number;
        max: number;
        num: number;
        page: number;
        focused: number;
    };
    month: {
        min: number;
        max: number;
        focused: number;
    };
    day: {
        start?: Moment;
        end?: Moment;
        min?: Moment;
        max?: Moment;
        hoveredDate?: Moment;
    };
}
interface Day {
    date: Moment;
    isCurrentDate: Boolean;
    isInRange: Boolean;
    isDisabled: Boolean;
    isInMonth: Boolean;
    isStart: Boolean;
    isEnd: Boolean;
    maybeEnd: Boolean;
    isHovered: Boolean;
}
interface Year {
    year: String;
    selected: boolean;
    isCurrentYear: boolean;
    isYearBlocked: boolean;
    isFocused: boolean;
}
interface Month {
    monthNum: number;
    monthName: string;
    selected: boolean;
    isCurrentMonth: boolean;
    isMonthBlocked: boolean;
    isFocused: boolean;
}
export { Day, Year, Month, DaterangepickerProps, DaterangepickerState, Views, StartWeekType };
