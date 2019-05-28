import { ADD_PRESSURE } from '../actions/action-types';
import { getID } from '../helpers/fem';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case ADD_PRESSURE:
            const { fe, part} = action.payload;
            const id = getID(fe, part);

            return id;
        default:
            return state;
    }
};
