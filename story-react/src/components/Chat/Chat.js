import React, {useState, useEffect} from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { validTokenRequiredFetch } from "../../actions/userActions";
import { getStory } from "../../actions/storyActions";
import MessageForm from './subcomponents/MessageForm/MessageForm';
import Messages from './subcomponents/Messages/Messages';
import StoryInfo from './subcomponents/StoryInfo/StoryInfo';
import StoryPlot from "./subcomponents/StoryPlot/StoryPlot";
import LeaveOrDeleteStory from "./subcomponents/LeaveOrDeleteStory/LeaveOrDeleteStory";
import SpinnerLoader from '../SpinnerLoader/SpinnerLoader';
import StoryDeleteModal from "./subcomponents/StoryDeleteModal/StoryDeleteModal";
import UserIsKicked from "./subcomponents/UserIsKicked/UserIsKicked";
import './Chat.css'

const Chat = ({storyListVisibleClick, isVisibleStoryList}) => {
    const {id} = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [story, setStory] = useState({});
    const [isStorPlotModalOpen, setIsStoryPlotModalOpen] = useState(false);
    const [isLeaveOrDeleteModalOpen, setIsLeaveOrDeleteModalOpen] = useState(false);
    const [isStoryDeleteModalOpen, setIsStoryDeleteModalOpen] = useState(false); 
    const [isStoryInfoHiddenOnMobile, setIsStoryInfoHiddenOnMobile] = useState(true); 
    const [isUserKicked, setIsUserKicked] = useState(false); 
    const [chosenCharacter, setChosenCharacter] = useState(null); 

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(()=>{
        dispatch(validTokenRequiredFetch(getStory(id, setStory, setIsLoaded, history)))
    },[id, dispatch, history])

    if (isStoryDeleteModalOpen) {
        return <StoryDeleteModal />
    }else if (isUserKicked) {
        return <UserIsKicked />
    } else {
        if (!isLoaded) {
            return (
            <div style={{height: '100%', flexGrow: 1, position:'relative'}}>
                <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>
                    <SpinnerLoader />
                </div>
            </div>
            )
        } else {
            return (
                <div style={{height: '100%', flexGrow: 1}}>
                    <header className='story-header'>
                        {/* <button onClick={storyListVisibleClick}>
                            <span className="material-icons">
                                {isVisibleStoryList ? 'arrow_back' : 'arrow_forward'}
                            </span>
                        </button> */}
                        <span className='story-title'>{story.title}</span>
                        <button onClick={() => setIsStoryPlotModalOpen(true)} className='story-info-btn'>
                            <span className="material-icons">info</span>
                        </button>
                        <button onClick={() => setIsLeaveOrDeleteModalOpen(true)} className='button-style'>
                            {story.userIsAuthor ? "usuń" : 'wyjdź' }
                        </button>
                        <button onClick={() => setIsStoryInfoHiddenOnMobile(prev => !prev)} className='show-story-info-button'>
                            <span className="material-icons">menu</span>
                        </button>
                    </header>
                    <div style={{height: 'calc(100% - 60px)', display:'flex', flexDirection:'row', position:'relative'}}>
                        <section style={{height: '100%', flexGrow: '1', position:'relative'}}>
                            <Messages storyId={id} setStory={setStory} setDeleteModal={setIsStoryDeleteModalOpen} setIsUserKicked={setIsUserKicked}/>
                            <MessageForm storyId={id} chosenCharacter={chosenCharacter}/>
                        </section>
                        <StoryInfo {...story} chosenCharacter={chosenCharacter} setChosenCharacter={setChosenCharacter} isHidden={isStoryInfoHiddenOnMobile}/>
                    </div>
                    {isLeaveOrDeleteModalOpen ? <LeaveOrDeleteStory storyId={id} setIsModalOpen={setIsLeaveOrDeleteModalOpen} isLeave={story.userIsAuthor ? false : true} /> : null}
                    {isStorPlotModalOpen ? <StoryPlot plot={story.plot} setIsModalOpen={setIsStoryPlotModalOpen} /> : null}
                </div>
            )
        }
    }



    
}

export default Chat;