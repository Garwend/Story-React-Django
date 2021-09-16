import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { fetchLoginUser } from '../../actions/userActions'
import BanInfo from "./subcomponents/BanInfo/BanInfo";
import './LoginForm.css'

const LoginForm  = () => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [banLeftTime, setBanLeftTime] = useState({})
    const [invalidUsernameOrPasswordError, setInvalidUsernameOrPasswordError] = useState(false)


    const handleUsernameChange = e => setUsername(e.target.value);
    const handlePasswordChange = e => setPassword(e.target.value);
    const handleOpenModal = () => setIsModalOpen(true)
    const handleCloseModal = () => setIsModalOpen(false)
    const handleInvalidUsernameOrPassworError = () => setInvalidUsernameOrPasswordError(true)

    const dispatch = useDispatch();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.length !== 0 && password.length !== 0) {
            dispatch(fetchLoginUser(username, password, handleInvalidUsernameOrPassworError, handleOpenModal, setBanLeftTime));
        }      
    }
    
    return (
        <>
            <form className='login-form' onSubmit={handleSubmit}>
                <input value={username} onChange={handleUsernameChange} placeholder='Nazwa użytkownika' type="text" className='form-input' />
                <input value={password} onChange={handlePasswordChange} placeholder='Hasło' type="password" className='form-input' />
                <Link className='forgot-password' to='/accounts/forgot/password'>Nie pamiętasz hasła?</Link>
                <button className='button-style' type="submit">Zaloguj się</button>
                {invalidUsernameOrPasswordError ? <p className='invalid-username-or-password'>Nazwa użytkownika lub hasło jest nieprawidłowe</p> : null}
            </form>
            <div className='login-form-bottom-part'>
                <span style={{color:'var(--font-color)'}}>Nie masz konta?</span> <Link to="/accounts/register">zarejestruj się</Link>
            </div>
            {isModalOpen ? <BanInfo close={handleCloseModal} leftTime={banLeftTime}/> : null}
        </>
    );
};

export default LoginForm;