import { ADD_CHARACTER, UPDATE_CHARACTER, DELETE_CHARACTER, SET_CHARACTERS } from "../actions/characterActions";
import { LOGOUT } from "../actions/userActions";

const defaultState = {
    isCharactersSet: false,
    characters: [],
}

const characterReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_CHARACTER:
            return {
                isCharactersSet: state.isCharactersSet,
                characters: [action.payload, ...state.characters]
            }
        case UPDATE_CHARACTER:
            return {
                isCharactersSet: state.isCharactersSet,
                characters: state.characters.map(character => {
                    if (character.id !== action.payload.id) {
                        return character
                    } else {
                        return action.payload
                    }
                }),
            }
        case DELETE_CHARACTER:
            return {
                isCharactersSet: state.isCharactersSet,
                characters: state.characters.filter(character => character.id !== action.payload),
            }
        case SET_CHARACTERS:
            return {
                isCharactersSet: true,
                characters: action.payload,
            }
        case LOGOUT:
            return defaultState;
        
        default:
            return state;
    }
}

export default characterReducer;