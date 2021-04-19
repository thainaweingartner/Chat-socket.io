import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 } from 'uuid';

const myId = v4();
const socket = io('http://localhost:8080',  { transports: ["websocket"] })
socket.on('connect', () => console.log('[IO] Connect => A new connection has been estabelished'))

const Chat = () => {
  const [message, updateMessage] = useState('');
  const [messages, updateMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = newMessage =>
      updateMessages([...messages, newMessage]);
    socket.on('chat.message', handleNewMessage)
    return () => socket.off('chat.message', handleNewMessage)
  }, [messages])

  const handleFormSubmit = event => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit('chat.message', {
        id: myId,
        message,
      });
      updateMessage('')
    }
  }

  const handleInputChange = event => {
    updateMessage(event.target.value)
  }

  return (
    <main className="container">
      <ul className="list">
        { messages.map((m, index)=> (
          <li 
            className={`list__item list__item--${m.id===myId ? 'mine' : 'other'}`}
            key={index}
          >
            <span className={`message message--${m.id===myId ? 'mine' : 'other'}`}>
              {m.message}
            </span>
          </li>
        ))}
      </ul>
      <form className="form" onSubmit={handleFormSubmit}>
        <input 
          className="form__field"
          type="text"
          placeholder="Type a new message here"
          onChange={handleInputChange}
          value={message}
        />
      </form>
    </main>
  );
}

export default Chat;