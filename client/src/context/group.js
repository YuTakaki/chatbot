import React, {createContext, useReducer, useEffect} from 'react';
import { group_reducer } from './reducers/group_reducer';

export const GROUP = createContext();

const GroupChatContext = (props) => {

    const [group, group_dispatch] = useReducer(group_reducer, '');

    useEffect(() => {
        console.log(group);
    },[group])
    return (
        <GROUP.Provider value={{group, group_dispatch}}>
            {props.children}
        </GROUP.Provider>
    )
}

export default GroupChatContext