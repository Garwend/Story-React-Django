import React, {useState} from 'react';
import { joinStory } from "../../../actions/storyActions";
import { validTokenRequiredFetch } from "../../../actions/userActions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";


import StoryFoundInfo from "./StoryFoundInfo";

const StoryFound = ({id, title, plot, numberOfUsersInStory, usersCount = 1 }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true)
    const handleClose = () => setIsOpen(false)

    const dispatch = useDispatch();
    const history = useHistory();

    const handleJoinStory = () => {
        dispatch(validTokenRequiredFetch(joinStory(id,history)))
    }

    return (
        <React.Fragment>
            <li className='story-found'>
                <p className='story-found-title'>{title}</p>
                <div className='story-found-info'>
                    <p>
                        <span style={{marginRight: '5px'}} className="material-icons">people</span>
                        <span className='story-found-number-of-users'>{usersCount}/{numberOfUsersInStory}</span>
                    </p>
                    <span onClick={handleOpen} style={{cursor:'pointer'}} className="material-icons">info</span>
                    <button onClick={handleJoinStory} className='button-style'>Dołącz</button>
                </div>
            </li>
            {isOpen ? <StoryFoundInfo title={title} plot={plot} close={handleClose} /> : null}
        </React.Fragment>
    )
}

export default StoryFound;