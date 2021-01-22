import React, {createContext, useReducer, useEffect} from 'react';
import { interest_reducer } from './reducers/interest_reducer';

export const INTERESTS = createContext();

const InterestContext = (props) => {

    const [interest, interest_dispatch] = useReducer(interest_reducer, []);

    useEffect(() => {
        console.log(interest);
    },[interest])
    return (
        <INTERESTS.Provider value={{interest, interest_dispatch}}>
            {props.children}
        </INTERESTS.Provider>
    )
}

export default InterestContext