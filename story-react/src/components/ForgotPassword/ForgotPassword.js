import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotPassword } from "../../actions/userActions";
import './ForgotPassword.css';

import SvgEmailSent from '../../images/mail_sent.svg';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(null);

    const handleEmailChange = e => setEmail(e.target.value)
    
    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();
        if (email.trim().length !== 0) {
            dispatch(forgotPassword(email, setIsEmailSent, setError))
        }
    }
    
    if (isEmailSent === null || isEmailSent === false) {
        return (
            <div className='forgot-password-wrap'>
                <form className='forgot-password-form' onSubmit={handleSubmit}>
                    <div className='forgot-password-info'>
                        <h1>Zapomniałeś hasła?</h1>
                        <p>Podaj email, a my wyślemy ci link który umożliwy ci zresetowanie hasła</p>
                    </div>
                    <div>
                        <input type="email" className='form-input' placeholder='E-mail' onChange={handleEmailChange} value={email}/>
                        {error ? <p className='input-error-message'>konto z takim adresem e-mail nie istniej</p> : null}
                    </div>
                    <button style={{display:'flex', flexDirection:'center', justifyContent:'center'}} disabled={isEmailSent === false ? true : false} className='button-style'>
                        
                        {isEmailSent === false ? 
                        <div className='forgot-password-spinner-loader'></div> 
                        : 'Wyślij link do zresetowania hasła'}

                    </button>
                </form>
            </div>
        )
    } else if (isEmailSent) {

        return (
            <div className='forgot-password-wrap'>
                <div className='mail-sent-wrap'>
                    <img src={SvgEmailSent} alt=""/>
                    <h1>Sprawdź swój email</h1>
                    <p>Wysłaliśmy wiadomośc na twój adres email</p>
                    <Link to='/accounts/login'>wróć na stronę logowania</Link>
                </div>
            </div>
        )
    }

    
}

export default ForgotPassword;