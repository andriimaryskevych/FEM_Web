import { CHANGE_STATE } from '../actions/action-types';
import { INITIAL_STATE } from '../helpers/state';

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case CHANGE_STATE:
            return action.payload;
        default:
            return state;
    }
};
