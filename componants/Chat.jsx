import { useGameContext } from '@/context/GameContext';
import socket from '@/utils/socket';
import React, { useEffect, useState } from 'react'
import Message from './Message';

const Chat = ({ isDrawer }) => {
    const [message, setMessage] = useState("");
    const { user, messages, gameRoom } = useGameContext();
    const [ time, setTime ] = useState(0);

    useEffect(() => { socket.on("tick", (t) => { setTime(t); console.log("tick") }) }, [])

    function handleMessageSend() {
        if (!message) return;
        const m = { time: Date.now(), text: message, isDrawer, user: user.name };
        socket.emit("send_message", { message: m, roomId: gameRoom });
        setMessage("");
    }

    function renderMessages() {
        if (!messages?.length) return null;
        return (
            <>
                {messages.map((msg, i) => (
                    <Message msg={msg} key={i} />
                ))}
            </>
        );
    }

    return (
        <div className="flex-1 bg-gray-800/80 rounded-lg backdrop-blur-md p-2 sm:p-4 flex flex-col">
            <div className='flex justify-between px-2'>
                <h1 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-blue-400">Chats</h1>
                {time}
            </div>
            <div className="overflow-y-auto flex flex-col gap-1 sm:gap-2 p-2 bg-gray-700 rounded-lg flex-grow">
                {renderMessages()}
            </div>
            < div className="flex gap-1 sm:gap-2 mt-2" >
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-grow px-2 sm:px-4 py-1 sm:py-2 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    disabled={isDrawer}
                />
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md font-semibold text-sm sm:text-base"
                    onClick={handleMessageSend}
                >
                    Send
                </button>
            </div >
        </div>
    )
}

export default Chat