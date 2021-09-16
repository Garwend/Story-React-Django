import { SET_ERROR, REMOVE_ERROR } from "../actions/errorActions";

const defaultState = {
    error: false,
}

const errorReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_ERROR:
            return {
                error: true
            }
        case REMOVE_ERROR:
            return {
                error: false
            }
        
        default:
            return state;
    }
}

export default errorReducer;