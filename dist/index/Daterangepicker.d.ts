import React from "react";
import { Moment } from "moment";
import { DaterangepickerProps, DaterangepickerState, Views } from "./typings";
import "./style/main.css";
declare class Daterangepicker extends React.Component<DaterangepickerProps, DaterangepickerState> {
    private readonly currentDate;
    constructor(props: DaterangepickerProps);
    changeView(newView: Views): void;
    setRangeDate(date: Moment): void;
    onDateMouseOver(date: Moment): void;
    getMonthWeeks(year: number, month: number): never[][];
    getYears(): never[][];
    getMonths(): never[][];
    setYear(_e: any, year: number): void;
    setMonth(_e: any, month: number): void;
    changeYearPage(nextPage?: boolean): void;
    goToPreviousMonths(): void;
    goToNextMonths(): void;
    goToPreviousYear(): void;
    goToNextYear(): void;
    componentDidUpdate(_prevProps: any, prevState: any): void;
    dayView(): JSX.Element;
    yearView(): JSX.Element;
    monthView(): JSX.Element;
    render(): JSX.Element;
}
export default Daterangepicker;
