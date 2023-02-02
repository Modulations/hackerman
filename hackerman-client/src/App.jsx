import { useState } from 'react'
import reactLogo from './assets/react.svg'
import DebugPage from './pages/admin'
import WebSocketService from './services/websocket-service';

import './App.css'

function App() {
  const sendServerMessage = (message) => {
    console.log(message);
    WebSocketService.sendMessage(message);
  }

  return (
    <div className="App">
      <DebugPage onSendMessage={sendServerMessage} />
    </div>
  )
}

export default App
