import { CREATE_MESH } from '../actions/action-types';

const INITIAL_STATE = {
    sizeX: 100,
    sizeY: 100,
    sizeZ: 100,
    xAxisFEMCount: 3,
    yAxisFEMCount: 3,
    zAxisFEMCount: 3,
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case CREATE_MESH:
            const mesh = action.payload;
            return mesh;
        default:
            return state;
    }
};
