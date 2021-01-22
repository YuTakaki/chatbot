import axios from 'axios';
import React, {useEffect} from 'react';
import Home from './components/home';
import {HashRouter as Router, Route} from 'react-router-dom'
import StrangerChatBot from './components/strangerChats/stranger_chatbot';
import GroupChatBot from './components/groupChats/group_chatbot';
import InterestContext from './context/interests';

const App = () => {


  return (
    <div className="App">
      <InterestContext>
        <Router>
          <Route exact path='/' component={Home} />
          <Route path='/stranger-chatbot' component={StrangerChatBot} />
          <Route path='/group' component={GroupChatBot} />
        </Router>

      </InterestContext>
    </div>
  );
}

export default App;
