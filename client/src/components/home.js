import {useRef, useContext} from 'react';
import stranger from '../assets/stranger.png';
import group from '../assets/group.png';
import '../styles/home.scss'
import { INTERESTS } from '../context/interests';
import { GROUP } from '../context/group';

const Home = (props) => {
    const interests = useRef();
    const groupName = useRef();
    const {interest_dispatch} = useContext(INTERESTS);
    const {group_dispatch} = useContext(GROUP);

    const onToGroupChatBox = (e) => {
        e.preventDefault();
        if(groupName.current.value !== ''){
            group_dispatch({type: 'SET_GROUPNAME', data : groupName.current.value});
            props.history.push('/group');
        }else{
            alert('group name should not be empty');
        }
    }
    const onToStrangerChatBox = (e) => {
        e.preventDefault();
        const interest = interests.current.value.split(" ");
        interest_dispatch({type: 'SET_INTERESTS', data : interest})
        props.history.push('/stranger-chatbot');
    }

    
    return (
        <>
            <div className='home'>
                <header>
                    <h1>ChatBot</h1>
                </header>
                <div className='chat-option'>
                    <div className='stranger-chatBot'>
                        <h2>Stranger ChatBot</h2>
                        <img src={stranger} />
                        <p>Talk to stranger with matching interest</p>
                        <form onSubmit={onToStrangerChatBox}>
                            <input ref={interests} type='text' />
                            <input type='submit' value='Talk to stranger' />
                        </form>

                    </div>
                    <div className='groupChat-chatBot'>
                        <h2>Group ChatBot</h2>
                        <img src={group} />
                        <p>Join a group chat that has the same interest as you</p>
                        <form onSubmit={onToGroupChatBox}>
                            <input ref={groupName} type='text' />
                            <input type='submit' value='Join Group' />
                        </form>

                    </div>
                </div>

            </div>

        </>
        
    )
}

export default Home