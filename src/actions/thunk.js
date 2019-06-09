import { CREATE_MESH } from './action-types';
import { MESH_CREATION } from '../helpers/state';
import { changeState } from './index';

const cretateMeshAction = mesh => ({
    type: CREATE_MESH,
    payload: mesh
});

export const createMesh = mesh => dispatch => {
    dispatch(cretateMeshAction(mesh));
    dispatch(changeState(MESH_CREATION));
};