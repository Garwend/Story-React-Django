import React, {useState} from 'react';
import { useSelector} from "react-redux";
import KickUser from "./subcomponents/KickUser";
import ReportUser from "./subcomponents/ReportUser/ReportUser";
import CharacterInfo from "./subcomponents/CharacterInfo/CharacterInfo";
import './StoryInfo.css';

const StoryInfo = ({id,author,numberOfUsersInStory,usersCount, usersInStory, additionalCharacters, userIsAuthor, chosenCharacter, setChosenCharacter, isHidden}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalReportOpen, setIsModalReportOpen] = useState(false);
    const [isModalCharacterInfoOpen, setIsModalCharacterInfoOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const [characterData, setCharacterData] = useState({});

    const loggedInUser = useSelector(state => state.userReducer.user)
    const handleSetChosenCharacterClick =  (id) => {
        setChosenCharacter(prev => prev === id ? null : id)
    }

    const handleModalOpenClick = (user) => {
        setUserData(user)
        setIsModalOpen(true)
    }

    const handleModalCloseClick = () => {
        setUserData({})
        setIsModalOpen(false)
    }

    const handleModalReportOpenClick = (user) => {
        setUserData(user)
        setIsModalReportOpen(true)
    }

    const handleModalReportCloseClick = () => {
        setUserData({})
        setIsModalReportOpen(false)
    }

    const handleModalCharacterInfoOpenClick = (character) => {
        setIsModalCharacterInfoOpen(true);
        setCharacterData(character);
    }

    const handleModalCharacterInfoCloseClick = () => setIsModalCharacterInfoOpen(false)


    return (
        <aside className={`story-info-wrap ${isHidden ? 'mobile-hidden': ''}`}>
            <div className='users-info-wrap'>
            <header className='users-header'><p>Osoby</p><span>{usersCount}/{numberOfUsersInStory}</span></header>
                <div>
                    <ul className='users-in-story-list'>
                        <li style={author.isConnected ? {} : {filter:'opacity(0.5)'}} className='author-of-story'>
                            <img className='user-in-story-img' src={author.imageUrl} alt=""/> 
                            {author.username}
                            {Number(author.id) !== Number(loggedInUser.id) ? 
                                <span style={{margin: '0 10px 0 auto'}} className="material-icons" onClick={() => handleModalReportOpenClick(author)}>priority_high</span>
                                : null}
                        </li>

                        {usersInStory.map(user => (
                        <li key={user.id} style={user.isConnected ? {} : {filter:'opacity(0.5)'}} >
                            <img className='user-in-story-img' src={user.imageUrl} alt=""/> 
                            {user.username}
                            <div style={{margin: '0 0 0 auto'}}>
                                {Number(user.id) !== Number(loggedInUser.id) ? 
                                <span className="material-icons" onClick={() => handleModalReportOpenClick(user)}>priority_high</span>
                                : null}
                                
                                {userIsAuthor ? <span className="material-icons" onClick={() => handleModalOpenClick(user)}>person_remove</span> : null}
                            </div>
                        </li>))}
                    </ul>
                </div>
            </div>
            <div className='story-characters-wrap'>
                <header className='story-characters-header'><p>Postacie</p></header>
                <ul className='characters-in-story-list'>
                    {additionalCharacters.map(character => (
                    <li key={character.id}>
                        <div style={chosenCharacter === character.id ? {backgroundColor: 'var(--primary-color-variant-lighter)', borderRadius: '20px 0px 0px 20px'}:{}} onClick={() => handleSetChosenCharacterClick(character.id)}>
                            <img className='character-in-story-img' src={character.imageUrl} alt=''></img> 
                            {character.name}
                        </div>

                         <button className='character-info-btn' onClick={() => handleModalCharacterInfoOpenClick(character)}>
                            <span className="material-icons">info</span>
                         </button>
                    </li>))}
                </ul>
            </div>
            {isModalOpen ? <KickUser storyId={id} close={handleModalCloseClick} user={userData}/> : null}
            {isModalReportOpen ? <ReportUser storyId={id} close={handleModalReportCloseClick} user={userData}/> : null}
            {isModalCharacterInfoOpen ? <CharacterInfo close={handleModalCharacterInfoCloseClick} character={characterData}/> : null}
        </aside>
    )
}

export default StoryInfo;