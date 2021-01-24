import axios from 'axios';
import React, {useEffect} from 'react';
import Home from './components/home';
import {HashRouter as Router, Route} from 'react-router-dom'
import StrangerChatBot from './components/strangerChats/stranger_chatbot';
import GroupChatBot from './components/groupChats/group_chatbot';
import InterestContext from './context/interests';
import GroupChatContext from './context/group';

const App = () => {


  return (
    <div className="App">
      <GroupChatContext>
        <InterestContext>
          <Router>
            <Route exact path='/' component={Home} />
            <Route path='/stranger-chatbot' component={StrangerChatBot} />
            <Route path='/group' component={GroupChatBot} />
          </Router>
        </InterestContext>
      </GroupChatContext>
    </div>
  );
}

export default App;
