import { useCallback } from 'react';
import { h0 } from './fp';

export default function useNav(departDate, dispatch, preDate, nextDate) {
    const isPrevDisabled = h0(departDate) <= h0(); // 是否小于今天
    const isNextDisabled = h0(departDate) - h0() > 20 * 86400 * 1000; //20天以后
    const prev = useCallback(() => {
        if (isPrevDisabled) {
            return;
        }
        dispatch(preDate()); //昨天
    }, [isPrevDisabled]);
    const next = useCallback(() => {
        if (isNextDisabled) {
            return;
        }
        dispatch(nextDate());
    }, [isNextDisabled]);
    return {
        isPrevDisabled,
        isNextDisabled,
        prev,
        next,
    };
}
