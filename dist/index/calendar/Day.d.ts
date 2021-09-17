/// <reference types="react" />
import { Moment } from "moment";
import { Day } from "../typings";
interface DayProps {
    onDateMouseOver: any;
    onClickDay: any;
    weeks: Day[][];
    start?: Moment;
    end?: Moment;
    disableFuture?: boolean;
}
declare const Day: (props: DayProps) => JSX.Element;
export default Day;
