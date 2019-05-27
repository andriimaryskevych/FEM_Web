import { HOVER_FE } from '../actions/action-types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case HOVER_FE:
            return action.payload;
        default:
            return state;
    }
};
