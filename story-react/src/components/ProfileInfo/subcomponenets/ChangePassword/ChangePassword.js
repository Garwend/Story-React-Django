import React,{useState} from 'react';
import { useDispatch } from 'react-redux';
import { validTokenRequiredFetch, changePassword } from "../../../../actions/userActions";

import "./ChangePassword.css";

const ChangePassword = () => {
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [differentPasswordError, setDifferentPasswordError] = useState(false)
    const [minLengthPasswordError, setMinLengthPasswordError] = useState(false)
    const [wrongPasswordError, setWrongPasswordError] = useState(false)
    const [isPasswordChanged, setIsPasswordChanged] = useState(null)

    const handlePasswordChange = e => setPassword(e.target.value)

    const handleNewPasswordChange = e => {
        if (differentPasswordError && newPassword2 === e.target.value) setDifferentPasswordError(false)
        if (minLengthPasswordError && e.target.value.length >= 8 && newPassword2.length >= 8) setMinLengthPasswordError(false)
        setNewPassword(e.target.value)
    }
    const handleNewPassword2Change = e => {
        if (differentPasswordError && newPassword === e.target.value) setDifferentPasswordError(false)
        if (minLengthPasswordError && e.target.value.length >= 8 && newPassword.length >= 8) setMinLengthPasswordError(false)
        setNewPassword2(e.target.value)
    }

    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();
        if (newPassword === newPassword2 && newPassword.length >= 8 && newPassword2.length >= 8 && password.length !== 0) {
            dispatch(validTokenRequiredFetch(changePassword(password, newPassword, newPassword2,setWrongPasswordError, setIsPasswordChanged)))
        } else {
            if (newPassword.length < 8 || newPassword2.length < 8) {
                setMinLengthPasswordError(true)
            } else if (newPassword !== newPassword2) {
                setDifferentPasswordError(true)
            }
        }
        
    }

    if (isPasswordChanged === null || isPasswordChanged === false) {
        return (
            <form className='change-password-form' onSubmit={handleSubmit}>
                <h3>Zmień hasło</h3>
                <input className='form-input' type="password" placeholder='aktualne hasło' value={password} onChange={handlePasswordChange}/>
                
                {wrongPasswordError ?
                <p style={{textAlign:'center', marginBottom:'20px'}} className='input-error-message'>
                    nieprawidłowe hasło
                </p> 
                : null}

                <input className='form-input' type="password" placeholder='nowe hasło' value={newPassword} onChange={handleNewPasswordChange}/>
                
                <input className='form-input' type="password" placeholder='powtórz nowe hasło' value={newPassword2} onChange={handleNewPassword2Change}/>
    
                {differentPasswordError || minLengthPasswordError ?
                <p style={{textAlign:'center', marginBottom:'20px'}} className='input-error-message'>
                    {differentPasswordError ? 'Hasła nie są takie same' : 'hasło musi mieć przynajmnie 8 znaków'}
                </p> 
                : null}
    
                <button disabled={isPasswordChanged === false} style={{width: '100%'}} className='button-style' type='submit'>
                    {isPasswordChanged === false ?
                    <div className='change-password-spinner-loader'></div> 
                    : 'Zmień hasło'}
                </button>
            </form>
        )
    } else {
        return (
        <div className='password-change-wrap'>
            <h2>Twoje hasło zostało zmienione</h2>
            <p>za chwile zostaniesz wylogowany</p>
        </div>
        )
    }


}

export default ChangePassword;