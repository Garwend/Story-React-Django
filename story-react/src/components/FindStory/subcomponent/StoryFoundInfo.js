import React from 'react';
import ReactDOM from 'react-dom';

const StoryFoundInfo = ({title,plot, close}) => {
    return ReactDOM.createPortal((
        <div className='second-backdrop'>
            <div className='modal'>
                <div className='story-found-info-wrap'>
                    <header style={{height:'50px'}}><h2>{title}</h2></header>
                    <p style={{flexGrow: '1', overflow:'auto', whiteSpace: 'pre-line',color: 'var(--font-color)'}}>{plot}</p>
                    <div className='story-found-button-wrap' style={{height:'50px'}}>
                        <button style={{width: '50px'}} onClick={close} className='button-style'>ok</button>
                    </div>
                </div>
            </div>
        </div>
    ), document.body)
}

export default StoryFoundInfo;