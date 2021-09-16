import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { validTokenRequiredFetch } from "../../../../actions/userActions";
import { getCharacters } from "../../../../actions/characterActions";

import ReactDOM from 'react-dom';

import AdditionalCharacter from "../AdditionalCharacter/AdditionalCharacter";

import './SelectAdditionalCharacters.css';

const SelectAdditionalCharacters = ({close, setCharacterList, characterList}) => {
    const characters = useSelector(state => state.characterReducer.characters);
    const isCharactersSet = useSelector(state => state.characterReducer.isCharactersSet);
    const [isLoaded, setIsLoaded] = useState(isCharactersSet);

    const dispatch = useDispatch();

    useEffect(()=>{
        if(!isCharactersSet) {
            dispatch(validTokenRequiredFetch(getCharacters(setIsLoaded)))
        }

    },[isCharactersSet, dispatch])

    return ReactDOM.createPortal((
        <div className='second-backdrop'>
            <div className='modal'>
                <div className='select-additional-characters-wrap'>
                    <div className='select-additional-characters-list'>
                        {isLoaded ? 
                        characters.map(character => <AdditionalCharacter key={character.id} {...character} setCharacterList={setCharacterList} characterList={characterList}/>)
                        : null}
                    </div>
                    <div className="select-additional-character-close-btn-wraps">
                        <button onClick={close} style={{width: '60%'}} className='button-style'>ok</button>
                    </div>
                </div>
                    
            </div>
        </div>
    ), document.body)
}

export default SelectAdditionalCharacters;