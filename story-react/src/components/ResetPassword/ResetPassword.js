import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword, checkResetPasswordToken } from "../../actions/userActions";
import SpinnerLoader from "../SpinnerLoader/SpinnerLoader";
import './ResetPassword.css';

const ResetPassword = () => {
    const {uid, token} = useParams();

    const [isTokenValid, setIsTokenValid] = useState(null)
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [differentPasswordError, setDifferentPasswordError] = useState(false)
    const [minLengthPasswordError, setMinLengthPasswordError] = useState(false)
    const [isPasswordChanged, setIsPasswordChanged] = useState(null)
    

    const handlePasswordChange = e => {
        if (differentPasswordError && e.target.value === password2) setDifferentPasswordError(false)
        if (minLengthPasswordError && e.target.value.length >= 8 && password2.length >= 8) setMinLengthPasswordError(false)
        setPassword(e.target.value)
    }
    const handlePassword2Change = e => {
        if (differentPasswordError && password === e.target.value) setDifferentPasswordError(false)
        if (minLengthPasswordError && e.target.value.length >= 8 && password.length >= 8) setMinLengthPasswordError(false)
        setPassword2(e.target.value)
    }
    
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(checkResetPasswordToken(uid, token, setIsTokenValid))
    },[dispatch, uid, token])

    const handleSubmit = e => {
        e.preventDefault();
        if (password === password2 && password.length >= 8 && password2.length >= 8) {
            dispatch(resetPassword(uid, token, password, password2, setIsPasswordChanged))
        } else {
            if (password.length < 8 || password2.length < 8) {
                setMinLengthPasswordError(true)
            } else if (password !== password2) {
                setDifferentPasswordError(true)
            }
        }
    }

    if (isTokenValid === null) {
        return (
        <div style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>
            <SpinnerLoader />
        </div>
        )
    } else {
        if (isTokenValid) {
            if (isPasswordChanged === null || isPasswordChanged === false) {
                return (
                    <div className='reset-password-wrap'>
                        <form className='reset-password-form' onSubmit={handleSubmit}>
                            <h1>Zmie?? has??o</h1>
                            <input type="password" className='form-input' placeholder='nowe has??o' value={password} onChange={handlePasswordChange}/>
                            <input type="password" className='form-input' placeholder='powt??rz nowe has??o' value={password2} onChange={handlePassword2Change}/>
                            {differentPasswordError || minLengthPasswordError ?
                            <p className='input-error-message'>
                                {differentPasswordError ? 'Has??a nie s?? takie same' : 'has??o musi mie?? przynajmnie 8 znak??w'}
                            </p> 
                            : null}
                            <button disabled={isPasswordChanged === false} className='button-style'>
                                {isPasswordChanged === false ?
                                <div className='reset-password-spinner-loader'></div> 
                                : 'Zmie?? has??o'}
                            </button>
                        </form>
                    </div>
                )
            } else {
                return (
                    <div className='reset-password-wrap'>
                        <div className='password-changed-wrap'>
                            <h1>Twoje has??o zosta??o zmienione</h1>
                            <Link to="/accounts/login">zaloguj si??</Link>
                        </div>  
                    </div>
                )
            }
            
        } else {
            return (
                <div className='reset-password-wrap'>
                    <div className='link-is-not-valid-wrap'>
                        <h1>Ten link nie jest ju?? dost??pny</h1>
                        <Link to="/accounts/login">wr??c na stron?? logowania</Link>
                    </div>
                </div>
            )
        }
    }


}

export default ResetPassword;