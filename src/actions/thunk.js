import { CREATE_MESH } from './action-types';
import { MESH_CREATION } from '../helpers/state';
import { changeState } from './index';
import SocketService from '../services/socket';

const cretateMeshAction = mesh => ({
    type: CREATE_MESH,
    payload: mesh
});

const socket = SocketService.getConnection();

export const createMesh = mesh => dispatch => {
    socket.emit('mesh', JSON.stringify(mesh));

    dispatch(cretateMeshAction(mesh));
    dispatch(changeState(MESH_CREATION));
};

export const solve = () => (dispatch, getState) => {
    // Emit to webSocket
    // Change state
};
