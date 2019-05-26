const observeStore = (store, select, onChange, ignoreCount = 0) => {
    let currentState = null;

    const handleChange = () => {
        if (ignoreCount) {
            ignoreCount--;

            return;
        }

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