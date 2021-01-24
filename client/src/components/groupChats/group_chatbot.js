import {useEffect, useContext} from 'react';
import { GROUP } from '../../context/group';
import '../../styles/groupChatBot.scss';
import { socket } from '../socket';

const GroupChatBot = (props) => {
    const {group} = useContext(GROUP);
    const leaveRoom = () => {
        props.history.push('/')
    }
    useEffect(() => {
        socket.connect();
        console.log(group);
        socket.emit('joinGroupChatbox', {groupName : group, name : ''});
        return () => {
            socket.disconnect()
        }

    })
    return(
        <div className='group-chatbox'>
            <div className='box1'>
                <div className='users'>

                </div>
                <form>
                    <input type='text'/>
                    <input type='submit' value='Join another Room' />
                </form>
                <button onClick={leaveRoom}>Leave Room</button>
            </div>
            <div className='box2'>
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

        </div>
    )
}

export default GroupChatBot
