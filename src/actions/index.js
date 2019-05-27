import {
    CREATE_MESH,
    ADD_PRESSURE,
    SET_MATERIAL,
    UPDATE_PRESSURE,
    DELETE_PRESSURE
} from './action-types';


export const cretateMesh = meshParameters => ({
    type: CREATE_MESH,
    payload: meshParameters
});

export const addPressure = femProperties => ({
    type: ADD_PRESSURE,
    payload: femProperties
});

export const updatePressure = pressureProperties => ({
    type: UPDATE_PRESSURE,
    payload: pressureProperties
});

export const deletePressure = pressureProperties => ({
    type: DELETE_PRESSURE,
    payload: pressureProperties
});

export const setMaterial = materialProperties => ({
    type: SET_MATERIAL,
    payload: materialProperties
});
