import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { validTokenRequiredFetch, reportUser } from "../../../../../../actions/userActions";

import "./ReportUser.css";

const ReportUser = ({user, close}) => {
    const [reportReason, setReportReason] = useState('');
    const [isReported, setIsReported] = useState(null);

    const handleReportReasonChange = e => setReportReason(e.target.value)
    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();
        if (reportReason.trim().length > 0) {
            dispatch(validTokenRequiredFetch(reportUser(reportReason, user.id, setIsReported, close)))
        }
        
    }

    return ReactDOM.createPortal((
    <div className='backdrop'>
        <div className='modal'>
            <form onSubmit={handleSubmit} className='report-user-form'>
                <h1>Zgłoś użytkownika</h1>
                <textarea className='form-input' cols="30" rows="10" placeholder='Powód zgłoszenia' value={reportReason} onChange={handleReportReasonChange}></textarea>
                <div className='submit-or-cancel-wrap'>
                    <button disabled={isReported===false} className='flat-button' type='button' onClick={close}>anuluj</button>
                    <button disabled={isReported===false} className='button-style' type='submit'>zgłoś</button>
                </div>
            </form>
        </div>
    </div>
    ), document.body)
}

export default ReportUser;