import React, {useRef, useState, useEffect, FormEvent, ChangeEvent} from 'react';
// import logo from './logo.svg';
import styles from './App.module.css';
import MessageView from './components/MessageView/MessageView';
import who from './images/kaunheretu.jpeg'

export interface Message {
  id: number,
  text: string,
  from: string
}


function App() {

  const messageInput = useRef<HTMLInputElement>(null)

  const nameInput = useRef<HTMLInputElement>(null)

  const [newMessage, setNewMessage] = useState<string>("");

  const [messages, setMessages] = useState<Array<Message>>([])

  const [name, setName] = useState<string>("")

  const [submittedName, setSubmittedName] = useState<boolean>(false)
  
  const wsRef = useRef<WebSocket>()

  useEffect(() => {
    console.log("This should run on page load")
    if(!submittedName) {
      nameInput.current?.focus()
      return
    }
    messageInput.current?.focus()

    const ws = new WebSocket("ws://localhost:8080/name")
    ws.onopen = () => {
      console.log("Connected to server")
      console.log("Ready state is: ", ws.readyState)
      if (ws.readyState === ws.OPEN) {
        console.log("Sending a hello message")
        const greetingMessage: Message = {
          id: new Date().getTime(),
          text: `Welcome ${name}!!!`,
          from: `Admin`
        }
        ws.send(JSON.stringify(greetingMessage))
      }
    }
    ws.onmessage = (message) => {
      const content = JSON.parse(message.data);
      setMessages(prevMessages => [
        ...prevMessages,
        content
      ])
    }
    ws.onerror = (err) => {
      console.log("we have an error in websocket: ", err)
    }
    ws.onclose = (event) => {
      console.log("Connection is closed: ", event.reason)
      console.log("Close status is: ", event.code)
    }
    wsRef.current = ws;

    return () => {
      ws.close();
    }
  }, [submittedName])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (newMessage.length !== 0) {
      console.log("Submitting message: " + newMessage)
      const messageObj: Message = {
        id: new Date().getTime(),
        text: newMessage,
        from: name
      }
      wsRef.current?.send(JSON.stringify(messageObj));
      setNewMessage("");
      messageInput.current?.focus()
    }
  }

  const handleNameSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (name.length !== 0) {
      console.log("Entered name: " + name)
      setSubmittedName(true)
    }
  }

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value || "")
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value || "")
  }

  return (

    <div className={styles.App}>

      <div hidden={submittedName}>
        <img src={who} alt="evarandi meeru?" />
        <form onSubmit={handleNameSubmit}>
          <input
            type="text"
            className={styles.MessageInput}
            onChange={handleNameChange}
            value={name}
            ref={nameInput}
            placeholder="Enter your name" />
          <input
            type="submit"
            value="Send"
            className={styles.SendMessage}
          />
        </form>
      </div>

      <div hidden={!submittedName}>
        <div className={styles.ChatBox}>
          {messages.map(message => (
            <MessageView key={message.id} {...message} currentUser={name}/>
          ))}
        </div>
        <div className={styles.ChatInput}>
          <form onSubmit={handleSubmit}>
            <input
              className={styles.MessageInput}
              type="text"
              value={newMessage}
              onChange={handleMessageChange}
              ref={messageInput}
              placeholder="Type your message..."
            />
            <input
              type="submit"
              value="Send"
              className={styles.SendMessage}
            />
          </form>
        </div>
      </div>

    </div>





    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
