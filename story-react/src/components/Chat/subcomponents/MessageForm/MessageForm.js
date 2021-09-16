import React, {useState} from 'react';
import { useDispatch } from "react-redux";
import { sendMessage } from "../../../../actions/chatActions";
import { validTokenRequiredFetch } from "../../../../actions/userActions";
import './MessageForm.css';

const MessageForm = ({storyId, chosenCharacter}) => {
    const [text, setText] = useState('');
    const [messageType, setMessageType] = useState(0);
    const [messages, setMessages] = useState([]);

    const handleTextChange = e => {
        setText(e.target.value);
        if (messages.length === 0){
            setMessages(prev => [...prev, {message: e.target.value, messageType, isSelected: true, key: new Date().getTime()}])
        } else {
            const newMessages = [...messages];
            const selectedMessageIndex = newMessages.map(message=> message.isSelected).indexOf(true);

            if ((selectedMessageIndex !== -1 && messages[selectedMessageIndex].messageType === 0 && messageType === 0) || (selectedMessageIndex !== -1 && messages[selectedMessageIndex].messageType === 1 && messageType === 1)) {
                newMessages[selectedMessageIndex].message = e.target.value;
                setMessages(newMessages);
            }else {
                if (selectedMessageIndex !== -1){
                    newMessages[selectedMessageIndex].isSelected = false;
                }
                setMessages([...newMessages, {message: e.target.value, isSelected: true, messageType, key: new Date().getTime()}])
            }
            

            if (e.target.value.length === 0) {
                let newMessages = [...messages];
                newMessages = newMessages.filter(message => message.message.length !== 0);
                let lastMessagetype;
                for (let i = 0; i < newMessages.length; i++) {
                    if (i === 0){
                        lastMessagetype = newMessages[i].messageType;
                    } else {
                        if (newMessages[i].messageType === lastMessagetype) {
                            newMessages[i].message = newMessages[i - 1].message  + ' ' +  newMessages[i].message;
                            newMessages.splice(i-1,1);
                            break
                        }else {
                            lastMessagetype = newMessages[i].messageType;
                        }
                    }
                }
                setMessages(newMessages)
                
            }

        }
    };

    const handleMessageTypeClick = () => {
        if (messageType === 0) {
            setMessageType(1);
            if (messages.length > 0 && messages[messages.length - 1].messageType === 1){
                const newMessages = [...messages];
                const selectedMessageIndex = newMessages.map(message=> message.isSelected).indexOf(true);
                if (selectedMessageIndex !== -1) {
                    newMessages[selectedMessageIndex].isSelected = false;
                }
                newMessages[newMessages.length - 1].isSelected = true;
                setText(newMessages[newMessages.length - 1].message);
                setMessages(newMessages);
            }else {
                setText('');
            }
            
        }else {
            setMessageType(0);
            if (messages.length > 0 && messages[messages.length - 1].messageType === 0){
                const newMessages = [...messages];
                const selectedMessageIndex = newMessages.map(message=> message.isSelected).indexOf(true);
                if (selectedMessageIndex !== -1) {
                    newMessages[selectedMessageIndex].isSelected = false;
                }
                newMessages[newMessages.length - 1].isSelected = true;
                setText(newMessages[newMessages.length - 1].message);
                setMessages(newMessages);
            }else {
                setText('');
            }
        }
    }

    const setTypeTalk = (key,messageType) => {
        const newMessages = [...messages];
        const clickedElementIndex = newMessages.map(message=> message.key).indexOf(key);
        const selectedMessageIndex = newMessages.map(message=> message.isSelected).indexOf(true);
        if(selectedMessageIndex !== -1) {
            newMessages[selectedMessageIndex].isSelected = false;
        }
        if (clickedElementIndex !== -1) {
            newMessages[clickedElementIndex].isSelected = true;
            setText(newMessages[clickedElementIndex].message)
        }
        setMessages(newMessages);
        setMessageType(messageType)
    };

    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();
        if (messages[0]!== undefined) {
            const messageData = messages.map(message => (`{\\"messagePart\\": \\"${encodeURI(message.message)}\\", \\"messageType\\": ${message.messageType}}`))
            console.log(`{\\"message\\": [${messageData}]}`)
            dispatch(validTokenRequiredFetch(sendMessage(storyId, `{\\"message\\": [${messageData}]}`, chosenCharacter)));
            setMessages([]);
            setText('');
        }
    }

    const messagesElements = messages.map(message => (
        <div style={message.isSelected ? message.messageType === 0 ? {color:"white", backgroundColor:'var(--primary-color)'} : {color:"white", backgroundColor:'var(--secondary-color)'} : {}} onClick={() => setTypeTalk(message.key, message.messageType)} className={message.messageType === 0 ? 'w-message-type-talk':'w-message-type-action'} key={message.key}>
            <p>{message.message.length <= 5 ? message.message : message.message.slice(0,5) + '...'}</p>
        </div>
    ))

    return (
        <div className='message-form-wrap'>
            <div className='w-messages-wrap'>
                {messagesElements}
            </div>
            <form className='message-form' onSubmit={handleSubmit}>
                <input style={messageType === 1 ? {borderColor:'var(--secondary-color)'}:{}} placeholder='Napisz wiadomość...' type="text" value={text} onChange={handleTextChange}/>
                <div onClick={handleMessageTypeClick} style={messageType === 0 ? {color: 'var(--secondary-color)'}:{color: 'var(--primary-color)'}} className='message-type'>{messageType === 0 ? <span className="material-icons">directions_run</span> : <span className="material-icons">record_voice_over</span>}</div>
                <button className='send-message-btn' type='submit'><i className="material-icons">send</i></button>
            </form>
        </div>
    )
}

export default MessageForm;