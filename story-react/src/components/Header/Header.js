import React, {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { revokeToken } from "../../actions/userActions";
import DarkModeButton from "./subcomponents/DarkModeButton/DarkModeButton";
import ReportError from "./subcomponents/ReportError/ReportError";
import clickOutsideElement from "../../helpers/clickOutsideElement";
import './Header.css';

const Header = () => {
    const username = useSelector(state => state.userReducer.user.username);
    const profileImage = useSelector(state => state.userReducer.user.profile_image);
    const isLoggedIn = useSelector(state => state.userReducer.isLoggedIn);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const menuRef = useRef(null);
    const openMenuButtonRef = useRef(null);
    const darkModeButtonRef = useRef(null);

    const dispatch = useDispatch();

    const handleIsMenuOpen = () => setIsMenuOpen(state => !state)

    const handleModalOpen = () => setIsModalOpen(true)
    const handleModalClose = () => setIsModalOpen(false)

    const handleLogoutClick = () => {
        dispatch(revokeToken());
    }

    const handleCloseMenu = (e) => {
        if(menuRef.current !== null && e.target !== openMenuButtonRef.current) {
            if (clickOutsideElement(e, darkModeButtonRef.current)) setIsMenuOpen(false)
        }
    }

    useEffect(()=>{
        window.addEventListener('click', handleCloseMenu)

        return () => {
            window.removeEventListener('click', handleCloseMenu)
        }
    }, [])

    const menu = (
        <ul ref={menuRef} className='header-menu'>
            <Link to={'/' + username}><li>profil</li></Link>
            <Link to='/info/page'><li>informacje i regulamin</li></Link>
            <DarkModeButton ref={darkModeButtonRef}/>
            <li onClick={handleModalOpen} style={{display:'flex', flexDirection:'row'}}><span style={{marginRight:'5px'}} className="material-icons">bug_report</span> zgłoś błąd</li>
            <li onClick={handleLogoutClick}>wyloguj się</li>
        </ul>
    )

    if (isLoggedIn) {
        return (
            <header className='main-header'>
                <nav>
                    <Link to='/'><span style= {{marginRight:'20px'}} className="material-icons">home</span></Link>
                    <div style={{position: 'relative'}}>
                        <button ref={openMenuButtonRef} onClick={handleIsMenuOpen} className='header-menu-button'>
                            <img src={profileImage} alt=""/> {username}
                        </button>
                        {isMenuOpen ? menu : null}
                        {isModalOpen ? <ReportError close={handleModalClose}/> : null}
                    </div>
                </nav>
            </header>
        )
    } else {
        return null
    }
    
}

export default Header;