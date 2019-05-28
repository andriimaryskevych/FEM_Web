import {
    ADD_PRESSURE,
    UPDATE_PRESSURE,
    DELETE_PRESSURE
} from '../actions/action-types';
import { getID } from '../helpers/fem';

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ADD_PRESSURE: {
            const { fe, part } = action.payload;
            const key = getID(fe, part);

            if (state[key]) {
                return {...state};
            }

            return {
                ...state,
                [key]: {
                    fe,
                    part,
                    pressure: 0.1
                }
            };
        }
        case UPDATE_PRESSURE: {
            const { id, value } = action.payload;
            const currentPressure = state[id];

            if (!currentPressure) {
                return state;
            }

            return {
                ...state,
                [id]: {
                    ...currentPressure,
                    pressure: value
                }
            }
        }
        case DELETE_PRESSURE: {
            const { id } = action.payload;
            const newState = { ...state };

            delete newState[id];

            return newState;
        }
        default:
            return state;
    }
};
