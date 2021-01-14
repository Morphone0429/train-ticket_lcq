import React from 'react';
import switchImg from './imgs/switch.svg'
import './Journey.css';
const Journey = (props) => {
    
    const {from,to,exchangeFromTo,showCitySelector} = props
    return (
        <div className="journey">
            <div
                className="journey-station"
                onClick={() => showCitySelector(true)}
            >
                <input
                    type="text"
                    readOnly
                    name="from"
                    value={from}
                    className="journey-input journey-from"
                />
            </div>
            <div className="journey-switch" onClick={() => exchangeFromTo()}>
                <img src={switchImg} alt="switch" height="40" width="70" />
            </div>
            <div
                className="journey-station"
                onClick={() => showCitySelector(false)}
            >
                <input
                    type="text"
                    readOnly
                    name="to"
                    value={to}
                    className="journey-input journey-to"
                />
            </div>
        </div>
    );
}
 
export default Journey;