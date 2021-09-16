import React, {useState} from 'react';
import StoriesFound from "./subcomponent/StoriesFound";
import { validTokenRequiredFetch } from "../../actions/userActions";
import { findStories } from "../../actions/storyActions";
import { useDispatch } from "react-redux";
import './FindStory.css'

const FindStory = () => {
    const [storyLanguage, setStoryLanguage] = useState('PL')
    const [isLoaded, setIsLoaded] = useState(false);
    const [stories, setStories] = useState([]);

    const dispatch = useDispatch();
    
    const handleLanguageSelectChange = e => {
        setStoryLanguage(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(validTokenRequiredFetch(findStories(storyLanguage, setStories, setIsLoaded)))
    }

    return (
        <div className='find-story-wrap'>
            <h3>Dołącz do historyjki</h3>
            <form className='find-story-form' onSubmit={handleSubmit}>
                <section className='find-story-inputs-wrap'>
                    <div className='find-story-language-wrap'>
                        <span>język: </span>
                        <select value={storyLanguage} onChange={handleLanguageSelectChange}         className='find-story-language-select'>
                            <option value='PL'>PL</option>
                            <option value='EN'>EN</option>
                        </select>
                    </div>
                </section>
                <button className='find-story-btn' type='submit'>Szukaj</button>
                {isLoaded ? <StoriesFound stories={stories} setIsLoaded={setIsLoaded} setStories={setStories} language={storyLanguage}/> : null}
            </form>
        </div>
    );
};

export default FindStory;