import React from 'react';
import { useHistory } from "react-router-dom";
import { validTokenRequiredFetch } from "../../../actions/userActions";
import { deleteCharacterFetch } from "../../../actions/characterActions";
import { useDispatch } from "react-redux";
import './DeleteCharacterModal.css'

const DeleteCharacterModal = ({id,close}) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const handleDeleteClick = () => {
        dispatch(validTokenRequiredFetch(deleteCharacterFetch(id, history)))
    }
    return (
        <div className='backdrop'>
            <div className='modal'>
                <div className='delete-character-wrap'>
                    <p style={{textAlign:'center',fontWeight:'700'}}>Czy jesteś tego pewien?</p>
                    <div className='delete-character-or-cancel'>
                        <button onClick={close} className='flat-button'>anuluj</button>
                        <button onClick={handleDeleteClick} className='button-style'>usuń</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteCharacterModal;