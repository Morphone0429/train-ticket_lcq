import React, { useState, useMemo, useCallback, useEffect, memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './CitySelector.css';

const CityItem = memo(props => {
    const { name, onSelect } = props;
    return (
        <li className="city-li" onClick={() => onSelect(name)}>
            {name}
        </li>
    );
});
CityItem.propType = {
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};
const CitySection = memo(props => {
    const { title, cities = [], onSelect } = props;
    return (
        <ul className="city-ul">
            <li className="city-li" key="title" data-cate={title}>
                {title}
            </li>
            {cities.map(city => {
                return (
                    <CityItem
                        key={city.name}
                        name={city.name}
                        onSelect={onSelect}
                    ></CityItem>
                );
            })}
        </ul>
    );
});
CityItem.propType = {
    title: PropTypes.string.isRequired,
    cities: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
};

// 取出26个字母
const alphabet = Array.from(new Array(26), (ele, index) => {
    return String.fromCharCode(65 + index);
});
const AlphaIndex = props => {
    const { alpha, onClick } = props;
    return (
        <li
            className="city-index-item"
            onClick={() => {
                onClick(alpha);
            }}
        >
            {alpha}
        </li>
    );
};
AlphaIndex.propType = {
    alpha: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};
const CityList = memo(props => {
    const { sections, onSelect, toAlpha } = props;
    return (
        <div className="city-list">
            <div className="city-cate">
                {sections.map(section => {
                    return (
                        <CitySection
                            key={section.title}
                            title={section.title}
                            cities={section.citys}
                            onSelect={onSelect}
                        ></CitySection>
                    );
                })}
            </div>
            <div className="city-index">
                {alphabet.map(alpha => {
                    return (
                        <AlphaIndex
                            key={alpha}
                            alpha={alpha}
                            onClick={toAlpha}
                        ></AlphaIndex>
                    );
                })}
            </div>
        </div>
    );
});
CityList.propType = {
    sections: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

const SuggestItem = memo(props => {
    const { name, onClick } = props;
    return (
        <li className="city-suggest-li" onClick={() => onClick(name)}>
            {name}
        </li>
    );
});
SuggestItem.propType = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

const Suggest = memo(props => {
    const { searchKey, onSelect } = props;
    const [result, setResult] = useState([]);

    useEffect(() => {
        fetch('/rest/search?key=' + encodeURIComponent(searchKey))
            .then(res => res.json())
            .then(data => {
                console.log(data, '==data');
                const { result, searchKey: sKey } = data;
                if(sKey === searchKey) {
                    setResult(result);
                }
            });
    }, [searchKey]);

    const fallBackResult = useMemo(()=>{
        if(!result.length){
            return [{display: searchKey}]
        }
        return result
    },[result,searchKey])

    return (
        <div className="city-suggest">
            <ul className="city-suggest-li">
                {fallBackResult.map(item=>{
                    return (
                        <SuggestItem
                            key={item.display}
                            name={item.display}
                            onClick={onSelect}
                        ></SuggestItem>
                    );
                })}
            </ul>
        </div>
    );
});
Suggest.propType = {
    searchKey: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};

const CitySelector = memo(props => {
    const {
        show,
        onBack,
        fetchCityData,
        cityData,
        isLoading,
        onSelect,
    } = props;
    const [searchKey, setSearchKey] = useState('');
    const key = useMemo(() => searchKey.trim(), [searchKey]);

    useEffect(() => {
        if (!show || cityData || isLoading) return;
        fetchCityData();
    }, [show, cityData, isLoading]);

    // 点击城市大写字母跳转
    const toAlpha = useCallback(alpha => {
        // 属性选择器 锚点定位
        document.querySelector(`[data-cate='${alpha}']`).scrollIntoView();
    }, []);

    // 渲染城市列表
    const outputCitySections = () => {
        if (isLoading) {
            return <div>loading</div>;
        }
        if (cityData) {
            return (
                <CityList
                    sections={cityData.cityList}
                    onSelect={onSelect}
                    toAlpha={toAlpha}
                ></CityList>
            );
            return <div>error</div>;
        }
    };

    return (
        <div className={classnames('city-selector', { hidden: !show })}>
            <div className="city-search">
                <div className="search-back" onClick={() => onBack()}>
                    <svg width="42" height="42">
                        <polyline
                            points="25,13 16,21 25,29"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                        ></polyline>
                    </svg>
                </div>
                <div className="search-input-wrapper">
                    <input
                        value={searchKey}
                        placeholder="城市,车站的中文或拼音"
                        className="search-input"
                        type="text"
                        onChange={e => setSearchKey(e.target.value)}
                    />
                </div>
                <i
                    className={classnames('search-clean', {
                        hidden: key.length === 0,
                    })}
                    onClick={() => setSearchKey('')}
                >
                    &#xf063;
                </i>
            </div>
            {Boolean(key) && (
                <Suggest
                    searchKey={key}
                    onSelect={key => onSelect(key)}
                ></Suggest>
            )}
            {outputCitySections()}
        </div>
    );
});

CitySelector.propType = {
    show: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    fetchCityData: PropTypes.func.isRequired,
    cityData: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
};

export default CitySelector;
