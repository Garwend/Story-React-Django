import { setGlobalError } from "./errorActions";

export const ADD_CHARACTER = 'ADD_CHARACTER';
export const DELETE_CHARACTER = 'DELETE_CHARACTER';
export const UPDATE_CHARACTER = 'UPDATE_CHARACTER';
export const SET_CHARACTERS = 'SET_CHARACTERS';

export const addCharacter = (payload) => ({
    type: ADD_CHARACTER,
    payload: payload,
})

export const updateCharacter = (payload) => ({
    type: UPDATE_CHARACTER,
    payload: payload,
})

export const deleteCharacter = (payload) => ({
    type: DELETE_CHARACTER,
    payload: payload,
})

export const setCharacters = (payload) => ({
    type: SET_CHARACTERS,
    payload: payload,
})

export const getCharacter = (id, setCharacter, setIsLoaded) => (dispatch) => {
    const data = JSON.stringify({query: `
    query {
        characterById(id: ${id}) {
            id
            name
            characterStory
            characterAppearance
            characterTrait
            imageUrl  
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
                if (data.data.characterById !== null) {
                    setCharacter(data.data.characterById);
                    setIsLoaded(true);
                } else {
                    setIsLoaded(false);
                }
            }
            
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}

export const getCharacters = (setIsLoaded) => (dispatch) => {
    const data = JSON.stringify({query: `
    query {
        characters {
          id
          name
          imageUrl
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
                console.log(data.data.characters)
                dispatch(setCharacters(data.data.characters));
                setIsLoaded(true);
            }
            
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}

export const createCharacter = (characterName, characterStory, characterTrait,characterAppearance, image, close) => (dispatch) => {
    const formData = new FormData();

    if (image !== null) {
        formData.append('image', image);
    }

    const graphqlMutation = `
    mutation {
        createCharacter(name:"${characterName}",characterStory:"${characterStory}",characterTrait:"${characterTrait}",characterAppearance:"${characterAppearance}"){
          character {
              id
              name
              imageUrl
          }
        }
      }
    `

    formData.append('query', graphqlMutation);

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
    .then(data => data.json())
    .then(
        data => {
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            } else {
                dispatch(addCharacter(data.data.createCharacter.character))
                close()
            }
            
        },
        (error) => {
            console.log(error)
            dispatch(setGlobalError());
        }
    )
}

export const editCharacter = (id, characterName, characterStory, characterTrait,characterAppearance,isImageDelete, image, setCharacter, close) => (dispatch) => {
    const formData = new FormData();

    if (image !== null) {
        formData.append('image', image);
    }

    const graphqlMutation = `
    mutation {
        updateCharacter(id:${id},name:"${characterName}",characterStory:"${characterStory}",characterTrait:"${characterTrait}",characterAppearance:"${characterAppearance}", isImageDelete:${isImageDelete}){
          character {
            id
            name
            characterStory
            characterAppearance
            characterTrait
            imageUrl  
          }
        }
      }
    `

    formData.append('query', graphqlMutation);

    fetch('http://localhost:8000/api/graphql', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
    .then(data => data.json())
    .then(
        data => {
            if (data.errors !== undefined) {
                dispatch(setGlobalError())
            } else {
                dispatch(updateCharacter(data.data.updateCharacter.character))
                setCharacter(data.data.updateCharacter.character)
                close()
            }
            
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}

export const deleteCharacterFetch = (id, history) => (dispatch) => {
    const data = JSON.stringify({query:`
    mutation {
        deleteCharacter (id: ${id}){
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
                if (data.data.deleteCharacter.success === true) {
                    dispatch(deleteCharacter(id))
                    history.push(`/`)
                } else {
                    dispatch(setGlobalError());
                }
            }
            
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}

export const getDefaultCharacterImageUrl = (setDefaultImage, setImagePreview) => (dispatch) => {
    const data = JSON.stringify({query:'query { defaultCharacterImageUrl }'});
    
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
            setDefaultImage(data.data.defaultCharacterImageUrl);
            setImagePreview(data.data.defaultCharacterImageUrl);
        },
        (error) => {
            dispatch(setGlobalError());
        }
    )
}