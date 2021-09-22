import React from 'react';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

function getMonthDateRange(year, month) {
  const startDate = moment([year, month]);
  const endDate = moment(startDate).endOf("month");
  return {
    start: startDate,
    end: endDate
  };
}

function getCalendarDateRange(start, end, weekStart) {
  const weekStartNum = start.day() || 7;
  const weekEndNum = end.day() || 7;
  let subtractDays = weekStartNum;

  if (weekStart === "monday") {
    subtractDays = weekStartNum - 1;
  } else if (weekStart === "saturday") {
    subtractDays = weekStartNum + 1;
  }

  const startCalendar = start.subtract(subtractDays, "d");
  const endCalendar = end.add(7 - weekEndNum, "d");
  return {
    startCalendar: startCalendar,
    endCalendar: endCalendar
  };
}

function getRange(start, end, type) {
  const diff = end.diff(start, type, true);
  const range = [];

  for (let i = 0; i < diff; i++) {
    range.push(moment(start).add(i, type));
  }

  return range;
}

function arrayTo2DArray2(list, howMany) {
  let idx = 0;
  const result = [];

  while (idx < list.length) {
    if (idx % howMany === 0) result.push([]);
    result[result.length - 1].push(list[idx++]);
  }

  return result;
}

function getMonthWeeks(year, month, weekStart) {
  const {
    start,
    end
  } = getMonthDateRange(year, month);
  const {
    startCalendar,
    endCalendar
  } = getCalendarDateRange(start, end, weekStart);
  return getRange(startCalendar, endCalendar, "day");
}

function weekdaysMin(weekStart, shortenWeekDays = false) {
  const weekDays = !shortenWeekDays ? moment.weekdays(false) : moment.weekdaysShort(false);

  if (weekStart === "monday") {
    const day = weekDays.shift();

    if (day) {
      weekDays.push(day);
    }
  } else if (weekStart === "saturday") {
    const day = weekDays.pop();

    if (day) {
      weekDays.unshift();
    }
  }

  return weekDays;
}

class DateCompare {
  static isSame(date1, date2) {
    if (date1 && date2) return date1.isSame(date2, "day");
    return false;
  }

  static isInMonth(targetDate, month) {
    return targetDate.month() === month;
  }

  static minMaxDate(targetDate, start, end) {
    if (start && end) {
      return targetDate.isBetween(start, end);
    } else if (start) {
      return targetDate.isAfter(start);
    } else if (end) {
      return targetDate.isBefore(end);
    }

    return true;
  }

  static maybeEnd(targetDate, start, end, hoveredDate) {
    if (!start || start && end) return false;
    return this.isSame(targetDate, hoveredDate) && !start.isAfter(hoveredDate, "day");
  }

  static isBetweenMaybeEnd(targetDate, start, end, maybeEnd) {
    const isSameOrBeforeEnd = targetDate.isSameOrBefore(maybeEnd, "day");
    const isSameOrAfterStart = targetDate.isSameOrAfter(start, "day");
    return start && !end && isSameOrAfterStart && isSameOrBeforeEnd;
  }

  static isInRange(targetDate, start, end, hoveredDate) {
    if (start && end) {
      return targetDate.isBetween(start, end, "day");
    }

    return this.isBetweenMaybeEnd(targetDate, start, end, hoveredDate);
  }

}

function Header(props) {
  const btnIcon = () => props.open ? React.createElement(ArrowDropUpIcon, null) : React.createElement(ArrowDropDownIcon, null);

  return React.createElement("div", {
    className: "dz-calendar-header"
  }, React.createElement("div", {
    className: "header__content"
  }, React.createElement(IconButton, {
    className: "header__content__previous-button",
    size: "small",
    onClick: props.goToPrevious
  }, React.createElement(ArrowBackIosIcon, {
    fontSize: "inherit"
  })), React.createElement(Button, {
    onClick: props.changeView,
    endIcon: btnIcon()
  }, React.createElement("span", {
    className: "header__content__calendar-text"
  }, props.btnText)), React.createElement(IconButton, {
    className: "header__content__next-button",
    size: "small",
    onClick: props.goToNext
  }, React.createElement(ArrowForwardIosIcon, {
    fontSize: "inherit"
  }))));
}

Header.defaultProps = {
  open: false
};

function TableHeader(props) {
  return React.createElement("thead", {
    className: "cdz-calendar__table__header"
  }, React.createElement("tr", null, props.weekDays && props.weekDays.map((day, index) => React.createElement("th", {
    key: index
  }, day))), React.createElement("tr", null, React.createElement("th", {
    "aria-hidden": "true",
    className: "dz-calendar__table__header__divider",
    colSpan: 7
  })));
}

