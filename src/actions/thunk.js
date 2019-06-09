import { CREATE_MESH } from './action-types';
import {
    MESH_CREATION,
    SOLVING,
} from '../helpers/state';
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
    const state = getState();

    const mesh = state.mesh;
    const material = state.material.value;
    const pressure = {
        load: Object.values(state.pressure).map(pressure => { pressure.pressure *= -1; return pressure; })
    };

    const result = Object.assign(
        {},
        mesh,
        material,
        pressure
    );

    console.log(result);
    // socket.emit('solve', JSON.stringify(params));
    // dispatch(changeState(SOLVING));
};
