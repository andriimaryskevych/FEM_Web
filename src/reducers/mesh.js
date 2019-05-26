const INITIAL_STATE = {
    x: 100,
    y: 100,
    z: 100,

    sizeX: 5,
    sizeY: 5,
    sizeZ: 5
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        default:
            return state;
    }
};
