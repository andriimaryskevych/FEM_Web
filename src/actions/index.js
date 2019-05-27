import {
    CREATE_MESH,
    ADD_PRESSURE,
    SET_MATERIAL
} from './action-types';

export const cretateMesh = meshParameters => ({
    type: CREATE_MESH,
    payload: meshParameters
});

export const addPressure = femProperties => ({
    type: ADD_PRESSURE,
    payload: femProperties
});

export const setMaterial = materialProperties => ({
    type: SET_MATERIAL,
    payload: materialProperties
});