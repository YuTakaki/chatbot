import '../../styles/strangerChatBot.scss';
import React, {useEffect} from 'react';
import { socket } from '../socket';

const StrangerChatBot = (props) => {
    const leaveChat = () => {
        props.history.push('/')
    }
    useEffect(() => {
        socket.connect();
        socket.emit('connectingStrangerChatbox', {interests : []});
        return () => {
            socket.disconnect()
        }

    })
    return (
        <div className='stranger-chatbox'>
            <header className='.header'>
                <i onClick={leaveChat} className='fa fa-arrow-left'></i>
                <button className='fa fa-arrow-right'>Next</button>
            </header>
            <div className='interests'>

            </div>
            <div className='chatbox'>
                <div className='others-message-content'>
                    <p>Yu Takaki</p>
                    <div className='message'>
                        <p>Commodo ullamco consequat fugiat deserunt excepteur cupidatat tempor ea. Sint labore ad nisi fugiat. Ex ut consequat sunt nisi aliquip nostrud officia elit enim quis cupidatat tempor cupidatat. Ullamco ex cillum amet enim magna.</p>
                    </div>
                    
                </div>
                <div className='users-message-content'>
                    <p>Yu Takaki</p>
                    <div className='message'>
                        <p>Commodo ullamco consequat fugiat deserunt excepteur cupidatat tempor ea. Sint labore ad nisi fugiat. Ex ut consequat sunt nisi aliquip nostrud officia elit enim quis cupidatat tempor cupidatat. Ullamco ex cillum amet enim magna.</p>
                    </div>
                    
                </div>

            </div>
            <form>
                <textarea></textarea>
                <i className='fa fa-send-o'></i>
            </form>
        </div>
    )
}

export default StrangerChatBot