import React,{useState} from 'react';
import {useSelector} from "react-redux";
import {Link} from 'react-router-dom';

import "./CookieInfo.css";

const CookieInfo = () => {
    const isLoggedIn = useSelector(state => state.userReducer.isLoggedIn);
    const [isCookieAccepted, setIsCookieAccepted]= useState(localStorage.getItem('cookieAccept'));

    const handleClick = () => {
        localStorage.setItem('cookieAccept', 'true')
        setIsCookieAccepted('true')
    }

    if (isLoggedIn || isCookieAccepted === 'true') return null
    else {
        return (
            <div className='cookie-info-wrap'>
                <p>Strona wykorzystuje pliki cookie. Wchodząc na tę stronę akceptujesz <Link to='/info/page/cookies'> politykę plików cookie</Link></p>
                <button type='button' onClick={handleClick}>OK</button>
            </div>
        )
    }

}

export default CookieInfo;