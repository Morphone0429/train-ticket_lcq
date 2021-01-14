import React, { createFactory } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { h0 } from './fp';
import Header from './Header';
import './DateSelector.css';

const Day = props => {
    const { day, onSelect } = props;
    if (!day) {
        return <td className="null"></td>;
    }
    const classes = [];
    const now = h0();
    if (day < now) {
        classes.push('disabled');
    }
    if ([6, 0].includes(new Date(day).getDay())) {
        classes.push('weekend');
    }
    const dateString = now === day ? '今天' : new Date(day).getDate();
    return (
        <td className={classnames(classes)} onClick={() => onSelect(day)}>
            {dateString}
        </td>
    );
};

Day.propTypes = {
    day: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
};

const Week = props => {
    const { days, onSelect } = props;
    return (
        <tr className="date-table-days">
            {days.map((day, index) => {
                return <Day key={index} day={day} onSelect={onSelect}></Day>;
            })}
        </tr>
    );
};

Week.propTypes = {
    days: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

const Month = props => {
    const { startingTimeInMonth, onSelect } = props;
    const startDay = new Date(startingTimeInMonth);
    const currentDay = new Date(startingTimeInMonth);
    let days = []; // 该月天数数组
    // getMonth() 方法可返回表示月份的数字
    // getTime() 方法可返回距 1970 年 1 月 1 日之间的毫秒数。
    // getDate() 方法可返回月份的某一天。
    // getDay() 方法可返回一周（0~6）的某一天的数字。
    while (startDay.getMonth() === currentDay.getMonth()) {
        // 获取该月所有的天数时间戳
        days.push(currentDay.getTime());
        currentDay.setDate(currentDay.getDate() + 1);
    }
    // 处理天数,使天数为7的倍数 前后填充null,用于渲染dom
    days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
        .fill(null)
        .concat(days); //补齐天数 该月第一天不是礼拜日,前面补齐
    const lastDay = new Date(days[days.length - 1]);
    days = days.concat(
        new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null)
    );
    // 分割为 周
    const weeks = [];
    for (var row = 0; row < days.length / 7; ++row) {
        const week = days.slice(row * 7, (row + 1) * 7);
        weeks.push(week);
    }
    return (
        <table className="date-table">
            <thead>
                <tr>
                    <td colSpan="7">
                        <h5>
                            {startDay.getFullYear()}年{startDay.getMonth() + 1}
                            月
                        </h5>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr className="date-table-weeks">
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th className="weekend">周六</th>
                    <th className="weekend">周日</th>
                </tr>
                {weeks.map((week, index) => {
                    return (
                        <Week
                            key={index}
                            days={week}
                            onSelect={onSelect}
                        ></Week>
                    );
                })}
            </tbody>
        </table>
    );
};

Month.propTypes = {
    startingTimeInMonth: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
};

const DateSelector = props => {
    const { show, onSelect, onBack } = props;
    // console.log(props,'props');
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setDate(1); // 设置一个月的某一天  参数为某天
    // 此时now 为该月 第一天 0时0分0秒0毫秒
    let monthSequence = [now.getTime()]; // 月份数组-时间戳
    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime());
    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime());

    return (
        <div className={classnames('date-selector', { hidden: !show })}>
            <Header title="日期选择" onBack={onBack}></Header>
            <div className="date-selector-tables">
                {monthSequence.map(month => {
                    return (
                        <Month
                            key={month}
                            onSelect={onSelect}
                            startingTimeInMonth={month}
                        ></Month>
                    );
                })}
            </div>
        </div>
    );
};
DateSelector.propTypes = {
    show: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};
export default DateSelector;
