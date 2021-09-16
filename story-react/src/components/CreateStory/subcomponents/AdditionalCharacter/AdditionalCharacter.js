import React from 'react';
import "./AdditionalCharacter.css";

const AdditionalCharacter = ({id, imageUrl, name, characterList = [], setCharacterList = null}) => {
    const handleSelectCharacter = () => {
        if (characterList.includes(id)) {
            setCharacterList(prevList => prevList.filter(element => element !== id))
        } else {
            setCharacterList(prevList => [...prevList, id])
        }
        
    }

    if (setCharacterList !== null) {
        return (
            <div onClick={handleSelectCharacter} style={characterList.includes(id) ? {backgroundColor: 'var(--primary-color-variant-lighter)', border: '3px solid var(--primary-color)'} : null} className='additional-character'>
                <img className='additional-character-image' src={imageUrl} alt=""/>
                <p className='additional-character-name'>{name}</p>
            </div>
        )
    } else {
        return (
            <div className='additional-character' style={{marginRight:'12px'}}>
                <img className='additional-character-image' src={imageUrl} alt=""/>
                <p className='additional-character-name'>{name}</p>
            </div>
        )
    }
    
}

export default AdditionalCharacter;