function Content(props) {
  return React.createElement("div", {
    className: "dz-calendar-content"
  }, React.createElement("table", {
    className: "dz-calendar__table"
  }, props.children));
}

function Year(props) {
  const cellClassName = year => {
    const mainClass = "dz-calendar__table__body__cell";
    const className = [mainClass];

    if (year.isCurrentYear) {
      className.push(`${mainClass}--today`);
    }

    if (year.selected) {
      className.push(`${mainClass}--active`);
    }

    return className.join(" ");
  };

  const tabIndex = year => {
    return year.isCurrentYear ? 1 : 0;
  };

  return React.createElement("tbody", {
    className: "dz-calendar__table__body"
  }, props.rows.map((week, index) => React.createElement("tr", {
    key: index,
    className: "dz-calendar-table-body-week"
  }, week.map((year, index) => React.createElement("td", {
    className: cellClassName(year),
    onMouseUp: e => props.onClickYear(e, year.year),
    key: index,
    tabIndex: tabIndex(year)
  }, React.createElement("div", {
    className: "dz-calendar__table__body__cell__content year-content"
  }, year.year))))));
}

function Month(props) {
  const cellClassName = month => {
    const mainClass = "dz-calendar__table__body__cell";
    const className = [mainClass];

    if (month.isCurrentMonth) {
      className.push(`${mainClass}--today`);
    }

    if (month.selected) {
      className.push(`${mainClass}--active`);
    }

    return className.join(" ");
  };

  const tabIndex = month => {
    return month.isCurrentMonth ? 1 : 0;
  };

  return React.createElement("tbody", {
    className: "dz-calendar__table__body"
  }, props.rows.map((month, index) => React.createElement("tr", {
    key: index,
    className: "dz-calendar-table-body-month"
  }, month.map((month, index) => React.createElement("td", {
    className: cellClassName(month),
    onMouseUp: e => props.onClickMonth(e, month.monthNum),
    key: index,
    tabIndex: tabIndex(month)
  }, React.createElement("div", {
    className: "dz-calendar__table__body__cell__content month-content"
  }, month.monthName))))));
}

const Day = props => {
  const cellClassName = day => {
    const mainClass = "dz-calendar__table__body__cell";
    const className = [mainClass];

    if (day.isInRange && !(day.isStart || day.isEnd)) {
      className.push(`${mainClass}--semi-selected`);
    }

    if (day.isStart) {
      className.push(`${mainClass}--begin-range`);
    }

    if (day.isEnd || day.maybeEnd) {
      className.push(`${mainClass}--end-range`);
    }

    if (!day.isInMonth || day.isDisabled) {
      if (props.showOnlyDaysInMonths) {
        className.push(`${mainClass}--hidden`);
      }

      className.push(`${mainClass}--disabled`);
      return className.join(" ");
    }

    if (props.disableFuture && day.date.isAfter(new Date())) {
      className.push(`${mainClass}--disabled`);
      return className.join(" ");
    }

    if (day.isHovered) {
      className.push(`${mainClass}--hover`);
    }

    if (day.isCurrentDate) {
      className.push(`${mainClass}--today`);
    }

    if (day.maybeEnd) {
      className.push(`${mainClass}--maybe-end`);
    }

    return className.join(" ");
  };

  const tabIndex = day => {
    return day.isCurrentDate ? 1 : 0;
  };

  const getDayProps = day => {
    if (props.disableFuture && day.date.isAfter(new Date())) return {};

    if (day.isInMonth && !day.isDisabled) {
      return {
        onMouseUp: () => props.onClickDay(day.date),
        onMouseOver: () => props.onDateMouseOver(day.date)
      };
    }

    return {};
  };

  return React.createElement("tbody", {
    className: "dz-calendar__table__body"
  }, props.weeks.map((week, index) => React.createElement("tr", {
    key: index,
    className: "dz-calendar-table-body-week"
  }, week.map((day, index) => React.createElement("td", Object.assign({
    key: index,
    className: cellClassName(day),
    tabIndex: tabIndex(day)
  }, getDayProps(day)), React.createElement("div", {
    className: "dz-calendar__table__body__cell__content"
  }, day.date.date()))))));
};

var Views;

(function (Views) {
  Views[Views["month"] = 0] = "month";
  Views[Views["day"] = 1] = "day";
  Views[Views["year"] = 2] = "year";
})(Views || (Views = {}));

