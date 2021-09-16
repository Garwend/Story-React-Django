import React from 'react';
import ReactDOM from 'react-dom';
import CharacterDescription from "../../../../../CharacterDescription/CharacterDescription";
import "./CharacterInfo.css";

const CharacterInfo = ({character, close}) => {
    return ReactDOM.createPortal((
    <div className='backdrop'>
        <div className='modal'>
            <div className='character-info-wrap'>
                <div className='character-info'>
                    <div className='character-info-image-name'>
                        <img src={character.imageUrl} alt=""/>
                        <p>{character.name}</p>
                    </div>
                    <div>
                        {<CharacterDescription 
                        characterStory={character.characterStory} 
                        characterAppearance={character.characterAppearance} 
                        characterTrait={character.characterTrait} />}
                    </div>
                </div>
                <div style={{textAlign:'center', padding:'5px'}}>
                    <button style={{width:'50%'}} className='button-style' onClick={close}>ok</button>
                </div>
            </div>
        </div>
    </div>
    ), document.body)
}

export default CharacterInfo;