import { SET_MATERIAL } from '../actions/action-types';
import {
    CUSTOM_MATERIAL,
} from '../constants';

const INITIAL_STATE = {
    material: CUSTOM_MATERIAL,
    value: {
        puasson: 0.3,
        young: 1
    }
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case SET_MATERIAL:
            const {
                material,
                value,
            } = action.payload;

            return {
                material,
                value
            };
        default:
            return state;
    }
};
