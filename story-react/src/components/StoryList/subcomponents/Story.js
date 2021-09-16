import React from 'react';
import {Link} from 'react-router-dom';
import './Story.css';

const Story = ({id, title, language, numberOfUsersInStory}) => {
    return (
        <div className='story'>
            <section className='title-subtitle-wrap'>
                <h4>{title}</h4>
                <section className='story-subtitle'>
                    <p><span className="material-icons">language</span> {language}</p>
                    <p><span className="material-icons">people</span> {numberOfUsersInStory}</p>
                </section>
            </section>
            <aside className='join-story-wrap'>
                <Link className='join-story-link' to={`story/${id}`}>Dołącz</Link>
            </aside >
        </div>  
    );
};

export default Story;