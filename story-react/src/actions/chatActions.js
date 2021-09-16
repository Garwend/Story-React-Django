import { setGlobalError } from "./errorActions";

export const getMessages = (storyId, setMessages,messagesWrapRef, theOldestMessageId, setHasMore,setIsLoading,setError) => (dispatch) => {

    let data = JSON.stringify({query: `
    query {
        messages(storyId:${storyId}, ${theOldestMessageId !== 0 ? `lastId:${theOldestMessageId}`:''}) {
          id
          text
          user {
            id
            username
            imageUrl
          }
          character {
            id
            name
            imageUrl
          }
          userIsAuthor
          createdAt
        }
      }
    `})

    setIsLoading(true)

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
            if (data.errors !== undefined) {
              dispatch(setGlobalError())
            }else {
              if (theOldestMessageId === 0) {
                setMessages(data.data.messages.reverse())
                messagesWrapRef.current.scrollTop = messagesWrapRef.current.scrollHeight
              } else {
                const reversedMessages = data.data.messages.reverse()
                setMessages(prev => [...reversedMessages, ...prev])
              }
              
              if(data.data.messages.length < 16) {
                setHasMore(false)
              } else {
                setHasMore(true)
              }
            }
            
            setIsLoading(false)
            
        },
        (error) => {
            console.log(error)
            setIsLoading(false)
            setError(true)
        }
    )

}

export const sendMessage = (storyId, text, chosenCharacter) => (dispatch) => {
    let data = JSON.stringify({query: `
    mutation {
        createMessage(storyId:${Number(storyId)}, text:"${text}") {
          success
        }
      }
    `})

    if(chosenCharacter !== null) {
        data = JSON.stringify({query: `
        mutation {
            createMessage(storyId:${Number(storyId)}, text:"${text}", characterId:${chosenCharacter}) {
              success
            }
          }
        `})
    }

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: data,
    })
    .then(data => data.json())
    .then(
        data => {
          if (data.errors !== undefined) {
            dispatch(setGlobalError())
          }
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}

export const getMessagesAfterLostConnection = (storyId, messageId, setMessages, setIsReconnecting) => (dispatch) => {
  const data = JSON.stringify({query: `
  query {
    messagesAfterLostConnection(storyId:${storyId}, messageId:${messageId}) {
      id
      text
      user {
        id
        username
        imageUrl
      }
      character {
        id
        name
        imageUrl
      }
      userIsAuthor
      createdAt
    }
  }
  `})

  fetch('http://localhost:8000/api/graphql', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    credentials: 'include',
    body: data,
  })
  .then(data => data.json())
  .then(
      data => {
          console.log(data)
          setIsReconnecting(null)
          const reversedMessages = data.data.messagesAfterLostConnection.reverse()
          setMessages(prev => [...prev, ...reversedMessages])
      },
      (error) => {
          dispatch(setGlobalError());
      }
  )

}