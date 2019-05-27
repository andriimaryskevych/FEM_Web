import { SET_MATERIAL } from '../actions/action-types';

const INITIAL_STATE = {
    puasson: 0.3,
    yung: 1
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case SET_MATERIAL:
            const { puasson, yung } = action.payload;

            return {
                puasson,
                yung
            };
        default:
            return state;
    }
};
