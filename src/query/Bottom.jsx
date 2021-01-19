import React, { memo, useMemo, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Slider from './Slider';
import './Bottom.css';
import { ORDER_DEPART } from './constant';

function checkedReducer(state, action) {
    const { type, payload } = action;
    let newState; // 所有被选中的集合  {1: true, 6: true}
    switch (type) {
        case 'toggle':
            newState = { ...state };
            if (payload in newState) {
                // 存在,删除该项
                delete newState[payload];
            } else {
                // 不存在,添加该项
                newState[payload] = true;
            }

            return newState;
        case 'reset':
            return {};
        default:
            return state;
    }
    // return state
}

const Filter = memo(props => {
    const { name, checked, value, dispatch } = props;
    // dispatch  点击触发action
    return (
        <li
            className={classnames({ checked })}
            onClick={() => dispatch({ payload: value, type: 'toggle' })}
        >
            {name}
        </li>
    );
});

Filter.propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const Option = memo(props => {
    const {
        title,
        options,
        checkedMap, //选中的option集合  判断option.value in checkedMap  是否在集合中
        dispatch, // 选中action
    } = props;
    return (
        <div className="option">
            <h3>{title}</h3>
            <ul>
                {options.map(option => {
                    return (
                        <Filter
                            key={option.value}
                            {...option}
                            checked={option.value in checkedMap}
                            dispatch={dispatch}
                        ></Filter>
                    );
                })}
            </ul>
        </div>
    );
});
Option.propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    checkedMap: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const BottomModal = memo(props => {
    // console.log(props, 'bottommodal');
    const {
        ticketTypes, //坐席类型
        trainTypes, //车次类型
        departStations, //出发车站
        arriveStations, //到达车站
        checkedTicketTypes, // 坐席类型选中的集合
        checkedTrainTypes, // 车次类型选中的集合
        checkedDepartStations, //出发车站选中的集合
        checkedArriveStations, // 到达车站选中的集合
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeStart,
        setDepartTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd,
        toggleIsFiltersVisible, //切换筛选modal
    } = props;

    // 需要将所有的数据先存储在本地reducer,在点击 重置  和  确认后再去统一请求数据
    const [
        localCheckedTicketTypes,
        localCheckedTicketTypesDispatch,
    ] = useReducer(checkedReducer, checkedTicketTypes, checkedTicketTypes => {
        return { ...checkedTicketTypes };
    });
    const [localCheckedTrainTypes, localCheckedTrainTypesDispatch] = useReducer(
        checkedReducer,
        checkedTrainTypes,
        checkedTrainTypes => {
            return { ...checkedTrainTypes };
        }
    );

    const [
        localCheckedDepartStations,
        localCheckedDepartStationsDispatch,
    ] = useReducer(
        checkedReducer,
        checkedDepartStations,
        checkedDepartStations => {
            return { ...checkedDepartStations };
        }
    );
    const [
        localCheckedArriveStations,
        localCheckedArriveStationsDispatch,
    ] = useReducer(
        checkedReducer,
        checkedArriveStations,
        checkedArriveStations => {
            return { ...checkedArriveStations };
        }
    );

    // 出发时间 到站时间
    const [localDepartTimeStart, setLocalDepartTimeStart] = useState(
        departTimeStart
    );
    const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(departTimeEnd);
    const [localArriveTimeStart, setLocalArriveTimeStart] = useState(
        arriveTimeStart
    );
    const [localArriveTimeEnd, setLocalArriveTimeEnd] = useState(arriveTimeEnd);

    const optionGroup = [
        {
            title: '坐席类型',
            options: ticketTypes,
            checkedMap: localCheckedTicketTypes, //选中的本地集合
            dispatch: localCheckedTicketTypesDispatch, // 触发选中的dispatch
        },
        {
            title: '车次类型',
            options: trainTypes,
            checkedMap: localCheckedTrainTypes,
            dispatch: localCheckedTrainTypesDispatch,
        },
        {
            title: '出发车站',
            options: departStations,
            checkedMap: localCheckedDepartStations,
            dispatch: localCheckedDepartStationsDispatch,
        },
        {
            title: '到达车站',
            options: arriveStations,
            checkedMap: localCheckedArriveStations,
            dispatch: localCheckedArriveStationsDispatch,
        },
    ];

    const isResetDisabled = useMemo(() => {
        return (
            Object.keys(localCheckedTicketTypes).length === 0 &&
            Object.keys(localCheckedTrainTypes).length === 0 &&
            Object.keys(localCheckedDepartStations).length === 0 &&
            Object.keys(localCheckedArriveStations).length === 0 &&
            localDepartTimeStart === 0 &&
            localDepartTimeEnd === 24 &&
            localArriveTimeStart === 0 &&
            localArriveTimeEnd === 24
        );
    }, [
        localCheckedTicketTypes,
        localCheckedTrainTypes,
        localCheckedDepartStations,
        localCheckedArriveStations,
        localDepartTimeStart, // 到达开始时间
        localDepartTimeEnd, // 到达结束时间
        localArriveTimeStart,
        localArriveTimeEnd,
    ]);

    const reset = () => {
        if (isResetDisabled) return;
        localCheckedTicketTypesDispatch({ type: 'reset' });
        localCheckedTrainTypesDispatch({ type: 'reset' });
        localCheckedDepartStationsDispatch({ type: 'reset' });
        localCheckedArriveStationsDispatch({ type: 'reset' });
        setLocalDepartTimeStart(0);
        setLocalDepartTimeEnd(24);
        setLocalArriveTimeStart(0);
        setLocalArriveTimeEnd(24);
    };

    const sure = () => {
        setCheckedTicketTypes(localCheckedTicketTypes);
        setCheckedTrainTypes(localCheckedTrainTypes);
        setCheckedDepartStations(localCheckedDepartStations);
        setCheckedArriveStations(localCheckedArriveStations);
        setDepartTimeStart(localDepartTimeStart);
        setDepartTimeEnd(localDepartTimeEnd);
        setArriveTimeStart(localArriveTimeStart);
        setArriveTimeEnd(localArriveTimeEnd);
        toggleIsFiltersVisible();
    };

    return (
        <div className="bottom-modal">
            <div className="bottom-dialog">
                <div className="bottom-dialog-content">
                    <div className="title">
                        <span
                            className={classnames('reset', {
                                disabled: isResetDisabled,
                            })}
                            onClick={reset}
                        >
                            重置
                        </span>
                        <span className="ok" onClick={sure}>
                            确定
                        </span>
                    </div>
                    <div className="options">
                        {optionGroup.map(group => {
                            return (
                                <Option {...group} key={group.title}></Option>
                            );
                        })}
                        <Slider
                            title="出发时间"
                            currentStartHours={localDepartTimeStart}
                            currentEndHours={localDepartTimeEnd}
                            onStartChanged={setLocalDepartTimeStart}
                            onEndChanged={setLocalDepartTimeEnd}
                        ></Slider>

                        <Slider
                            title="到达时间"
                            currentStartHours={localArriveTimeStart}
                            currentEndHours={localArriveTimeEnd}
                            onStartChanged={setLocalArriveTimeStart}
                            onEndChanged={setLocalArriveTimeEnd}
                        ></Slider>
                    </div>
                </div>
            </div>
        </div>
    );
});
BottomModal.propTypes = {
    ticketTypes: PropTypes.array.isRequired,
    trainTypes: PropTypes.array.isRequired,
    departStations: PropTypes.array.isRequired,
    arriveStations: PropTypes.array.isRequired,
    checkedTicketTypes: PropTypes.object.isRequired,
    checkedTrainTypes: PropTypes.object.isRequired,
    checkedDepartStations: PropTypes.object.isRequired,
    checkedArriveStations: PropTypes.object.isRequired,
    departTimeStart: PropTypes.number.isRequired,
    departTimeEnd: PropTypes.number.isRequired,
    arriveTimeStart: PropTypes.number.isRequired,
    arriveTimeEnd: PropTypes.number.isRequired,
    setCheckedTicketTypes: PropTypes.func.isRequired,
    setCheckedTrainTypes: PropTypes.func.isRequired,
    setCheckedDepartStations: PropTypes.func.isRequired,
    setCheckedArriveStations: PropTypes.func.isRequired,
    setDepartTimeStart: PropTypes.func.isRequired,
    setDepartTimeEnd: PropTypes.func.isRequired,
    setArriveTimeStart: PropTypes.func.isRequired,
    setArriveTimeEnd: PropTypes.func.isRequired,
    toggleIsFiltersVisible: PropTypes.func.isRequired,
};

const Bottom = memo(props => {
    const {
        toggleOrderType,
        toggleHighSpeed,
        toggleOnlyTickets,
        toggleIsFiltersVisible,
        highSpeed, //是否只看高铁动车
        orderType, // 出发排序类型
        onlyTickets, // 是否只看有票
        isFiltersVisible,
        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart, // 到达开始时间
        departTimeEnd, // 到达结束时间
        arriveTimeStart,
        arriveTimeEnd,
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeStart,
        setDepartTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd,
    } = props;

    const onChecked = useMemo(() => {
        // print
    }, []);

    // 筛选条件是否有被选中  Object.keys().length  判断是否是空对象
    const noChecked = useMemo(() => {
        return (
            Object.keys(checkedTicketTypes).length === 0 &&
            Object.keys(checkedTrainTypes).length === 0 &&
            Object.keys(checkedDepartStations).length === 0 &&
            Object.keys(checkedArriveStations).length === 0 &&
            departTimeStart === 0 &&
            departTimeEnd === 24 &&
            arriveTimeStart === 0 &&
            arriveTimeEnd === 24
        );
    }, [
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart, // 到达开始时间
        departTimeEnd, // 到达结束时间
        arriveTimeStart,
        arriveTimeEnd,
    ]);

    return (
        <div className="bottom">
            <div className="bottom-filters">
                <span className="item" onClick={toggleOrderType}>
                    <i className="icon">&#xf065;</i>
                    {orderType === ORDER_DEPART ? '出发 早→晚' : '耗时 短→长'}
                </span>
                <span
                    className={classnames('item', { 'item-on': highSpeed })}
                    onClick={toggleHighSpeed}
                >
                    <i className="icon">{highSpeed ? '\uf43f' : '\uf43e'}</i>
                    只看高铁动车
                </span>
                <span
                    className={classnames('item', { 'item-on': onlyTickets })}
                    onClick={toggleOnlyTickets}
                >
                    <i className="icon">{onlyTickets ? '\uf43d' : '\uf43c'}</i>
                    只看有票
                </span>
                <span
                    className={classnames('item', {
                        'item-on': isFiltersVisible || !noChecked,
                    })}
                    onClick={toggleIsFiltersVisible}
                >
                    <i className="icon">{noChecked ? '\uf0f7' : '\uf446'}</i>
                    综合筛选
                </span>
            </div>
            {isFiltersVisible && (
                <BottomModal
                    ticketTypes={ticketTypes}
                    trainTypes={trainTypes}
                    departStations={departStations}
                    arriveStations={arriveStations}
                    checkedTicketTypes={checkedTicketTypes}
                    checkedTrainTypes={checkedTrainTypes}
                    checkedDepartStations={checkedDepartStations}
                    checkedArriveStations={checkedArriveStations}
                    departTimeStart={departTimeStart}
                    departTimeEnd={departTimeEnd}
                    arriveTimeStart={arriveTimeStart}
                    arriveTimeEnd={arriveTimeEnd}
                    setCheckedTicketTypes={setCheckedTicketTypes}
                    setCheckedTrainTypes={setCheckedTrainTypes}
                    setCheckedDepartStations={setCheckedDepartStations}
                    setCheckedArriveStations={setCheckedArriveStations}
                    setDepartTimeStart={setDepartTimeStart}
                    setDepartTimeEnd={setDepartTimeEnd}
                    setArriveTimeStart={setArriveTimeStart}
                    setArriveTimeEnd={setArriveTimeEnd}
                    toggleIsFiltersVisible={toggleIsFiltersVisible}
                ></BottomModal>
            )}
        </div>
    );
});
Bottom.propTypes = {
    toggleOrderType: PropTypes.func.isRequired,
    toggleHighSpeed: PropTypes.func.isRequired,
    toggleOnlyTickets: PropTypes.func.isRequired,
    toggleIsFiltersVisible: PropTypes.func.isRequired,
    highSpeed: PropTypes.bool.isRequired,
    orderType: PropTypes.number.isRequired,
    onlyTickets: PropTypes.bool.isRequired,
    isFiltersVisible: PropTypes.bool.isRequired,

    ticketTypes: PropTypes.array.isRequired,
    trainTypes: PropTypes.array.isRequired,
    departStations: PropTypes.array.isRequired,
    arriveStations: PropTypes.array.isRequired,
    checkedTicketTypes: PropTypes.object.isRequired,
    checkedTrainTypes: PropTypes.object.isRequired,
    checkedDepartStations: PropTypes.object.isRequired,
    checkedArriveStations: PropTypes.object.isRequired,
    departTimeStart: PropTypes.number.isRequired,
    departTimeEnd: PropTypes.number.isRequired,
    arriveTimeStart: PropTypes.number.isRequired,
    arriveTimeEnd: PropTypes.number.isRequired,
    setCheckedTicketTypes: PropTypes.func.isRequired,
    setCheckedTrainTypes: PropTypes.func.isRequired,
    setCheckedDepartStations: PropTypes.func.isRequired,
    setCheckedArriveStations: PropTypes.func.isRequired,
    setDepartTimeStart: PropTypes.func.isRequired,
    setDepartTimeEnd: PropTypes.func.isRequired,
    setArriveTimeStart: PropTypes.func.isRequired,
    setArriveTimeEnd: PropTypes.func.isRequired,
};

export default Bottom;
