import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { validTokenRequiredFetch } from "../../../actions/userActions";
import { findStories } from "../../../actions/storyActions";
import StoryFound from './StoryFound';

import './StoriesFound.css'

const StoriesFound = ({stories, setStories, setIsLoaded, language}) => {
    const [filter, setFilter] = useState('');
    const [storiesFiltered, setStoriesFiltered] = useState([]);
    const [isReconnecting, setIsReconnecting] = useState(null);
    const wsRef = useRef(null);
    const dispatch = useDispatch();

    const handleFilterChange = e => {
        setFilter(e.target.value)
        setStoriesFiltered(stories.filter(story => story.title.includes(e.target.value)))
    }


    useEffect(() => {
        if (isReconnecting === true || isReconnecting === null) return
        dispatch(validTokenRequiredFetch(findStories(language, setStories, null, setIsReconnecting)))
    },[isReconnecting, dispatch, language, setStories])
    
    
    useEffect(() => {
        let isPaused = false;

        const connect = () => {
            const ws = new WebSocket(`wss://localhost:8000/ws/found/stories/${language}`)

            ws.onopen = () => {
                console.log('open')
                wsRef.current = ws;
                setIsReconnecting(prev => {
                    if (prev === true) {
                        return false
                    } else {
                        return prev
                    }
                })
            }
    
            ws.onmessage = event => {
                console.log(JSON.parse(event.data))
                const msg = JSON.parse(event.data)
                
                switch (msg.message_type) {
                    case "add_story":
                        setStories(prev => [msg.data, ...prev])
                        break;
                    
                    case 'delete_story':
                        setStories(prev => prev.filter(story => Number(story.id) !== Number(msg.data.id)))
                        break;
                    
                    case 'user_join_story':
                        if (msg.data.is_story_available){
                            setStories(prev => prev.map(story => {
                                if (Number(story.id) !== Number(msg.data.id)) {
                                    return story
                                } else {
                                    const newStory = story
                                    newStory.usersCount = msg.data.user_count
                                    return newStory
                                }
                            }))
                        } else {
                            setStories(prev => {
                                const newStories = [...prev]
                                return newStories.filter(story => Number(story.id) !== Number(msg.data.id))
                            })
                        }
                        break;
    
                    case 'kick_user_from_story':
                    case "user_leave_story":
                        if (msg.data.is_story_available) {
                            setStories(prev => prev.map(story => {
                                if (Number(story.id) === Number(msg.data.story.id)) {
                                    return msg.data.story
                                } else {
                                    return story
                                }
                            }))
                        } else {
                            setStories(prev => [msg.data.story, ...prev])
                        }
                        break;
    
                    default:
                        break;
                }
            }
    
            ws.onclose = () => {
                console.log('close')
                if (!isPaused) {
                    setTimeout(reconnect, 5000)
                } 
            }
    
            ws.onerror = err => {
                console.log(err)
            }
        }
        
        const reconnect = () => {
            if (wsRef.current === null || wsRef.current.readyState === WebSocket.CLOSED) {
                setIsReconnecting(true)
                connect();
            }
        }

        connect();


        return () => {
            console.log('close')
            if (wsRef.current !== null) {
                isPaused = true;
                wsRef.current.close();
            }
        };

    },[language, setStories])

    return ReactDOM.createPortal((
        <div className='backdrop'>
            <div className='modal'>
                <div className='stories-found-wrap' style={{position:'relative'}}>
                    {isReconnecting ? <p className='reconnect-info'>nawiązywanie połączenia...</p> : null}
                    <div style={{height:'10%'}}>
                        <input onChange={handleFilterChange} value={filter} className='stories-found-search' type="text" placeholder='Szukaj'/>
                    </div>
                    <ul className='stories-found'>
                        {filter === '' ? 
                        stories.map(story => <StoryFound key={story.id} {...story} />) 
                        : storiesFiltered.length === 0 ? 
                        <p style={{textAlign:'center', fontWeight:'700',color: 'var(--font-color)'}}>Brak wyników wyszukiwania</p> 
                        : storiesFiltered.map(story => <StoryFound key={story.id} {...story} />) }
                    </ul>
                </div>
            </div>
            <button className='close-stories-found' onClick={() => setIsLoaded(false)}><span className="material-icons">close</span></button>
        </div>
    ),document.body)
}

export default StoriesFound;