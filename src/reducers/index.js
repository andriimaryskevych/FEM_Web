import { combineReducers } from 'redux';

import MeshReducer from './mesh';
import PressureReducer from './pressure';
import MaterialReducer from './material';
import HoverReducer from './hover_fe';
import ScrollReducer from './scroll';

const rootReducer = combineReducers({
    mesh: MeshReducer,
    pressure: PressureReducer,
    material: MaterialReducer,
    hover: HoverReducer,
    scroll: ScrollReducer
});

export default rootReducer;
