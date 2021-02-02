import '../../styles/strangerChatBot.scss';
import React, {useEffect, useContext, useState, useRef} from 'react';
import { socket } from '../socket';
import { INTERESTS } from '../../context/interests';

const StrangerChatBot = (props) => {
    const [chatActive, setChatActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sendTo, setSendTo] = useState(null);
    const [chats, setChats] = useState([]);
    const {interest} = useContext(INTERESTS);
    const leaveChat = () => {
        // socket.emit('endStrangerConnection');
        props.history.push('/')
    }
    const stopChat = () => {
        socket.emit('endStrangerConnection');
    }
    const nextChat = () => {
        setChats([]);
        setSendTo(null);
        socket.emit('findStranger');
        setIsLoading(true);

    }

    const message = useRef();
    const form = useRef();

    const sendMessage = e => {
        e.preventDefault();
        console.log(sendTo);
        if(sendTo !== null && message.current.value.length > 0){
            console.log(message.current.value);
            socket.emit('sendMessageToStranger', {message : message.current.value, sendTo})
            message.current.value = '';
        }
    }

    const textareaHandleChange = (e) => {
        if(e.charCode === 13){
            sendMessage(form.current);
        }
    }
    useEffect(() => {
        socket.connect();
        socket.emit('connectingStrangerChatbox', {interest});
        socket.emit('findStranger');
        return () => {
            socket.emit('endStrangerConnection');
            socket.emit('disconnectingStrangerChatbox');
            socket.disconnect();
        }
    },[]);

    useEffect(() => {
        socket.on('findStranger', user => {
            console.log(user);
            if(user){
                socket.emit('checkUserIfReady')
            }
        });
        socket.on('checkUserIfReady', user => {
            console.log(user);
            if(!user ){
                socket.emit('checkUserIfReady')
            }else{
                setSendTo(user);
                setChatActive(true);
                setIsLoading(false);
            }
        });
        socket.on('matchComplete', user => {
            setSendTo(user);
            setChatActive(true);
            setIsLoading(false);
        });
        socket.on('endStrangerConnection', () => {
            setChatActive(false);
            
            
        });

        socket.on('sendMessageToStranger', (data) => {
            
            const updatedChats = [...chats, data];
            console.log(updatedChats)
            setChats([...chats, data]);
        });

        return () => {
            
            socket.off('matchComplete');
            socket.off('sendMessageToStranger');
            socket.off('endStrangerConnection');
            socket.off('updateUsers');
            socket.off('findStranger');
            socket.off('checkUserIfReady');
        }
    })

    
    return (
        <div className='stranger-chatbox'>
            <header className='.header'>
                <i onClick={leaveChat} className='fa fa-arrow-left'></i>
                {chatActive ? (
                    <button onClick={stopChat} className='fa fa-arrow-right'>Stop</button>
                ) : (
                    <button onClick={nextChat} className='fa fa-arrow-right' disabled={isLoading}>Next</button>
                )}
                
            </header>
            <div className='interests'>

            </div>
            <div className='chatbox'>
                {chats.map(chat => (
                    <div className={chat.sender !== sendTo ? 'users-message-content' : 'others-message-content'}>
                        <div className='message'>
                            <p>{chat.message}</p>
                        </div>
                    </div>

                ))}

            </div>
            <form onSubmit={sendMessage} useRef={form}>
                <textarea ref={message} onKeyPress={textareaHandleChange}></textarea>
                <label htmlFor='send'><i className='fa fa-send-o'></i></label>
                <input type='submit' id='send'/>
            </form>
        </div>
    )
}

export default StrangerChatBot