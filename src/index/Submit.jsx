import React ,{memo}from 'react';
import './Submit.css'
const Submit = memo(() => {
    return ( 
        <div className="submit">
            <button type="submit" className="submit-button">搜索</button>
        </div>
     );
})
 
export default Submit;
