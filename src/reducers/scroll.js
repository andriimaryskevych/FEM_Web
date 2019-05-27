import { ADD_PRESSURE } from '../actions/action-types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case ADD_PRESSURE:
            return action.payload;
        default:
            return state;
    }
};
