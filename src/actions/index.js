import { CREATE_MESH } from './action-types';

export function cretateMesh (meshParameters) {
    return {
        type: CREATE_MESH,
        payload: meshParameters
    }
};
