const observeStore = (store, select, onChange) => {
    let currentState;

    const handleChange = ()  =>{
        let nextState = select(store.getState());

        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    let unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
};

export {
    observeStore
};