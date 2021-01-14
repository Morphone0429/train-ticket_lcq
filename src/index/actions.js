export const ACTION_SET_FROM = 'SET_FROM';
export const ACTION_SET_TO = 'SET_TO';
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE =
    'SET_IS_CITY_SELECTOR_VISIBLE';
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY =
    'SET_CURRENT_SELECTING_LEFT_CITY';
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA';
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA';
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE =
    'SET_IS_DATE_SELECTOR_VISIBLE';
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';

export function setFrom(from) {
    return {
        type: ACTION_SET_FROM,
        payload: from,
    };
}

export function setTo(to) {
    return {
        type: ACTION_SET_TO,
        payload: to,
    };
}

export function setIsLoadingCityData(isLoadingCityData) {
    return {
        type: ACTION_SET_IS_LOADING_CITY_DATA,
        payload: isLoadingCityData,
    };
}

export function setCityData(cityDate) {
    return {
        type: ACTION_SET_CITY_DATA,
        payload: cityDate,
    };
}

export function toggleHighSpeed() {
    return (dispatch, getState) => {
        const { highSpeed } = getState();
        dispatch({
            type: ACTION_SET_HIGH_SPEED,
            payload: !highSpeed,
        });
    };
}

export function showCitySelector(currentSelectingLeftCity) {
    return dispatch => {
        dispatch({
            type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
            payload: true,
        });

        dispatch({
            type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
            payload: currentSelectingLeftCity,
        });
    };
}

export function hideCitySelector() {
    return {
        type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
        payload: false,
    };
}

export function setSelectedCity(city) {
    return (dispatch, getState) => {
        const { currentSelectingLeftCity } = getState();

        if (currentSelectingLeftCity) {
            dispatch(setFrom(city));
        } else {
            dispatch(setTo(city));
        }

        dispatch(hideCitySelector());
    };
}

export function showDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: true,
    };
}

export function hideDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: false,
    };
}

// 改变起始城市
export function exchangeFromTo() {
    return (dispatch, getState) => {
        const { from, to } = getState();
        dispatch(setFrom(to));
        dispatch(setTo(from));
    };
}

export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    };
}

export function fetchCityData() {
    return (dispatch, getState) => {
        const { isLoadingCityData } = getState()  //请求loading
        // 请求中 直接返回
        if (isLoadingCityData) {
            return
        }
        const cache = JSON.parse(localStorage.getItem('city_data_cache') || '{}'); //获取本地缓存数据
        if (Date.now() < cache.expires) {
            // 缓存有效期内,取缓存的数据
            dispatch(setCityData(cache.data))
        }
        // 请求中
        dispatch(setIsLoadingCityData(true))
        fetch('/rest/cities?_' + Date.now()).then(res => res.json())
            .then(cityData => {
                dispatch(setCityData(cityData))
                // 缓存 不必多次请求
                localStorage.setItem('city_data_cache', JSON.stringify({
                    expires: Date.now() + 60 * 1000,  // 设置过期时间
                    data: cityData
                }))
                dispatch(setIsLoadingCityData(false))
            }).catch(() => {
                dispatch(setIsLoadingCityData(false))
            })
    }
}
