import React from 'react';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function getMonthDateRange(year, month) {
  var startDate = moment([year, month]);
  var endDate = moment(startDate).endOf("month");
  return {
    start: startDate,
    end: endDate
  };
}

function getCalendarDateRange(start, end, weekStart) {
  var weekStartNum = start.day() || 7;
  var weekEndNum = end.day() || 7;
  var subtractDays = weekStartNum;

  if (weekStart === "monday") {
    subtractDays = weekStartNum - 1;
  } else if (weekStart === "saturday") {
    subtractDays = weekStartNum + 1;
  }

  var startCalendar = start.subtract(subtractDays, "d");
  var endCalendar = end.add(7 - weekEndNum, "d");
  return {
    startCalendar: startCalendar,
    endCalendar: endCalendar
  };
}

function getRange(start, end, type) {
  var diff = end.diff(start, type, true);
  var range = [];

  for (var i = 0; i < diff; i++) {
    range.push(moment(start).add(i, type));
  }

  return range;
}

function arrayTo2DArray2(list, howMany) {
  var idx = 0;
  var result = [];

  while (idx < list.length) {
    if (idx % howMany === 0) result.push([]);
    result[result.length - 1].push(list[idx++]);
  }

  return result;
}

function getMonthWeeks(year, month, weekStart) {
  var _getMonthDateRange = getMonthDateRange(year, month),
      start = _getMonthDateRange.start,
      end = _getMonthDateRange.end;

  var _getCalendarDateRange = getCalendarDateRange(start, end, weekStart),
      startCalendar = _getCalendarDateRange.startCalendar,
      endCalendar = _getCalendarDateRange.endCalendar;

  return getRange(startCalendar, endCalendar, "day");
}

function weekdaysMin(weekStart, shortenWeekDays) {
  if (shortenWeekDays === void 0) {
    shortenWeekDays = false;
  }

  var weekDays = !shortenWeekDays ? moment.weekdays(false) : moment.weekdaysShort(false);

  if (weekStart === "monday") {
    var day = weekDays.shift();

    if (day) {
      weekDays.push(day);
    }
  } else if (weekStart === "saturday") {
    var _day = weekDays.pop();

    if (_day) {
      weekDays.unshift();
    }
  }

  return weekDays;
}

var DateCompare = /*#__PURE__*/function () {
  function DateCompare() {}

  DateCompare.isSame = function isSame(date1, date2) {
    if (date1 && date2) return date1.isSame(date2, "day");
    return false;
  };

  DateCompare.isInMonth = function isInMonth(targetDate, month) {
    return targetDate.month() === month;
  };

  DateCompare.minMaxDate = function minMaxDate(targetDate, start, end) {
    if (start && end) {
      return targetDate.isBetween(start, end);
    } else if (start) {
      return targetDate.isAfter(start);
    } else if (end) {
      return targetDate.isBefore(end);
    }

    return true;
  };

  DateCompare.maybeEnd = function maybeEnd(targetDate, start, end, hoveredDate) {
    if (!start || start && end) return false;
    return this.isSame(targetDate, hoveredDate) && !start.isAfter(hoveredDate, "day");
  };

  DateCompare.isBetweenMaybeEnd = function isBetweenMaybeEnd(targetDate, start, end, maybeEnd) {
    var isSameOrBeforeEnd = targetDate.isSameOrBefore(maybeEnd, "day");
    var isSameOrAfterStart = targetDate.isSameOrAfter(start, "day");
    return start && !end && isSameOrAfterStart && isSameOrBeforeEnd;
  };

  DateCompare.isInRange = function isInRange(targetDate, start, end, hoveredDate) {
    if (start && end) {
      return targetDate.isBetween(start, end, "day");
    }

    return this.isBetweenMaybeEnd(targetDate, start, end, hoveredDate);
  };

  return DateCompare;
}();

