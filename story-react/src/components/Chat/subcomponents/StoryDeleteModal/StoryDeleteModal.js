import React from "react";
import { useHistory } from "react-router-dom";
import './StoryDeleteModal.css'

const StoryDeleteModal = () => {
    const history = useHistory();

    const handleClick = () => {
        history.push('/')
    }
    
    return (
        <div className='story-delete-modal'>
            <span style={{fontSize:'50px', color: 'red'}} className="material-icons">warning</span>
            <h2>Historyjka została usunięta</h2>
            <button style={{fontSize:'20px'}} onClick={handleClick} className="flat-button">wróć na stronę główną</button>
        </div>
    )
}
export default StoryDeleteModal;