import React, {useState, useEffect} from 'react';
import { validTokenRequiredFetch } from "../../actions/userActions";
import { getStories } from "../../actions/storyActions";
import { useDispatch, useSelector } from "react-redux";

import Story from './subcomponents/Story';
import SpinnerLoader from '../SpinnerLoader/SpinnerLoader';
import './StoryList.css';

const StoryList = () => {
    const stories = useSelector(state => state.storyReducer.stories);
    const isStoriesSet = useSelector(state => state.storyReducer.isStoriesSet);
    const [isLoaded, setIsLoaded] = useState(isStoriesSet);
    
    const dispatch = useDispatch();

    useEffect(()=>{
        if (!isStoriesSet) {
            dispatch(validTokenRequiredFetch(getStories(setIsLoaded)))
        }
        
    },[dispatch, isStoriesSet])
    
    return (
        <section style={!isLoaded ? {height:'300px'}: null} className='stories'>
            {!isLoaded ? <div style={{position:'absolute',top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}><SpinnerLoader /> </div> : stories.map(story => <Story key={story.id} {...story} />)}
        </section>
    )
}

export default StoryList;