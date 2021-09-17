/// <reference types="react" />
interface HeaderProps {
    goToPrevious: any;
    goToNext: any;
    changeView: any;
    btnText: string;
    open: boolean;
}
declare function Header(props: HeaderProps): JSX.Element;
declare namespace Header {
    var defaultProps: {
        open: boolean;
    };
}
export default Header;
