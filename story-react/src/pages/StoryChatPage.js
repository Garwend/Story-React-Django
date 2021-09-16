import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat/Chat';
import './StoryChatPage.css';

const StoryChatPage = () => {
    const [isVisibleStoryList, setIsVisibleStoryList] = useState(true);
    const handleClick = () => setIsVisibleStoryList(prev => !prev);
    const {id} = useParams();
    return (
        <div className='chat-wrap'>
            {/* {isVisibleStoryList
            ?
            <div style={{width:'300px', flex: '0 0 300px', backgroundColor:'white', borderRight: '1px solid var(--border-color)'}}>
            </div> : null} */}
            
            <Chat key={id} storyListVisibleClick={handleClick} isVisibleStoryList={isVisibleStoryList}/>
        </div>
    )
}

export default StoryChatPage;