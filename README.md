# dz-daterangepicker-material

[![NPM](https://img.shields.io/npm/v/dz-daterangepicker-material.svg)](https://www.npmjs.com/package/dz-daterangepicker-material) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## V2 of Dz Daterangepicker [Material](https://material.io/design/introduction/).

This [React](https://reactjs.org/) date range picker component creates a dropdown menu from which a user can select a range of dates.It leverages moment.js to handle date manipulation and parsing. I created it while building my personal projects where i used [Material UI](https://material-ui.com) and  needed a way to select date ranges.

## Install

```bash
npm i --s dz-daterangepicker-materialv2
```

## Demo

Minimal demo page is included in sample directory.



#### Note: This is the old demo version. Some new features are not here
[Online demo](https://codesandbox.io/s/sad-pine-17zyi) is also available!

## Day, Year, Month view selection
![](./img/screen.png)

## Usage

```jsx
import React from 'react'
import DateRangePicker from "dz-daterangepicker-materialv2";

import "dz-daterangepicker-materialv2/dist/index.css";

function Example(){
    const [date, setDate] = React.useState({
      startDate: new Date(2020, 4, 1),
      endDate: new Date(2020, 4, 10)
    })

    const onChange = (start, end) => {
        setDate({
          startDate: start,
          endDate: end,
        })
    }

    return (
     <DateRangePicker
       startDate={date.startDate}
       endDate={date.endDate}
       onChange={onChange}
       startWeek={'monday'}
       onlyView={false}
       datePicker={false}
       textFieldProps={{}}
       popoverProps={{}}
     />
    )
}
```

### Available props
|prop|description|default|type|
|--|----|--|----|
|onChange|Triggered when a date or range is selected. returns value||({start, end}) => this.setState({start, end})|
|startDate|initial start Date|null|Moment or Date|
|endDate|initial end Date|null|Moment or Date|
|startWeek|The first day of the week|"monday"|"saturday"|"sunday" |String|
|onlyView|view mode|false|Bool|
|datePicker||false|Bool|
|textFieldProps|https://material-ui.com/api/text-field|{}|Obj|
|popoverProps|https://material-ui.com/api/popover|{}|Obj|
|minDate|min date allowed in range|null|Moment or Date|
|maxDate|max date allowed in range|null|Moment or Date|
|disableFuture|disable future dates|false|Boolean|
|shortenWeekDays|if set to `true` will use short weekday e.g. "Mon"|false|Boolean|
|calendarMonthFormat|will change the month formatting|"MMMM"|`"M","Mo","MM","MMM","MMMM"`|
|showOnlyDaysInMonths|will display only days applicable for the current month|false|Boolean
|minYear|will display the min year in the calendar. `maxYear` should be present|''|number
|maxYear|will display the max year in the calendar. `minYear` should be present|''|number

## Donation :beer: :beer: :beer:

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4H8MQCF7T74P8&source=url)


## License

MIT © [Dzheyhan Ahmedov](https://github.com/dzheyhan)
