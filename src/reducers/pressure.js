import { ADD_PRESSURE } from '../actions/action-types';

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case ADD_PRESSURE:
            const { fe, part } = action.payload;
            const key = `fe_${fe}:${part}`;

            if (state[key]) {
                return {...state};
            }

            return {
                ...state,
                [key]: {
                    id: key,
                    fe,
                    part,
                    pressure: 0.1
                }
            };
        default:
            return state;
    }
};
