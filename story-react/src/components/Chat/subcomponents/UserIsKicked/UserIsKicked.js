import React from "react";
import { useHistory } from "react-router-dom";
import './UserIsKicked.css'

const UserIsKicked = () => {
    const history = useHistory();

    const handleClick = () => {
        history.push('/')
    }
    
    return (
        <div className='user-is-kicked-wrap'>
            <span style={{fontSize:'50px', color: 'red'}} className="material-icons">warning</span>
            <h2>Zostałeś wyrzucony z historyjki</h2>
            <button style={{fontSize:'20px'}} onClick={handleClick} className="flat-button">wróć na stronę główną</button>
        </div>
    )
}
export default UserIsKicked;