import { useState, useEffect, memo } from 'react'
import reactLogo from './assets/react.svg'
import DebugPage from './pages/admin'
import WebSocketService from './services/websocket-service';
import Console from './components/console';
import ConsoleInput from './components/console/consoleinput'

import './App.css'

function onCopyReplace(e) {
  var text = window.getSelection().toString().replace(/[\n\r]+/g, '');
  e.clipboardData.setData('text/plain', text);
  e.preventDefault();
}

function App() {
  const [consoleLog, setConsoleLog] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    window.addEventListener('copy', onCopyReplace);
    return () => window.removeEventListener('copy', onCopyReplace);
  }, [])

  const addMessage = message => { // adds console log message
    const { event, ok } = JSON.parse(message);
    console.log(event);
    
    if (event === 'auth' && ok === true) {
      setIsLoggedIn(true);
    }

    setConsoleLog([
      ...consoleLog,
      message
    ])
  };

  WebSocketService.onMessageRecieved(addMessage);

  const sendServerMessage = (message) => {
    console.log(message);
    WebSocketService.sendMessage(message);
  }

  const PageRouter = () =>
    isLoggedIn
      ? (
        <div className="console_container">
          <Console log={consoleLog} />
          <div className="console_input_container">
            <ConsoleInput onSendCommand={input => WebSocketService.sendCommand(input)} />
          </div>
        </div>
      )
      : <DebugPage onSendMessage={sendServerMessage} />

  return (
    <div className="App">
      { PageRouter() }
    </div>
  )
}

export default App
