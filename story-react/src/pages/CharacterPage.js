import React, {useEffect,useState} from 'react';
import {useParams} from "react-router-dom";
import { validTokenRequiredFetch } from "../actions/userActions";
import { getCharacter} from "../actions/characterActions";
import { useDispatch } from "react-redux";
import CharacterImageAndName from '../components/CharacterImageAndName/CharacterImageAndName';
import CharacterDescription from '../components/CharacterDescription/CharacterDescription';

import "./CharacterPage.css";

const CharacterPage = () => {
    const {id} = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [character,setCharacter] = useState({});
    
    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(validTokenRequiredFetch(getCharacter(id,setCharacter, setIsLoaded)))
    },[dispatch, id])
    
    if (isLoaded) {
        return (
            <div className='character-wrap'>
                <CharacterImageAndName {...character} setCharacter={setCharacter}/>
                <CharacterDescription characterStory={character.characterStory} characterAppearance={character.characterAppearance} characterTrait={character.characterTrait}/>
            </div>
        )
    } else {
        return (
        <div>
            <p>ładowanie...</p>
        </div>
        )
    }

}

export default CharacterPage;