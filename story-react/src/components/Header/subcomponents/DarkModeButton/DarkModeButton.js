import React, {useEffect, useState, forwardRef} from 'react';

import "./DarkModeButton.css";

const DarkModeButton = (props, ref) => {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(()=>{
        const theme = localStorage.getItem('theme')
        if (theme === 'dark') {
            setDarkMode(true)
        } else if (theme === 'light') {
            setDarkMode(false)
        } else {
            setDarkMode(false)
            localStorage.setItem('theme', 'light')
        }

    },[])

    const handleClick = () => {
        if (darkMode) {
            setDarkMode(false)
            localStorage.setItem('theme', 'light')
            document.documentElement.classList.remove('dark-mode');
        }else {
            setDarkMode(true);
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark-mode');
        }
    }

    return (
        <li ref={ref}> 
            <label htmlFor="dark-mode" className='dark-mode-button-wrap'>
                <span className="material-icons">bedtime</span>
                <span>Ciemny motyw</span>
                <div className='switch-wrap' style={darkMode ? {backgroundColor:'var(--primary-color)'} : {}}>
                    <input className='hide' type="checkbox" id="dark-mode" onChange={handleClick} checked={darkMode}/>
                    <div className='switch-dot'></div>
                </div>
            </label>
        </li>
    )
}

export default forwardRef(DarkModeButton);