export const interest_reducer = (state, action) => {
    switch(action.type){
        case 'SET_INTERESTS':
            return action.data;
        default:
            return state
    }

}