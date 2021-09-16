import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useDispatch } from "react-redux";
import { getMessages } from "../../../../actions/chatActions";
import { getStoryAfterReconnect } from "../../../../actions/storyActions";
import { validTokenRequiredFetch } from "../../../../actions/userActions";
import { deleteStory } from "../../../../actions/storyActions";
import Message from "./subcomponents/Message";
import SpinnerLoader from "../../../SpinnerLoader/SpinnerLoader";

import './Messages.css';

const Messages = ({storyId, setStory, setDeleteModal, setIsUserKicked}) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(null);
    const [theOldestMessageId, setTheOldestMessageId] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const dispatch = useDispatch();
    const messagesWrapRef = useRef(null);
    const wsRef = useRef(null);
    const observer = useRef(null);

    const lastMessageRef = useCallback(node => {
        if(isLoading) return
        
        if (observer.current !== null) observer.current.disconnect()
            
        observer.current = new IntersectionObserver(entries => {
            
            if (entries[0].isIntersecting && hasMore) {
                setTheOldestMessageId(messages[0].id)
            }
        })
        
        if (node) observer.current.observe(node)
        
    },[isLoading, hasMore, messages])

    useEffect(()=> {
        dispatch(validTokenRequiredFetch(getMessages(storyId, setMessages, messagesWrapRef, theOldestMessageId, setHasMore,setIsLoading,setError)))
    },[dispatch, storyId, messagesWrapRef, theOldestMessageId])

    useEffect(()=>{
        if (isReconnecting === true || isReconnecting === null) return
        let lastMessageId = 0
        if(messages.length > 0) {
            lastMessageId = messages[messages.length - 1].id
        }
        dispatch(validTokenRequiredFetch(getStoryAfterReconnect(storyId, lastMessageId, setStory, setMessages, setIsReconnecting, wsRef)))
    },[isReconnecting,dispatch, setStory, storyId, messages])

    useEffect(()=>{

        let isPaused = false;

        const connect = () => {
            const ws = new WebSocket(`wss://localhost:8000/ws/chat/stories/${storyId}`)
        

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
                    case "chat_message":
                        const isScrolledToTheBottom = messagesWrapRef.current.scrollHeight === messagesWrapRef.current.scrollTop + messagesWrapRef.current.clientHeight
    
                        setMessages(prev => [...prev, msg.data])
    
                        if (isScrolledToTheBottom) {
                            messagesWrapRef.current.scrollTop = messagesWrapRef.current.scrollHeight
                        }    
                        
                        break;
                    case "user_join_story":
                        setStory(prev => ({
                            ...prev,
                            usersInStory: [...prev.usersInStory, {...msg.data.user, isConnected: false}]
                        }))
                        break;
                    
                    case "user_leave_story":
                        setStory(prev => ({
                            ...prev,
                            usersInStory: prev.usersInStory.filter(user => Number(user.id) !== msg.data.user.id)
                        }))
                        break;    
    
                    case "user_join_story_chat":
                        ws.send(JSON.stringify({message_type: 'check_if_user_is_connected'}))
                        break;
    
                    case "user_is_connected":
                        setStory(prev => ({
                            ...prev,
                            author: Number(prev.author.id) === msg.data.user.id ? {...prev.author, isConnected: true} : {...prev.author},
                            usersInStory: prev.usersInStory.map(user => {
                                if (Number(user.id) === msg.data.user.id) {
                                    const newUser = user
                                    newUser.isConnected = true
                                    return newUser
                                }else {
                                    return user
                                }
                            })
                        }))
                        break;
                        
                    case "user_leave_story_chat":
                        setStory(prev => ({
                            ...prev,
                            author: Number(prev.author.id) === msg.data.user.id ? {...prev.author, isConnected: false} : {...prev.author},
                            usersInStory: prev.usersInStory.map(user => {
                                if (Number(user.id) === msg.data.user.id) {
                                    const newUser = user
                                    newUser.isConnected = false
                                    return newUser
                                }else {
                                    return user
                                }
                            })
                        }))
                        break;
                    
                    case 'delete_story':
                        isPaused = true;
                        ws.close();
                        setDeleteModal(true);
                        break;
                    
                    case 'kick_user_from_story_chat':
                        setStory(prev => ({
                            ...prev,
                            usersInStory: prev.usersInStory.filter(user => Number(user.id) !== msg.data.user.id)
                        }))
                        
                        if (msg.data.user_is_kicked){
                            dispatch(deleteStory(msg.data.story.id))
                            setIsUserKicked(true)
                        }
                        
                        break;

                    default:
                        break;
                }
            }
    
            ws.onclose = () => {
                console.log('close')
                console.log(isPaused)
                if (!isPaused) {
                    setTimeout(reconnect, 5000)
                } 
            }
    
            ws.onerror = err => {
                console.log(err)
            }
        }

        const reconnect = () => {
            console.log('reconnect')
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
    },[dispatch, storyId, setStory, setDeleteModal, setIsUserKicked])


    return (
        <>
            {isReconnecting ? <div className="reconnect-info"> <p>łączenie z czatem...</p> </div> : null}
            <div ref={messagesWrapRef} className='messages-wrap'>
                {isLoading ? <div className='spinner-loader-wrap'><SpinnerLoader /></div> : null}
                {error ? <p className='error-message'>coś poszło nie tak i nie możemy załadować starszych wiadomości</p> : null}
                {messages.map((message, index) => {
                    if(index === 3) {
                        return <Message ref={lastMessageRef} key={message.id} {...message} />
                    }else {
                        return <Message key={message.id} {...message} />
                    }
                    
                })}
            </div>
        </>
    )
}

export default Messages