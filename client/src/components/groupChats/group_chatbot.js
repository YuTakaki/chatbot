import {useEffect, useContext, useRef, memo, useState} from 'react';
import { GROUP } from '../../context/group';
import '../../styles/groupChatBot.scss';
import { socket } from '../socket';
const randomUsername = () => {
    const number = [...Array(10)].map((num, i) => i.toString() );
    const bigLetter = [...Array(26)].map((num, i) => String.fromCharCode(i + 65));
    const smallLetter = bigLetter.map(letter => letter.toLowerCase());
    const random = [...number, ...bigLetter, ...smallLetter];
    let user = '';
    for (let i = 0; i < 7; i++){
        const index =Math.floor(Math.random() * random.length);
        user += random[index]  
    }
    return user
}
const GroupChatBot = (props) => {
    const {group, group_dispatch} = useContext(GROUP);
    const [username, setUsername] = useState(randomUsername());
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const chatInput = useRef();
    const roomInput = useRef();
    const leaveRoom = () => {
        props.history.push('/')
    }
    useEffect(()=>{
        socket.connect();
        socket.emit('joinGroupChatbox', {groupName : group, username});
        socket.emit('getUsers', group);
        
        return () => {
            socket.emit('disconnectGroupchatRoom', group);
            socket.disconnect();
        }

    }, [])
    useEffect(() => {
        socket.on('sending', message => {
            console.log(chats);
            setChats([...chats, message]);
        });
        socket.on('users', users => {
            setUsers(users);
        });
        return () => {
            socket.off('sending');
            socket.off('users');
        }
    });
    const sendMessage = (e) => {
        e.preventDefault();
        console.log(chatInput.current.value)
        socket.emit('sendMessage', {message: chatInput.current.value, username});
    }

    const changeRoom = e => {
        e.preventDefault();
        group_dispatch({type:'SET_GROUPNAME', data: roomInput.current.value});
        setChats([]);
        socket.emit('joinGroupChatbox', {groupName : roomInput.current.value, username});
        socket.emit('getUsers', roomInput.current.value);
        roomInput.current.value = '';

    }
    return(
        <div className='group-chatbox'>
            <div className='box1'>
            <h2>{users.length === 0 ? 'No one is here yet' : `${users.length} users are in the room`}</h2>
                <div className='users'>
                    
                    {users.map(user => (
                        <p>{user.username}</p>
                    ))}

                </div>
                <form onSubmit={changeRoom}>
                    <input ref={roomInput} type='text'/>
                    <input type='submit' value='Join another Room' />
                </form>
                <button onClick={leaveRoom}>Leave Room</button>
            </div>
            <div className='box2'>
                <div className='chatbox'>
                    {chats.map(chat => (
                        <div className={chat.username === username ? 'users-message-content' : 'others-message-content'}>
                            <p>{chat.username}</p>
                            <div className='message'>
                                <p>{chat.message}</p>
                            </div>
                            
                        </div>

                    ))}
                </div>
                <form onSubmit={sendMessage}>
                    <textarea ref={chatInput}></textarea>
                    <label htmlFor='send'><i className='fa fa-send-o'></i></label>
                    <input type='submit' id='send' />
                    
                </form>
            </div>

        </div>
    )
}

export default memo(GroupChatBot)
