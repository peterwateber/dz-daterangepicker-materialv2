import React from "react";
import moment, { Moment } from "moment";
import { arrayTo2DArray2, getMonthWeeks, weekdaysMin, DateCompare } from "./utils";
import Header from "./header/Header";
import TableHeader from "./header/TableHeader";
import Content from "./Content";
import Year from "./calendar/Year";
import Month from "./calendar/Month";
import Day from "./calendar/Day";
import { DaterangepickerProps, DaterangepickerState, Views } from "./typings";

import "./style/main.css";

class Daterangepicker extends React.Component<DaterangepickerProps, DaterangepickerState> {
  private readonly currentDate: moment.Moment;

  constructor(props: DaterangepickerProps) {
    super(props);
    moment.locale(props.locale || "en");

    const { startDate, endDate, minDate, maxDate } = props;

    this.currentDate = moment().startOf("day");
    const date = moment(endDate || this.currentDate);

    this.state = {
      datePicker: props.datePicker || false,
      currentDate: this.currentDate,
      date: date,
      activeView: Views.day,
      startWeek: props.startWeek || "monday",
      year: {
        min: 1990,
        max: 2023,
        num: 24,
        page: 0,
        focused: date.year()
      },
      month: {
        min: 0,
        max: 11,
        focused: date.month()
      },
      day: {
        start: startDate && moment(startDate) ,
        end: endDate && moment(endDate),
        min: minDate && moment(minDate),
        max: maxDate && moment(maxDate),
        hoveredDate: this.currentDate,
      }
    }

    this.goToPreviousMonths = this.goToPreviousMonths.bind(this);
    this.goToNextMonths = this.goToNextMonths.bind(this);
    this.goToPreviousYear = this.goToPreviousYear.bind(this);
    this.goToNextYear = this.goToNextYear.bind(this);
    this.setRangeDate = this.setRangeDate.bind(this);
    this.onDateMouseOver = this.onDateMouseOver.bind(this);
    this.changeView = this.changeView.bind(this);
    this.setYear = this.setYear.bind(this);
    this.setMonth = this.setMonth.bind(this);
  }

  changeView(newView: Views) {
    this.setState({
      activeView: newView
    });
  }

  setRangeDate(date: Moment) {
    const { day, datePicker } = this.state;
    const startState = {
      day: {
        ...day,
        start: date
      }
    };

    let newState = {};

    if (datePicker) {
      this.setState({
        day: {
          start: date,
          end: date
        }
      });
    } else if (day.start === undefined && day.end === undefined) {
      newState = startState;
    } else if (day.start && day.end === undefined && date.isBefore(day.start)) {
      newState = startState;
    } else if (day.start && day.end === undefined) {
      newState = {
        day: {
          ...day,
          end: date
        },
      };
    } else if (day.start && day.end) {
      newState = {
        ...startState,
        day: {
          ...startState.day,
          end: undefined
        }
      };
    }
    return newState;
  }

  onDateMouseOver(date: Moment) {
    const { day } = this.state;

    const isSame = DateCompare.isSame(date, day.hoveredDate);
    if (isSame) return;

    if (this.props.disableFuture && date.isAfter(new Date())) return;

    this.setState({
      ...this.state,
      day: {
        ...day,
        hoveredDate: date,
      }
    });
  }

  getMonthWeeks(year: number, month: number) {
    const {
      day,
      currentDate,
    } = this.state;

    let weeks = getMonthWeeks(year, month, this.state.startWeek);

    let weeksDays = weeks.map((date:Moment) => ({
      date: date,
      isCurrentDate: DateCompare.isSame(date, currentDate),
      isInRange: DateCompare.isInRange(
        date,
        day.start,
        day.end,
        day.hoveredDate
      ),
      isDisabled: !DateCompare.minMaxDate(date, day.min, day.max),
      isInMonth: DateCompare.isInMonth(date, month),
      isStart: DateCompare.isSame(date, day.start),
      isEnd: DateCompare.isSame(date, day.end),
      maybeEnd: DateCompare.maybeEnd(
        date,
        day.start,
        day.end,
        day.hoveredDate
      ),
      isHovered: DateCompare.isSame(date, day.hoveredDate),
    }));

    return arrayTo2DArray2(weeksDays, 7);
  }

  getYears() {
    const { currentDate, date } = this.state;
    const { num, focused, page } = this.state.year;
    const currentYear = Boolean(this.props.maxYear) ? currentDate.set("year", this.props.maxYear || 0).year() :  currentDate.year();
    const targetYear = date.year();

    let start = currentYear - 4;

    if (page > 0) {
      start = start + page * num;
    } else {
      start = start - -1 * page * num;
    }

    if (this.props.maxYear && this.props.minimumYear) {
      start = this.props.minimumYear
    }

    const end = (this.props.maxYear && this.props.minimumYear) ? this.props.maxYear + 1: start + num;


    let years = [];
    for (start; start < end; start++) {
      years.push(start);
    }

    years = years.map((year) => ({
      year: year,
      selected: year === targetYear,
      isCurrentYear: year === currentYear,
      isYearBlocked: false,
      isFocused: year === focused
    }));
    
    return arrayTo2DArray2(years, 4);
  }

