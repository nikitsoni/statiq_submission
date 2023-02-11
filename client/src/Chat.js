import React, { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({socket, username, room}) {

    const [currentMessage, setCurrentMessage] = useState("");
    const [currentfile, setCurrentfile] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {

        if (currentMessage !== ""){
            const messageData = {
                room : room,
                author : username,
                message: currentMessage,
                time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getHours()
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }

        if (currentfile !== ""){
            const fileData = {
                room : room,
                author : username,
                file: currentfile,
                time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getHours()
            };

            setMessageList((list) => [...list, fileData]);
            setCurrentMessage("");
            await socket.emit("send_file", fileData);
        }

    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        })
    }, [socket])

  return (
    <div className='chat-window'>
        <div className='chat-header'>
            <p>Live Chat!</p>
        </div>
        <div className='chat-body'>

        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    {messageContent.file ?
                    (
                    <img src={`data:image/png;base64,${messageContent.file.toString("base64")}`}alt="img" />
                    ) : 
                    (<p>{messageContent.message}</p>)}
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>

        </div>
        <div className='chat-footer'>
            <input type='text' placeholder='Hey!' onChange={(event) => {setCurrentMessage(event.target.value)}} />
            <input type='file' onChange={(event) => {setCurrentfile(event.target.files[0])}}/>
            <button onClick={sendMessage} >&#9658;</button>
        </div>

    </div>
  )
}

export default Chat;