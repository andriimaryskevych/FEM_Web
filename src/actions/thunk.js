import {
    CREATE_MESH,
    CHANGE_STATE,
} from './action-types';
import { MESH_CREATION } from '../helpers/state';

const cretateMeshAction = mesh => ({
    type: CREATE_MESH,
    payload: mesh
});

const changeState = state => ({
    type: CHANGE_STATE,
    payload: state
});

export const createMesh = mesh => dispatch => {
    dispatch(cretateMeshAction(mesh));
    dispatch(changeState(MESH_CREATION));
};