class Daterangepicker extends React.Component {
  constructor(props) {
    super(props);
    moment.locale(props.locale || "en");
    const {
      startDate,
      endDate,
      minDate,
      maxDate
    } = props;
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
        start: startDate && moment(startDate),
        end: endDate && moment(endDate),
        min: minDate && moment(minDate),
        max: maxDate && moment(maxDate),
        hoveredDate: this.currentDate
      }
    };
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

  changeView(newView) {
    this.setState({
      activeView: newView
    });
  }

  setRangeDate(date) {
    const {
      day,
      datePicker
    } = this.state;
    const startState = {
      day: { ...day,
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
        day: { ...day,
          end: date
        }
      };
    } else if (day.start && day.end) {
      newState = { ...startState,
        day: { ...startState.day,
          end: undefined
        }
      };
    }

    return newState;
  }

  onDateMouseOver(date) {
    const {
      day
    } = this.state;
    const isSame = DateCompare.isSame(date, day.hoveredDate);
    if (isSame) return;
    if (this.props.disableFuture && date.isAfter(new Date())) return;
    this.setState({ ...this.state,
      day: { ...day,
        hoveredDate: date
      }
    });
  }

  getMonthWeeks(year, month) {
    const {
      day,
      currentDate
    } = this.state;
    let weeks = getMonthWeeks(year, month, this.state.startWeek);
    let weeksDays = weeks.map(date => ({
      date: date,
      isCurrentDate: DateCompare.isSame(date, currentDate),
      isInRange: DateCompare.isInRange(date, day.start, day.end, day.hoveredDate),
      isDisabled: !DateCompare.minMaxDate(date, day.min, day.max),
      isInMonth: DateCompare.isInMonth(date, month),
      isStart: DateCompare.isSame(date, day.start),
      isEnd: DateCompare.isSame(date, day.end),
      maybeEnd: DateCompare.maybeEnd(date, day.start, day.end, day.hoveredDate),
      isHovered: DateCompare.isSame(date, day.hoveredDate)
    }));
    return arrayTo2DArray2(weeksDays, 7);
  }

  getYears() {
    const {
      currentDate,
      date
    } = this.state;
    const {
      num,
      focused,
      page
    } = this.state.year;
    const currentYear = Boolean(this.props.maxYear) ? currentDate.set("year", this.props.maxYear || 0).year() : currentDate.year();
    const targetYear = date.year();
    let start = currentYear - 4;

    if (page > 0) {
      start = start + page * num;
    } else {
      start = start - -1 * page * num;
    }

    if (this.props.maxYear && this.props.minimumYear) {
      start = this.props.minimumYear;
    }

    const end = this.props.maxYear && this.props.minimumYear ? this.props.maxYear + 1 : start + num;
    let years = [];

    for (start; start < end; start++) {
      years.push(start);
    }

    years = years.map(year => ({
      year: year,
      selected: year === targetYear,
      isCurrentYear: year === currentYear,
      isYearBlocked: false,
      isFocused: year === focused
    }));
    return arrayTo2DArray2(years, 4);
  }

  getMonths() {
    const {
      currentDate,
      date
    } = this.state;
    const currentMonth = currentDate.month();
    const targetMonth = date.month();
    const {
      focused
    } = this.state.month;
    const months = moment.monthsShort().map((month, monthNum) => ({
      monthNum: monthNum,
      monthName: month,
      selected: monthNum === targetMonth,
      isCurrentMonth: monthNum === currentMonth,
      isMonthBlocked: false,
      isFocused: monthNum === focused
    }));
    return arrayTo2DArray2(months, 4);
  }

  setYear(_e, year) {
    const newDate = this.state.date.year(year);
    this.setState({
      date: newDate
    }, () => this.changeView(Views.month));
  }

  setMonth(_e, month) {
    const newDate = this.state.date.month(month);
    this.setState({
      date: newDate
    }, () => this.changeView(Views.day));
  }

  changeYearPage(nextPage = true) {
    const {
      year
    } = this.state;
    this.setState({
      year: { ...year,
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

  componentDidUpdate(prevProps) {
    if (this.props.startDate && this.props.endDate && (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate)) {
      this.setState({ ...this.state,
        date: this.props.setFocusOnEndDateMonth ? moment(this.props.endDate) : this.state.date,
        day: { ...this.state.day,
          start: this.props.startDate && moment(this.props.startDate),
          end: this.props.endDate && moment(this.props.endDate)
        }
      });
    }
  }

  dayView() {
    const {
      date,
      day
    } = this.state;
    const weeks = this.getMonthWeeks(date.year(), date.month());
    const weekDays = weekdaysMin(this.state.startWeek, this.props.shortenWeekDays);
    const monthFormat = this.props.calendarMonthFormat ? this.props.calendarMonthFormat : "MMMM";
    const calendarTextDisplay = `${date.format(monthFormat)} ${date.year()}`;

    const changeView = () => this.changeView(Views.year);

    return React.createElement(React.Fragment, null, React.createElement(Header, {
      goToPrevious: this.goToPreviousMonths,
      goToNext: this.goToNextMonths,
      changeView: changeView,
      btnText: calendarTextDisplay,
      open: false
    }), React.createElement(Content, null, React.createElement(TableHeader, {
      weekDays: weekDays
    }), React.createElement(Day, {
      onDateMouseOver: this.onDateMouseOver,
      onClickDay: day => {
        var _range$day, _range$day$start, _range$day2, _range$day2$end, _range$day3, _range$day3$start, _range$day4, _range$day4$end;

        const range = this.setRangeDate(day);
        this.setState(range);
        this.props.onChangeDetected && this.props.onChangeDetected({
          startDate: range === null || range === void 0 ? void 0 : (_range$day = range.day) === null || _range$day === void 0 ? void 0 : (_range$day$start = _range$day.start) === null || _range$day$start === void 0 ? void 0 : _range$day$start.toDate(),
          endDate: range === null || range === void 0 ? void 0 : (_range$day2 = range.day) === null || _range$day2 === void 0 ? void 0 : (_range$day2$end = _range$day2.end) === null || _range$day2$end === void 0 ? void 0 : _range$day2$end.toDate()
        });

        if ((range === null || range === void 0 ? void 0 : (_range$day3 = range.day) === null || _range$day3 === void 0 ? void 0 : (_range$day3$start = _range$day3.start) === null || _range$day3$start === void 0 ? void 0 : _range$day3$start.toDate()) && (range === null || range === void 0 ? void 0 : (_range$day4 = range.day) === null || _range$day4 === void 0 ? void 0 : (_range$day4$end = _range$day4.end) === null || _range$day4$end === void 0 ? void 0 : _range$day4$end.toDate())) {
          var _range$day5, _range$day6;

          this.props.onChange(range === null || range === void 0 ? void 0 : (_range$day5 = range.day) === null || _range$day5 === void 0 ? void 0 : _range$day5.start, range === null || range === void 0 ? void 0 : (_range$day6 = range.day) === null || _range$day6 === void 0 ? void 0 : _range$day6.end);
        }
      },
      weeks: weeks,
      start: day.start,
      end: day.end,
      showOnlyDaysInMonths: this.props.showOnlyDaysInMonths,
      disableFuture: this.props.disableFuture
    })));
  }

  yearView() {
    const {
      date
    } = this.state;
    const btnText = `${date.format("YYYY")}`;
    const rows = this.getYears();

    const changeView = () => this.changeView(Views.day);

    const nextPage = () => this.changeYearPage(true);

    const previousPage = () => this.changeYearPage(false);

    return React.createElement(React.Fragment, null, React.createElement(Header, {
      goToPrevious: previousPage,
      goToNext: nextPage,
      changeView: changeView,
      btnText: btnText,
      open: true
    }), React.createElement(Content, null, React.createElement(TableHeader, null), React.createElement(Year, {
      onClickYear: this.setYear,
      rows: rows
    })));
  }

  monthView() {
    const {
      date
    } = this.state;
    const months = this.getMonths();
    return React.createElement(React.Fragment, null, React.createElement(Header, {
      goToPrevious: this.goToPreviousYear,
      goToNext: this.goToNextYear,
      changeView: this.changeView,
      btnText: `${date.format("YYYY")}`,
      open: true
    }), React.createElement(Content, null, React.createElement(TableHeader, null), React.createElement(Month, {
      onClickMonth: this.setMonth,
      rows: months
    })));
  }

  render() {
    const {
      activeView
    } = this.state;
    let view = this.dayView();

    if (activeView === Views.year) {
      view = this.yearView();
    } else if (activeView === Views.month) {
      view = this.monthView();
    }

    return React.createElement("div", Object.assign({
      className: "dz-calendar"
    }, this.props.wrapperProps), view);
  }

}

export default Daterangepicker;
//# sourceMappingURL=index.modern.js.map
