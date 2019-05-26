import { combineReducers } from 'redux';
import MeshReducer from './mesh';

const rootReducer = combineReducers({
    mesh: MeshReducer
});

export default rootReducer;
