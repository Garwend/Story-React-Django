import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { reportError } from "../../../../actions/errorActions";
import { validTokenRequiredFetch } from "../../../../actions/userActions";

import "./ReportError.css";

const ReportError = ({close}) => {
    const [errorDescription, setErrorDescription] = useState('');

    const handleErrorDescriptionChange = e => setErrorDescription(e.target.value)
    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();
        if (errorDescription.trim().length > 0) {
            dispatch(validTokenRequiredFetch(reportError(errorDescription, close)))
        }
        
    }

    return ReactDOM.createPortal((
    <div className='backdrop'>
        <div className='modal'>
            <form onSubmit={handleSubmit} className='report-error-form'>
                <h1>Zgłoś błąd</h1>
                <p>Jeśli zauważyłeś jakiś błąd zgłoś go nam, a my postaramy się to naprawić</p>
                <textarea className='form-input' cols="30" rows="10" placeholder='Opis błędu' value={errorDescription} onChange={handleErrorDescriptionChange}></textarea>
                <div className='submit-or-cancel-wrap'>
                    <button className='flat-button' type='button' onClick={close}>anuluj</button>
                    <button className='button-style' type='submit'>zgłoś</button>
                </div>
            </form>
        </div>
    </div>
    ), document.body)
}

export default ReportError;