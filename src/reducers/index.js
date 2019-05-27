import { combineReducers } from 'redux';
import MeshReducer from './mesh';
import PressureReducer from './pressure';
import MaterialReducer from './material';

const rootReducer = combineReducers({
    mesh: MeshReducer,
    pressure: PressureReducer,
    material: MaterialReducer
});

export default rootReducer;
