import React from 'react';
import ReactDOM from 'react-dom';

const StoryPlot = ({plot, setIsModalOpen}) => {
    return ReactDOM.createPortal((
        <div className='backdrop'>
            <div className='modal'>
            <div className='story-plot-wrap'>
                    <h2 style={{textAlign: 'center', flex: '0 0 50px'}}>Fabuła</h2>
                    <p style={{flexGrow: '1', overflow:'auto', whiteSpace: 'pre-line', color:'var(--font-color)'}}>{plot}</p>
                    <div className='story-plot-btn-wrap'>
                        <button style={{width: '100px'}} onClick={()=> setIsModalOpen(false)} className='button-style'>ok</button>
                    </div>
                </div>
                
            </div>
        </div>
    ),document.body)
}

export default StoryPlot;