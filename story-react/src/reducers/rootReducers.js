import {combineReducers} from 'redux';

import userReducer from './userReducer';
import storyReducer from "./storyReducer";
import characterReducer from "./characterReducer";
import errorReducer from "./errorReducer";

const rootReducer = combineReducers({
    userReducer,
    storyReducer,
    characterReducer,
    errorReducer
})

export default rootReducer;