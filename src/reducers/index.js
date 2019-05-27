import { combineReducers } from 'redux';
import MeshReducer from './mesh';
import PressureReducer from './pressure';

const rootReducer = combineReducers({
    mesh: MeshReducer,
    pressure: PressureReducer
});

export default rootReducer;
