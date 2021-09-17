import moment, { Moment } from "moment";
/**
 * @param {number} year The start year
 * @param {number} month The end month
 */
declare function getMonthDateRange(year: number, month: number): {
    start: moment.Moment;
    end: moment.Moment;
};
/**
 * @param {date|Moment} start The start date
 * @param {date|Moment} end The end date
 * @param {"monday"|"saturday"|"sunday"} weekStart First Day of the Week
 */
declare type weekStart = "monday" | "saturday" | "sunday";
declare function getCalendarDateRange(start: Moment, end: Moment, weekStart: weekStart): {
    startCalendar: moment.Moment;
    endCalendar: moment.Moment;
};
/**
 * @param {date|Moment} start The start date
 * @param {date|Moment} end The end date
 * @param { "year" | "years" | "y" | "month" | "months" | "M" |/
 * "week" | "weeks" | "w" | "day" | "days" } type The range type. eg: 'days', 'hours' etc
 */
declare type timeRange = "year" | "years" | "y" | "month" | "months" | "M" | "week" | "weeks" | "w" | "day" | "days";
declare function getRange(start: Moment, end: Moment, type: timeRange): moment.Moment[];
/**
 * Array split into groups of specific length
 * @param {[moment]} list The list of date
 * @param {number} howMany The end date
 */
declare function arrayTo2DArray2(list: Object[], howMany: number): never[][];
/**
 * @param {number} year The year
 * @param {number} month The month
 */
declare type weekStartCopy = weekStart;
declare function getMonthWeeks(year: number, month: number, weekStart: weekStartCopy): moment.Moment[];
declare function weekdaysMin(weekStart: weekStart, shortenWeekDays?: boolean): string[];
declare class DateCompare {
    static isSame(date1: Moment | null | undefined, date2: Moment | null | undefined): boolean;
    static isInMonth(targetDate: Moment, month: Number): boolean;
    static minMaxDate(targetDate: Moment, start?: Moment, end?: Moment): boolean;
    static maybeEnd(targetDate: Moment, start?: Moment, end?: Moment, hoveredDate?: Moment): boolean;
    static isBetweenMaybeEnd(targetDate: Moment, start?: Moment, end?: Moment, maybeEnd?: Moment): boolean | undefined;
    static isInRange(targetDate: Moment, start?: Moment, end?: Moment, hoveredDate?: Moment): boolean | undefined;
}
export { getMonthDateRange, getCalendarDateRange, getRange, arrayTo2DArray2, getMonthWeeks, weekdaysMin, DateCompare };
