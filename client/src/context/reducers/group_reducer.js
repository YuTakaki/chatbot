export const group_reducer = (state, action) => {
    switch(action.type){
        case 'SET_GROUPNAME':
            return action.data;
        default:
            return state
    }

}