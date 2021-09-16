import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { validTokenRequiredFetch } from "../../../../../actions/userActions";
import { kickUserFromStory } from "../../../../../actions/storyActions";

import './KickUser.css';

const KickUser = ({storyId, user ,close}) => {
    const dispatch = useDispatch();

    const handleKickUserClick = () => {
        dispatch(validTokenRequiredFetch(kickUserFromStory(storyId, user.id, close)))
    }

    return ReactDOM.createPortal((
        <div className='backdrop'>
            <div className='modal'>
                <div className='kick-user-wrap'>
                    <p>Czy na pewno chcesz wyrzucić tego użytkownika?</p>
                    <div className='kick-user-info'>
                        <img src={user.imageUrl} alt=""/>
                        <p>{user.username}</p>
                    </div>
        
                    <div className='kick-user-or-cancel-wrap'>
                        <button className='flat-button' onClick={close}>anuluj</button>
                        <button className='button-style' onClick={handleKickUserClick}>Tak</button>
                    </div>
                </div>
            </div>
        </div>
    ), document.body)
}

export default KickUser;