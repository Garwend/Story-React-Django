import { ADD_STORY, DELETE_STORY, SET_STORIES } from "../actions/storyActions";
import { LOGOUT } from "../actions/userActions";

const defaultState = {
    isStoriesSet: false,
    stories: [],
}

const storyReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_STORY:
            return {
                isStoriesSet: state.isStoriesSet,
                stories: [...state.stories, action.payload]
            }
        case DELETE_STORY:
            return {
                isStoriesSet: true,
                stories: state.stories.filter(story => Number(story.id) !== Number(action.payload)),
            }
        case SET_STORIES:
            return {
                isStoriesSet: true,
                stories: action.payload,
            }
        case LOGOUT:
            return defaultState;

        default:
            return state;
    }
}

export default storyReducer;