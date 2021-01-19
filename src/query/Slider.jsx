import React, { memo, useRef, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import leftPad from 'left-pad';
import useWinSize from '../common/useWinSize';
import './Slider.css';
const Slider = props => {
    const {
        title,
        currentStartHours, // 开始的小时
        currentEndHours, // 结束的小时
        onStartChanged,
        onEndChanged,
    } = props;
    const winSize = useWinSize(); // 获取宽度

    const startHandle = useRef(); // 开始圆点 ref
    const endHandle = useRef(); // 结束圆点 ref

    const lastStartX = useRef(); // x轴 左侧开始 坐标  ref相当于this
    const lastEndX = useRef(); // x轴 右侧结束 坐标   ref相当于this

    const range = useRef(); // 滑动条ref
    const rangeWidth = useRef(); //滑动条宽度

    const preCurrentStartHours = useRef(currentStartHours);
    const preCurrentEndHours = useRef(currentEndHours);

    const [start, setStart] = useState(() => (currentStartHours / 24) * 100); // 开始  百分比
    const [end, setEnd] = useState(() => (currentEndHours / 24) * 100); // 结束  百分比

    // 保存最新的state  确保是最新的state
    if (preCurrentStartHours.current !== currentStartHours) {
        setStart((currentStartHours / 24) * 100);
        preCurrentStartHours.current = currentStartHours;
    }

    // 保存最新的state
    if (preCurrentEndHours.current !== currentEndHours) {
        setEnd((currentEndHours / 24) * 100);
        preCurrentEndHours.current = currentEndHours;
    }

    const onStartTouchBegin = e => {
        const touch = e.targetTouches[0]; //当前对象上所有触摸点的列表;
        lastStartX.current = touch.pageX;
    };
    const onStartTouchMove = e => {
        const touch = e.targetTouches[0]; // 距离开始滑动的距离差   本次的pageX - 开始时的pageX
        const distance = touch.pageX - lastStartX.current;
        lastStartX.current = touch.pageX;
        setStart(start => start + (distance / rangeWidth.current) * 100); // 累加百分比 更新start 数据
    };
    const onEndTouchBegin = e => {
        const touch = e.targetTouches[0]; //当前对象上所有触摸点的列表;
        lastEndX.current = touch.pageX;
    };
    const onEndTouchMove = e => {
        const touch = e.targetTouches[0]; // 距离开始滑动的距离差   本次的pageX - 开始时的pageX
        const distance = touch.pageX - lastEndX.current;
        lastEndX.current = touch.pageX;
        setEnd(end => end + (distance / rangeWidth.current) * 100); // 累加百分比 更新start 数据
    };

    // 获取 滑动条宽度
    useEffect(() => {
        rangeWidth.current = parseFloat(
            window.getComputedStyle(range.current).width
        );
    }, [winSize.width]);

    // 绑定 touchstart  touchmove事件
    useEffect(() => {
        startHandle.current.addEventListener(
            'touchstart',
            onStartTouchBegin,
            false
        );
        startHandle.current.addEventListener(
            'touchmove',
            onStartTouchMove,
            false
        );
        endHandle.current.addEventListener(
            'touchstart',
            onEndTouchBegin,
            false
        );
        endHandle.current.addEventListener('touchmove', onEndTouchMove, false);
        return () => {
            startHandle.current.removeEventListener(
                'touchstart',
                onStartTouchBegin,
                false
            );
            startHandle.current.removeEventListener(
                'touchmove',
                onStartTouchMove,
                false
            );
            endHandle.current.removeEventListener(
                'touchstart',
                onEndTouchBegin,
                false
            );
            endHandle.current.removeEventListener(
                'touchmove',
                onEndTouchMove,
                false
            );
        };
    }, []);

    // startHours 改变 触发更新
    useEffect(() => {
        onStartChanged(startHours);
    }, [start]);

    // endHours 改变触发更新
    useEffect(() => {
        onEndChanged(endHours);
    }, [end]);

    const startPercent = useMemo(() => {
        if (start > 100) {
            return 100;
        }
        if (start < 0) {
            return 0;
        }
        return start;
    }, [start]);

    const endPercent = useMemo(() => {
        if (end > 100) {
            return 100;
        }
        if (end < 0) {
            return 0;
        }
        return end;
    }, [end]);

    // 取整
    const startHours = useMemo(() => {
        return Math.round((startPercent * 24) / 100);
    }, [startPercent]);

    const endHours = useMemo(() => {
        return Math.round((endPercent * 24) / 100);
    }, [endPercent]);

    // 显示小时文字
    const startText = useMemo(() => {
        return leftPad(startHours, 2, '0') + ':00';
    }, [startHours]);
    const endText = useMemo(() => {
        return leftPad(endHours, 2, '0') + ':00';
    }, [endHours]);

    return (
        <div className="option">
            <h3>{title}</h3>
            <div className="range-slider">
                <div className="slider" ref={range}>
                    <div
                        className="slider-range"
                        style={{
                            left: startPercent + '%',
                            width: endPercent - startPercent + '%',
                        }}
                    ></div>
                    <i
                        ref={startHandle}
                        className="slider-handle"
                        style={{ left: startPercent + '%' }}
                    >
                        <span>{startText}</span>
                    </i>
                    <i
                        ref={endHandle}
                        className="slider-handle"
                        style={{ left: endPercent + '%' }}
                    >
                        <span>{endText}</span>
                    </i>
                </div>
            </div>
        </div>
    );
};

Slider.propTypes = {
    title: PropTypes.string.isRequired,
    currentStartHours: PropTypes.number.isRequired,
    currentEndHours: PropTypes.number.isRequired,
    onStartChanged: PropTypes.func.isRequired,
    onEndChanged: PropTypes.func.isRequired,
};

export default Slider;
