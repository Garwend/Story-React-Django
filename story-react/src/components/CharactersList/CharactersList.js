import React,{useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { validTokenRequiredFetch } from "../../actions/userActions";
import { getCharacters } from "../../actions/characterActions";

import Character from './subcomponents/Character';
import CreateCharacterForm from '../CreateCharacterForm/CreateCharacterForm';
import './CharactersList.css';

const CharactersList = () => {
    const characters = useSelector(state => state.characterReducer.characters);
    const isCharactersSet = useSelector(state => state.characterReducer.isCharactersSet);
    
    const [isLoaded, setIsLoaded] = useState(isCharactersSet);
    const [isModalOpen,setIsModalOpen] = useState(false);
    
    const charactersList = characters.map(character => <Character key={character.id} {...character}/>)

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = e => {
        if (e !== undefined){
            e.preventDefault();
        }
        setIsModalOpen(false);
    }

    const dispatch = useDispatch();

    useEffect(()=>{
        if(!isCharactersSet) {
            dispatch(validTokenRequiredFetch(getCharacters(setIsLoaded)))
        }

    },[isCharactersSet, dispatch])

    return (
        <React.Fragment>
            <section className='characters-wrap'>
                <div className='characters-title-wrap'>
                    <h1>Twoje postacie</h1>
                </div>
                <div className='characters'>
                    { isLoaded ? charactersList : null }
                    <button onClick={handleModalOpen} className='create-character'>
                        <span className="material-icons">add</span>
                    </button>
                </div>
            </section>
            {isModalOpen ? <CreateCharacterForm close={handleModalClose}/> : null}
        </React.Fragment>
        
    )
}

export default CharactersList;