function Header(props) {
  var btnIcon = function btnIcon() {
    return props.open ? React.createElement(ArrowDropUpIcon, null) : React.createElement(ArrowDropDownIcon, null);
  };

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
  }, React.createElement("tr", null, props.weekDays && props.weekDays.map(function (day, index) {
    return React.createElement("th", {
      key: index
    }, day);
  })), React.createElement("tr", null, React.createElement("th", {
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
  var cellClassName = function cellClassName(year) {
    var mainClass = "dz-calendar__table__body__cell";
    var className = [mainClass];

    if (year.isCurrentYear) {
      className.push(mainClass + "--today");
    }

    if (year.selected) {
      className.push(mainClass + "--active");
    }

    return className.join(" ");
  };

  var tabIndex = function tabIndex(year) {
    return year.isCurrentYear ? 1 : 0;
  };

  return React.createElement("tbody", {
    className: "dz-calendar__table__body"
  }, props.rows.map(function (week, index) {
    return React.createElement("tr", {
      key: index,
      className: "dz-calendar-table-body-week"
    }, week.map(function (year, index) {
      return React.createElement("td", {
        className: cellClassName(year),
        onMouseUp: function onMouseUp(e) {
          return props.onClickYear(e, year.year);
        },
        key: index,
        tabIndex: tabIndex(year)
      }, React.createElement("div", {
        className: "dz-calendar__table__body__cell__content year-content"
      }, year.year));
    }));
  }));
}

function Month(props) {
  var cellClassName = function cellClassName(month) {
    var mainClass = "dz-calendar__table__body__cell";
    var className = [mainClass];

    if (month.isCurrentMonth) {
      className.push(mainClass + "--today");
    }

    if (month.selected) {
      className.push(mainClass + "--active");
    }

    return className.join(" ");
  };

  var tabIndex = function tabIndex(month) {
    return month.isCurrentMonth ? 1 : 0;
  };

  return React.createElement("tbody", {
    className: "dz-calendar__table__body"
  }, props.rows.map(function (month, index) {
    return React.createElement("tr", {
      key: index,
      className: "dz-calendar-table-body-month"
    }, month.map(function (month, index) {
      return React.createElement("td", {
        className: cellClassName(month),
        onMouseUp: function onMouseUp(e) {
          return props.onClickMonth(e, month.monthNum);
        },
        key: index,
        tabIndex: tabIndex(month)
      }, React.createElement("div", {
        className: "dz-calendar__table__body__cell__content month-content"
      }, month.monthName));
    }));
  }));
}

var Day = function Day(props) {
  var cellClassName = function cellClassName(day) {
    var mainClass = "dz-calendar__table__body__cell";
    var className = [mainClass];

    if (day.isInRange && !(day.isStart || day.isEnd)) {
      className.push(mainClass + "--semi-selected");
    }

    if (day.isStart) {
      className.push(mainClass + "--begin-range");
    }

    if (day.isEnd || day.maybeEnd) {
      className.push(mainClass + "--end-range");
    }

    if (!day.isInMonth || day.isDisabled) {
      className.push(mainClass + "--disabled");
      return className.join(" ");
    }

    if (props.disableFuture && day.date.isAfter(new Date())) {
      className.push(mainClass + "--disabled");
      return className.join(" ");
    }

    if (day.isHovered) {
      className.push(mainClass + "--hover");
    }

    if (day.isCurrentDate) {
      className.push(mainClass + "--today");
    }

    if (day.maybeEnd) {
      className.push(mainClass + "--maybe-end");
    }

    return className.join(" ");
  };

  var tabIndex = function tabIndex(day) {
    return day.isCurrentDate ? 1 : 0;
  };

  var getDayProps = function getDayProps(day) {
    if (props.disableFuture && day.date.isAfter(new Date())) return {};

    if (day.isInMonth && !day.isDisabled) {
      return {
        onMouseUp: function onMouseUp() {
          return props.onClickDay(day.date);
        },
        onMouseOver: function onMouseOver() {
          return props.onDateMouseOver(day.date);
        }
      };
    }

    return {};
  };

  return React.createElement("tbody", {
    className: "dz-calendar__table__body"
  }, props.weeks.map(function (week, index) {
    return React.createElement("tr", {
      key: index,
      className: "dz-calendar-table-body-week"
    }, week.map(function (day, index) {
      return React.createElement("td", Object.assign({
        key: index,
        className: cellClassName(day),
        tabIndex: tabIndex(day)
      }, getDayProps(day)), React.createElement("div", {
        className: "dz-calendar__table__body__cell__content"
      }, day.date.date()));
    }));
  }));
};

var Views;

(function (Views) {
  Views[Views["month"] = 0] = "month";
  Views[Views["day"] = 1] = "day";
  Views[Views["year"] = 2] = "year";
})(Views || (Views = {}));

var Daterangepicker = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Daterangepicker, _React$Component);

  function Daterangepicker(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    moment.locale(props.locale || "en");
    var startDate = props.startDate,
        endDate = props.endDate,
        minDate = props.minDate,
        maxDate = props.maxDate;
    _this.currentDate = moment().startOf("day");
    var date = moment(endDate || _this.currentDate);
    _this.state = {
      datePicker: props.datePicker || false,
      currentDate: _this.currentDate,
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
        hoveredDate: _this.currentDate
      }
    };
    _this.goToPreviousMonths = _this.goToPreviousMonths.bind(_assertThisInitialized(_this));
    _this.goToNextMonths = _this.goToNextMonths.bind(_assertThisInitialized(_this));
    _this.goToPreviousYear = _this.goToPreviousYear.bind(_assertThisInitialized(_this));
    _this.goToNextYear = _this.goToNextYear.bind(_assertThisInitialized(_this));
    _this.setRangeDate = _this.setRangeDate.bind(_assertThisInitialized(_this));
    _this.onDateMouseOver = _this.onDateMouseOver.bind(_assertThisInitialized(_this));
    _this.changeView = _this.changeView.bind(_assertThisInitialized(_this));
    _this.setYear = _this.setYear.bind(_assertThisInitialized(_this));
    _this.setMonth = _this.setMonth.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Daterangepicker.prototype;

  _proto.changeView = function changeView(newView) {
    this.setState({
      activeView: newView
    });
  };

  _proto.setRangeDate = function setRangeDate(date) {
    var _this$state = this.state,
        day = _this$state.day,
        datePicker = _this$state.datePicker;
    var startState = {
      day: _extends({}, day, {
        start: date
      })
    };

    if (datePicker) {
      this.setState({
        day: {
          start: date,
          end: date
        }
      });
    } else if (day.start === undefined && day.end === undefined) {
      this.setState(startState);
    } else if (day.start && day.end === undefined && date.isBefore(day.start)) {
      this.setState(startState);
    } else if (day.start && day.end === undefined) {
      this.setState({
        day: _extends({}, day, {
          end: date
        })
      });
    } else if (day.start && day.end) {
      this.setState(_extends({}, startState, {
        day: _extends({}, startState.day, {
          end: undefined
        })
      }));
    }
  };

  _proto.onDateMouseOver = function onDateMouseOver(date) {
    var day = this.state.day;
    var isSame = DateCompare.isSame(date, day.hoveredDate);
    if (isSame) return;
    if (this.props.disableFuture && date.isAfter(new Date())) return;
    this.setState(_extends({}, this.state, {
      day: _extends({}, day, {
        hoveredDate: date
      })
    }));
  };

  _proto.getMonthWeeks = function getMonthWeeks$1(year, month) {
    var _this$state2 = this.state,
        day = _this$state2.day,
        currentDate = _this$state2.currentDate;

    var weeks = getMonthWeeks(year, month, this.state.startWeek);

    var weeksDays = weeks.map(function (date) {
      return {
        date: date,
        isCurrentDate: DateCompare.isSame(date, currentDate),
        isInRange: DateCompare.isInRange(date, day.start, day.end, day.hoveredDate),
        isDisabled: !DateCompare.minMaxDate(date, day.min, day.max),
        isInMonth: DateCompare.isInMonth(date, month),
        isStart: DateCompare.isSame(date, day.start),
        isEnd: DateCompare.isSame(date, day.end),
        maybeEnd: DateCompare.maybeEnd(date, day.start, day.end, day.hoveredDate),
        isHovered: DateCompare.isSame(date, day.hoveredDate)
      };
    });
    return arrayTo2DArray2(weeksDays, 7);
  };

  _proto.getYears = function getYears() {
    var _this$state3 = this.state,
        currentDate = _this$state3.currentDate,
        date = _this$state3.date;
    var _this$state$year = this.state.year,
        num = _this$state$year.num,
        focused = _this$state$year.focused,
        page = _this$state$year.page;
    var currentYear = currentDate.year();
    var targetYear = date.year();
    var start = currentYear - 4;

    if (page > 0) {
      start = start + page * num;
    } else {
      start = start - -1 * page * num;
    }

    var end = start + num;
    var years = [];

    for (start; start < end; start++) {
      years.push(start);
    }

    years = years.map(function (year) {
      return {
        year: year,
        selected: year === targetYear,
        isCurrentYear: year === currentYear,
        isYearBlocked: false,
        isFocused: year === focused
      };
    });
    return arrayTo2DArray2(years, 4);
  };

  _proto.getMonths = function getMonths() {
    var _this$state4 = this.state,
        currentDate = _this$state4.currentDate,
        date = _this$state4.date;
    var currentMonth = currentDate.month();
    var targetMonth = date.month();
    var focused = this.state.month.focused;
    var months = moment.monthsShort().map(function (month, monthNum) {
      return {
        monthNum: monthNum,
        monthName: month,
        selected: monthNum === targetMonth,
        isCurrentMonth: monthNum === currentMonth,
        isMonthBlocked: false,
        isFocused: monthNum === focused
      };
    });
    return arrayTo2DArray2(months, 4);
  };

  _proto.setYear = function setYear(_e, year) {
    var _this2 = this;

    var newDate = this.state.date.year(year);
    this.setState({
      date: newDate
    }, function () {
      return _this2.changeView(Views.month);
    });
  };

  _proto.setMonth = function setMonth(_e, month) {
    var _this3 = this;

    var newDate = this.state.date.month(month);
    this.setState({
      date: newDate
    }, function () {
      return _this3.changeView(Views.day);
    });
  };

  _proto.changeYearPage = function changeYearPage(nextPage) {
    if (nextPage === void 0) {
      nextPage = true;
    }

    var year = this.state.year;
    this.setState({
      year: _extends({}, year, {
        page: nextPage ? year.page + 1 : year.page - 1
      })
    });
  };

  _proto.goToPreviousMonths = function goToPreviousMonths() {
    this.setState({
      date: this.state.date.subtract(1, "M")
    });
  };

  _proto.goToNextMonths = function goToNextMonths() {
    this.setState({
      date: this.state.date.add(1, "M")
    });
  };

  _proto.goToPreviousYear = function goToPreviousYear() {
    this.setState({
      date: this.state.date.subtract(1, "y")
    });
  };

  _proto.goToNextYear = function goToNextYear() {
    this.setState({
      date: this.state.date.add(1, "y")
    });
  };

  _proto.componentDidUpdate = function componentDidUpdate(_prevProps, prevState) {
    var day = this.state.day;

    if (day.start && day.end && (day.start !== prevState.day.start || day.end !== prevState.day.end)) {
      this.props.onChange(day.start, day.end);
    }
  };

  _proto.dayView = function dayView() {
    var _this4 = this;

    var _this$state5 = this.state,
        date = _this$state5.date,
        day = _this$state5.day;
    var weeks = this.getMonthWeeks(date.year(), date.month());
    var weekDays = weekdaysMin(this.state.startWeek, this.props.shortenWeekDays);
    var monthFormat = this.props.calendarMonthFormat ? this.props.calendarMonthFormat : "MMMM";
    var calendarTextDisplay = date.format(monthFormat) + " " + date.year();

    var changeView = function changeView() {
      return _this4.changeView(Views.year);
    };

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
      onClickDay: this.setRangeDate,
      weeks: weeks,
      start: day.start,
      end: day.end,
      disableFuture: this.props.disableFuture
    })));
  };

  _proto.yearView = function yearView() {
    var _this5 = this;

    var date = this.state.date;
    var btnText = "" + date.format("YYYY");
    var rows = this.getYears();

    var changeView = function changeView() {
      return _this5.changeView(Views.day);
    };

    var nextPage = function nextPage() {
      return _this5.changeYearPage(true);
    };

    var previousPage = function previousPage() {
      return _this5.changeYearPage(false);
    };

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
  };

  _proto.monthView = function monthView() {
    var date = this.state.date;
    var months = this.getMonths();
    return React.createElement(React.Fragment, null, React.createElement(Header, {
      goToPrevious: this.goToPreviousYear,
      goToNext: this.goToNextYear,
      changeView: this.changeView,
      btnText: "" + date.format("YYYY"),
      open: true
    }), React.createElement(Content, null, React.createElement(TableHeader, null), React.createElement(Month, {
      onClickMonth: this.setMonth,
      rows: months
    })));
  };

  _proto.render = function render() {
    var activeView = this.state.activeView;
    var view = this.dayView();

    if (activeView === Views.year) {
      view = this.yearView();
    } else if (activeView === Views.month) {
      view = this.monthView();
    }

    return React.createElement("div", Object.assign({
      className: "dz-calendar"
    }, this.props.wrapperProps), view);
  };

  return Daterangepicker;
}(React.Component);

export default Daterangepicker;
//# sourceMappingURL=dz-daterangepicker-materialv2.modern.js.map
