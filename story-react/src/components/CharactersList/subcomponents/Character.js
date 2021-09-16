import React from 'react';
import {Link} from 'react-router-dom';
import './Character.css';
const Character = ({id,name,imageUrl}) => {
    return (
        <Link to={`/character/${id}`}>
            <article className='character'>
                <img className='character-image' src={imageUrl} alt=""/>
                <p className='character-name'>{name}</p>
            </article>
        </Link>
        
    )
}

export default Character;