import React from "react";
import ReactDOM from "react-dom";
import DateRangePicker from "dz-daterangepicker-materialv2";

import "dz-daterangepicker-materialv2/dist/index.css";

const myStyle = {
  wrap: {
    flexDirection: "column",
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
  },
  datePeriod: {
    display: "inlineBlock"
  },
  date: {
    color: "red"
  }
};

function DateRangePickerView() {
  const [date, setDate] = React.useState({});

  const onChange = (start, end) => {
    setDate({
      startDate: start,
      endDate: end
    });
  };

  const handleClick = () => {
    onChange(new Date(2015, 1, 1), new Date(2015, 9, 2));
  };

  return (
    <div style={myStyle.wrap}>
      <button onClick={handleClick}>Load from server</button>
      <h4>
        Start date:&nbsp;
        <span style={myStyle.date}>
          {date.startDate ? date.startDate.toString() : null}
        </span>
      </h4>
      <h4 style={myStyle.datePeriod}>
        End date:&nbsp;
        <span style={myStyle.date}>
          {date.endDate ? date.endDate.toString() : null}
        </span>
      </h4>

      <div id="test">
        <DateRangePicker
          setFocusOnEndDateMonth
          showOnlyDaysInMonths
          disableFuture
          shortenWeekDays
          maxYear={2021}
          minimumYear={1999}
          startDate={date.startDate}
          endDate={date.endDate}
          datePicker={false}
          onChange={onChange}
          locale={"de"}
          startWeek={"monday"} //monday|saturday|sunday
        />
      </div>
    </div>
  );
}

ReactDOM.render(<DateRangePickerView />, document.getElementById("root"));
