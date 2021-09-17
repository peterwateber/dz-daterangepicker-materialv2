/// <reference types="react" />
import { Year } from "../typings";
interface YearProps {
    onClickYear: any;
    rows: Year[][];
}
declare function Year(props: YearProps): JSX.Element;
export default Year;
