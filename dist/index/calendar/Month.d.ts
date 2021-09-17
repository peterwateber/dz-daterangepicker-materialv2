/// <reference types="react" />
import { Month } from "../typings";
interface MonthProps {
    onClickMonth: any;
    rows: Month[][];
}
declare function Month(props: MonthProps): JSX.Element;
export default Month;