  getMonths() {
    const { currentDate, date } = this.state;
    const currentMonth = currentDate.month();
    const targetMonth = date.month();
    const { focused } = this.state.month;

    const months = moment.monthsShort().map((month:string, monthNum:number) => ({
      monthNum: monthNum,
      monthName: month,
      selected: monthNum === targetMonth,
      isCurrentMonth: monthNum === currentMonth,
      isMonthBlocked: false,
      isFocused: monthNum === focused
    }));

    return arrayTo2DArray2(months, 4);
  }

  setYear(_e:any, year:number) {
    const newDate = this.state.date.year(year);
    this.setState(
      {
        date: newDate
      },
      () => this.changeView(Views.month)
    );
  }

  setMonth(_e:any, month:number) {
    const newDate = this.state.date.month(month);

    this.setState(
      {
        date: newDate
      },
      () => this.changeView(Views.day)
    );
  }

  changeYearPage(nextPage:boolean=true) {
    const { year } = this.state;

    this.setState({
      year: {
        ...year,
        page: nextPage ? year.page + 1 : year.page - 1
      }
    });
  }

  goToPreviousMonths() {
    this.setState({
      date: this.state.date.subtract(1, "M")
    });
  }

  goToNextMonths() {
    this.setState({
      date: this.state.date.add(1, "M")
    });
  }

  goToPreviousYear() {
    this.setState({
      date: this.state.date.subtract(1, "y")
    });
  }

  goToNextYear() {
    this.setState({
      date: this.state.date.add(1, "y")
    });
  }

  componentDidUpdate(prevProps: DaterangepickerProps) {
    if (this.props.startDate && this.props.endDate &&
      (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate)) {
        this.setState({
          ...this.state,
          date: this.props.setFocusOnEndDateMonth ? moment(this.props.endDate) : this.state.date,
          day: {
            ...this.state.day,
            start: this.props.startDate && moment(this.props.startDate),
            end: this.props.endDate && moment(this.props.endDate)
          },
        })
    }
  }

  dayView() {
    const { date, day } = this.state;
    
    const weeks = this.getMonthWeeks(date.year(), date.month());
    const weekDays = weekdaysMin(this.state.startWeek, this.props.shortenWeekDays);
    const monthFormat = this.props.calendarMonthFormat ? this.props.calendarMonthFormat : "MMMM";
    const calendarTextDisplay = `${date.format(monthFormat)} ${date.year()}`;

    const changeView = () => this.changeView(Views.year);

    return (
      <React.Fragment>
        <Header
          goToPrevious={this.goToPreviousMonths}
          goToNext={this.goToNextMonths}
          changeView={changeView}
          btnText={calendarTextDisplay}
          open={false}
        />
        <Content>
          <TableHeader weekDays={weekDays} />
          <Day
            onDateMouseOver={this.onDateMouseOver}
            onClickDay={(day: Moment) => {
              const range: any = this.setRangeDate(day);
              this.setState(range);
              this.props.onChangeDetected && this.props.onChangeDetected({
                startDate: range?.day?.start?.toDate(),
                endDate: range?.day?.end?.toDate()
              })
              if (range?.day?.start?.toDate() && range?.day?.end?.toDate()) {
                this.props.onChange(range?.day?.start, range?.day?.end);
              }
            }}
            weeks={weeks}
            start={day.start}
            end={day.end}
            showOnlyDaysInMonths={this.props.showOnlyDaysInMonths}
            disableFuture={this.props.disableFuture}
          />
        </Content>
      </React.Fragment>
    );
  }

  yearView() {
    const { date } = this.state;
    const btnText = `${date.format("YYYY")}`;
    const rows = this.getYears();

    const changeView = () => this.changeView(Views.day);

    const nextPage = () => this.changeYearPage(true);
    const previousPage = () => this.changeYearPage(false);

    return (
      <React.Fragment>
        <Header
          goToPrevious={previousPage}
          goToNext={nextPage}
          changeView={changeView}
          btnText={btnText}
          open
        />
        <Content>
          <TableHeader/>
          <Year onClickYear={this.setYear} rows={rows} />
        </Content>
      </React.Fragment>
    );
  }

  monthView() {
    const { date } = this.state;
    const months = this.getMonths();

    return (
      <React.Fragment>
        <Header
          goToPrevious={this.goToPreviousYear}
          goToNext={this.goToNextYear}
          changeView={this.changeView}
          btnText={`${date.format("YYYY")}`}
          open
        />
        <Content>
          <TableHeader />
          <Month onClickMonth={this.setMonth} rows={months} />
        </Content>
      </React.Fragment>
    );
  }

  render() {
    const {activeView} = this.state;
    let view = this.dayView();

    if (activeView === Views.year) {
      view = this.yearView();
    } else if (activeView === Views.month) {
      view = this.monthView();
    }

    return (
        <div className="dz-calendar" {...this.props.wrapperProps}>
          {view}
        </div>
    )

  }
}

export default Daterangepicker;
