import React from 'react';

import './CharacterDescription.css';

const CharacterDescription = ({characterStory,characterAppearance,characterTrait}) => {
    const characterAppearanceList = characterAppearance.split(',').map((text, index) => <li key={index}>- {text}</li>)
    const characterTraitList = characterTrait.split(',').map((text, index) => <li key={index}>- {text}</li>)
    return (
        <section className='character-description'>     
            {characterStory.length !== 0 ? 
            <article>
                <header className='character-description-title'>Historia postaci</header>
                <hr className="divider-solid"/>
                <p style={{whiteSpace:'pre-line',wordBreak:'break-word'}}>{characterStory}</p>
            </article>
            : null} 

            {characterAppearance.length !== 0 ? 
            <article>
                <header className='character-description-title'>Wygląd postaci</header>
                <hr className="divider-solid"/>
                <ul>
                    {characterAppearanceList}
                </ul>
            </article>
            : null}
            
            {characterTrait.length !== 0 ? 
            <article>
                <header className='character-description-title'>Cechy charakteru</header>
                <hr className="divider-solid"/>
                <ul>
                    {characterTraitList}
                </ul>
            </article>
            : null} 

        </section>
    )
};

export default CharacterDescription;