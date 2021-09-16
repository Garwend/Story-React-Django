import { setGlobalError } from "./errorActions";

export const ADD_STORY = 'ADD_STORY';
export const DELETE_STORY = 'DELET_STORY';
export const SET_STORIES = 'SET_STORIES';

export const addStory = (payload) => ({
    type: ADD_STORY,
    payload: payload,
})

export const deleteStory = (payload) => ({
    type: DELETE_STORY,
    payload: payload,
})

export const setStories = (payload) => ({
    type: SET_STORIES,
    payload: payload,
})

export const getStory = (id, setStory, setIsLoaded, history) => (dispatch) => {
    const data = JSON.stringify({query: `
        query {
            storyById(id: ${id}) {
                id
                author {
                  id  
                  username
                  imageUrl
                }
                title
                plot
                numberOfUsersInStory
                usersCount
                usersInStory {
                    id
                    username
                    imageUrl
                }
                additionalCharacters {
                    id
                    name
                    imageUrl
                    characterStory
                    characterAppearance
                    characterTrait
                }
                userIsAuthor
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
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            } else {
                if (data.data.storyById !== null) {
                    const story = data.data.storyById
                    const author = story.author
                    author.isConnected = false
                    const users = story.usersInStory.map(user => {
                        const newUser = user
                        newUser.isConnected = false
                        return newUser
                    })
                    story.author = author
                    story.usersInStory = users
                    setStory(story)
                    setIsLoaded(true)
                } else {
                    history.push('/')
                }
            }
            
            
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
}

export const getStoryAfterReconnect = (storyId, messageId, setStory, setMessages, setIsReconnecting, wsRef) => (dispatch) => {
    const data = JSON.stringify({query: `
    query {
        storyByIdAfterReconnect(id:${storyId}) {
          usersCount
          usersInStory {
            id
            username
            imageUrl
          }
          messagesAfterReconnect(messageId:${messageId}) {
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

            const users = data.data.storyByIdAfterReconnect.usersInStory.map(user => {
                const newUser = user
                newUser.isConnected = false
                return newUser
            })
            setStory(prev => ({
                ...prev,
                usersCount: data.data.storyByIdAfterReconnect.usersCount,
                usersInStory: users,
            }))
            const reversedMessages = data.data.storyByIdAfterReconnect.messagesAfterReconnect.reverse()
            setMessages(prev => [...prev, ...reversedMessages])

            if (wsRef.current !== null) wsRef.current.send(JSON.stringify({message_type: 'user_reconnect'}))
        },
        (error) => {
            setIsReconnecting(null)
            console.log(error)
            dispatch(setGlobalError());
        }
    )
}

export const getStories = (setIsLoaded) => (dispatch) => {
    const data = JSON.stringify({query:`
        query {
            stories {
              id
              title
              numberOfUsersInStory
              language
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
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            }else {
                dispatch(setStories(data.data.stories.reverse()))
                setIsLoaded(true)
            }
            
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
}

export const createStory = (title, plot, numberOfUsers, language, femaleNumber, maleNumber, characterList, history) => (dispatch) => {
    const data = JSON.stringify({query: `
            mutation {
                createStory(title: "${title}", plot:"${plot}", language: "${language}", numberOfUsersInStory: ${Number(numberOfUsers)}, femaleNumber:${femaleNumber}, maleNumber: ${maleNumber}, additionalCharacters:"${characterList.toString()}") {
                  story {
                    id
                    title
                    numberOfUsersInStory
                    language
                  }
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
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            }else {
                dispatch(addStory(data.data.createStory.story))
                history.push(`story/${data.data.createStory.story.id}`)
            }
            
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}

export const deleteStoryFetch = (id, history) => (dispatch) => {
    const data = JSON.stringify({query: `
    mutation {
        deleteStory(id:${id}) {
          success
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
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            }else {
                if (data.data.deleteStory.success) {
                    history.push(`/`)
                    dispatch(deleteStory(id))
                } else {
                    dispatch(setGlobalError());
                }
            }
            
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
} 

export const findStories = (language, setStoriesFound, setIsLoaded = null, setIsReconnecting = null) => (dispatch) => {
    const data = JSON.stringify({query: `
    query {
        findStories (language: "${language}") {
          id
          title
          plot
          numberOfUsersInStory
          usersCount
          author {
              username
          }
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
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            }else {
                if(setIsReconnecting !== null) setIsReconnecting(null)

                setStoriesFound(data.data.findStories)

                if (setIsLoaded !== null) setIsLoaded(true)
            }
            
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}

export const joinStory = (id, history) => (dispatch) => {
    const data = JSON.stringify({query: `
    mutation {
        joinStory(id:${id}) {
          success
          story {
            id
            title
            numberOfUsersInStory
            language
          }
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
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            } else {
                if (data.data.joinStory.success === true) {
                    dispatch(addStory(data.data.joinStory.story))
                    history.push(`/story/${id}`)
                }else {
                    dispatch(setGlobalError());
                }
            }
            
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )

}

export const leaveStory = (id, history) => (dispatch) => {
    const data = JSON.stringify({query: `
    mutation {
        leaveStory(id:${id}) {
          success
          storyId
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
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            } else {
                if (data.data.leaveStory.success) {
                    dispatch(deleteStory(data.data.leaveStory.storyId))
                    history.push(`/`)
                } else {
                    dispatch(setGlobalError());
                }
            }
            
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
}

export const kickUserFromStory = (storyId, userId, close) => (dispatch) => {
    const data = JSON.stringify({query: `
    mutation {
        kickUserFromStory(storyId:${storyId}, userId: ${userId}) {
          success
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
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            } else {
                if (data.data.kickUserFromStory.success) {
                    close();
                } else {
                    console.warn('upss')
                }
            }
            
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}