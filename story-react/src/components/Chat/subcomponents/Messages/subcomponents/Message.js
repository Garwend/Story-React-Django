import React, {forwardRef} from "react";

import './Message.css';

const Message = ({id,text, user, character, userIsAuthor}, ref) => {
    const message = JSON.parse(`{"result": [${text}]}`)
    if (userIsAuthor) {
        return (
            <div ref={ref} className='my-message-wrap'>
                <div className='message-bottom-part'>
                    <div style={{textAlign:'end'}} className='message-author-name'>
                        {character !== null ?
                        <span>{character.name + '  '}  ({user.username})</span>
                        : <span>{user.username}</span>}
                        
                    </div>
                    <p className='my-message'>
                        {message.result.map((messagePart, index) => {
                            if (messagePart.messageType === 0) {
                                return messagePart.messagePart
                            } else {
                                return <span key={`${id}_${index}`} className='action-message-part'>{'*' + messagePart.messagePart + '*'}</span>
                            }
                        })}
                    </p>
                </div>
                <div className='message-author-wrap'>
                    {character !== null ?
                    <img className='message-author-profile-image' src={character.imageUrl} alt=""/>
                    : <img className='message-author-profile-image' src={user.imageUrl} alt=""/>}
                </div>
            </div>
        )
    }else {
        return (
            <div ref={ref} className='message-wrap'>
                <div className='message-author-wrap'>
                    {character !== null ?
                    <img className='message-author-profile-image' src={character.imageUrl} alt=""/>
                    : <img className='message-author-profile-image' src={user.imageUrl} alt=""/>}
                </div>
                <div className='message-bottom-part'>
                    <div className='message-author-name'>
                        {character !== null ?
                        <span>{character.name + '  '}  ({user.username})</span>
                        : <span>{user.username}</span>}
                    </div>
                    <p className='message'>
                    {message.result.map((messagePart, index) => {
                            if (messagePart.messageType === 0) {
                                return messagePart.messagePart
                            } else {
                                return <span key={`${id}_${index}`} className='action-message-part'>{'*' + messagePart.messagePart + '*'}</span>
                            }
                        })}
                    </p>
                </div>
            </div>
        )
    }

}

export default forwardRef(Message);