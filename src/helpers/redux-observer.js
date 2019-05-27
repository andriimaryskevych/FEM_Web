const observeStore = (store, select, onChange, ignoreCount = 0) => {
    let currentState = null;

    const handleChange = () => {
        let nextState = select(store.getState());

        if (ignoreCount) {
            ignoreCount--;
            currentState = nextState;

            return;
        }

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