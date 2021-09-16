import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { leaveStory, deleteStoryFetch } from "../../../../actions/storyActions";
import { validTokenRequiredFetch } from "../../../../actions/userActions";


const LeaveOrDeleteStory = ({ storyId,isLeave, setIsModalOpen}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const handleLeaveStoryClick = () => {
        dispatch(validTokenRequiredFetch(leaveStory(storyId, history)))
    }

    const handleDeleteStoryClick = () => {
        dispatch(validTokenRequiredFetch(deleteStoryFetch(storyId, history)))
    }

    return ReactDOM.createPortal((
        <div className='backdrop'>
            <div className='modal'>
                <div className='leave-or-delete-story-wrap'>
                    <p>
                        {isLeave ?
                        'Czy jesteś pewny, że chcesz opuścić historyjkę?':
                        'Czy jesteś pewny, że chcesz usunąć historyjkę?'}
                    </p>
                    <div>
                        <button onClick={()=> setIsModalOpen(false)} className='flat-button'>anuluj</button>
                        <button onClick={isLeave ? handleLeaveStoryClick : handleDeleteStoryClick} className='button-style'>{isLeave ? 'wyjdź':'usuń'}</button>
                    </div>
                </div>
                
            </div>
        </div>
    ),document.body)
}

export default LeaveOrDeleteStory;