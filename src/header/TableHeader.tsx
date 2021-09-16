import React from "react";

interface TableHeaderProps {
  weekDays?: string[]
}

function TableHeader(props:TableHeaderProps) {
  return (
    <thead className="cdz-calendar__table__header">
      <tr>
        {props.weekDays && props.weekDays.map((day:string, index:number) => (
          <th key={index}>{day}</th>
        ))}
      </tr>
      <tr>
        <th
          aria-hidden="true"
          className="dz-calendar__table__header__divider"
          colSpan={7}
        />
      </tr>
    </thead>
  );
}

export default TableHeader;
