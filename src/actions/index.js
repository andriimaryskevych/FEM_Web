import {
    CREATE_MESH,
    ADD_PRESSURE,
    SET_MATERIAL,
    UPDATE_PRESSURE,
    DELETE_PRESSURE,
    HOVER_FE,
    CHANGE_STATE
} from './action-types';

export const cretateMesh = mesh => ({
    type: CREATE_MESH,
    payload: mesh
});

export const addPressure = fe => ({
    type: ADD_PRESSURE,
    payload: fe
});

export const updatePressure = pressure => ({
    type: UPDATE_PRESSURE,
    payload: pressure
});

export const deletePressure = pressure => ({
    type: DELETE_PRESSURE,
    payload: pressure
});

export const setMaterial = material => ({
    type: SET_MATERIAL,
    payload: material
});

export const hoverFE = fe => ({
    type: HOVER_FE,
    payload: fe
});

export const changeState = state => ({
    type: CHANGE_STATE,
    payload: state
});
