import React, { useCallback, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './App.css';

import Header from '../common/Header.jsx';
import DepartDate from './DepartDate.jsx';
import HighSpeed from './HighSpeed.jsx';
import Journey from './Journey.jsx';
import Submit from './Submit.jsx';

import CitySelector from '../common/CitySelector.jsx'; // 城市选择组件
import DateSelector from '../common/DateSelector.jsx'; //时间选择组件

import { h0 } from '../common/fp';

import {
    exchangeFromTo,
    showCitySelector,
    hideCitySelector,
    fetchCityData,
    setSelectedCity,
    showDateSelector,
    hideDateSelector,
    setDepartDate,
    toggleHighSpeed,
} from './actions';

function App(props) {
    const {
        to,
        from,
        dispatch,
        cityData, //城市数据
        isLoadingCityData,
        isCitySelectorVisible, // 城市选择蒙层flag
        departDate, // 乘车时间
        isDateSelectorVisible, // 时间选择蒙层flag
        highSpeed, //是否乘坐高铁
    } = props;
    // 返回上一页
    const onBack = useCallback(() => {
        window.history.back();
    }, []);

    // bindActionCreators 合并dispatch
    const cbs = useMemo(() => {
        return bindActionCreators(
            { exchangeFromTo, showCitySelector },
            dispatch
        );
    }, []);
    const citySelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideCitySelector,
                fetchCityData,
                onSelect: setSelectedCity,
            },
            dispatch
        );
    }, []);

    const departDataCbs = useMemo(() => {
        return bindActionCreators(
            {
                onClick: showDateSelector,
            },
            dispatch
        );
    }, []);

    const dateSelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideDateSelector,
            },
            dispatch
        );
    }, []);

    const highSpeedCbs = useMemo(()=>{
        return bindActionCreators({
            toggle: toggleHighSpeed
        },dispatch)
    
    },[])

    const onSelectDate = useCallback(day => {
        console.log(day);
        if (!day) {
            // day为null
            return;
        }
        if (day < h0()) {
            // day小于今天
            return;
        }
        dispatch(setDepartDate(day)); //设置选中的日期
        dispatch(hideDateSelector());
    }, []);

    return (
        <div>
            <div className="header-wrapper">
                <Header title="火车票" onBack={onBack} />
            </div>
            <form action="./query.html" className="form">
                <Journey to={to} from={from} {...cbs}></Journey>
                <DepartDate time={departDate} {...departDataCbs}></DepartDate>
                <HighSpeed highSpeed={highSpeed} {...highSpeedCbs}></HighSpeed>
                <Submit></Submit>
            </form>
            <CitySelector
                show={isCitySelectorVisible}
                cityData={cityData}
                isLoading={isLoadingCityData}
                {...citySelectorCbs}
            ></CitySelector>
            <DateSelector
                show={isDateSelectorVisible}
                {...dateSelectorCbs}
                onSelect={onSelectDate}
            ></DateSelector>
        </div>
    );
}

export default connect(
    function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(App);
