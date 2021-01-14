import React from 'react';
import PropTypes from 'prop-types';
import { h0 } from '../common/fp';
import dayjs from 'dayjs';
import './DepartDate.css';
import { useMemo } from 'react/cjs/react.development';
const DepartDate = props => {
    const { time, onClick } = props;
    const h0ofDepart = h0(time); //转为该天0时0分0秒
    const departDate = new Date(h0ofDepart);
    const departDateString = useMemo(() => {
        return dayjs(h0ofDepart).format('YYYY-MM-DD');
    }, [h0ofDepart]); //返回 YYYY-MM-DD格式时间

    const isToday = h0ofDepart === h0(); //判断是否是今天
    // departDate.getDay()   返回一周的某一天数字
    const weekString =
        '周' +
        ['日', '一', '二', '三', '四', '五', '六'][departDate.getDay()] +
        (isToday ? '(今天)' : '');

    return (
        <div className="depart-date" onClick={onClick}>
            <input type="hidden" name="date" value={departDateString} />
            {departDateString} <span className="depart-week">{weekString}</span>
        </div>
    );
};

export default DepartDate;
