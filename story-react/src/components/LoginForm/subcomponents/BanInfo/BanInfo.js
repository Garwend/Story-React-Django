import React from 'react';
import ReactDOM from 'react-dom';

import "./BanInfo.css";

const BanInfo = ({close, leftTime}) => {
    const {days, hours, minutes, pernamently} = leftTime
    return ReactDOM.createPortal((
        <div className='backdrop'>
            <div className='modal'>
                <div className='ban-info-wrap'>
                    <h1>Zawieszenie konta</h1>
                    {pernamently ? 
                    <p>Twoje konto zostało <span>permanentnie</span> zawieszone</p> 
                    :
                    <p>     
                        Twoje konto zostało tymczasowo zawieszone. Do końca blokady zostało 
                        <span> 
                            {days > 0 ? ` ${days} dni ` : ''}
                            {hours > 0 ? ` ${hours} godzin ` : ''}  
                            {' ' + minutes} minut
                        </span>
                    </p>}
                    
                    <button className='button-style' onClick={close}>ok</button>
                </div>  
            </div>
        </div>
        ), document.body)
}

export default BanInfo;