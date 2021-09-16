import { SET_USER, LOGOUT } from '../actions/userActions';

const defaultState = {
    isLoggedIn: null,
    user: {},
}

const userReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                isLoggedIn: true,
                user: {...action.payload}
            };
        case LOGOUT:
            return {
                isLoggedIn: false,
                user: {},
            };
        default:
            return state;
    }
}

export default userReducer;