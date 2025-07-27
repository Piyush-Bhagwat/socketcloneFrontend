'use client'

import socket from '@/utils/socket';
import React, { createContext, useContext, useEffect, useState } from 'react'
const gameContext = createContext(null);

const GameContextProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [gameRoom, setGameRoom] = useState("");
    const [game, setGame] = useState({ state: "waiting" })
    const [user, setUser] = useState(null)
    const [messages, setMessages] = useState([]);
    const [word, setWord] = useState("");

    useEffect(() => {
        // socket.connect();

        socket.on("updatePlayers", (plyrs) => {
            setPlayers(plyrs);
        })

        socket.on("game_started", (g) => {
            setGame(g);
        })
        socket.on("update_messages", (m) => {

            setMessages(m);
        })

        socket.on("correct_guess", (w) => {
            setWord(w);
        })

        return () => {
            socket.off("updatePlayers");
            socket.off("game_started");
            socket.off("update_messages")
            socket.disconnect();
        }
    }, []);

    useEffect(()=>{
        console.log(messages);
    }, [messages])

    function getPlayer(socketId) {
        console.log("players: ", players);
        console.log("socketID:", socketId);

        return players.find(p => p.id == socketId);
    }

    const v = { players, setPlayers, gameRoom, setGameRoom, user, setUser, game, setGame, getPlayer, messages, setMessages, word, setWord }
    return (
        <gameContext.Provider value={v}>{children}</gameContext.Provider>
    )
}


export default GameContextProvider

export const useGameContext = () => {
    return useContext(gameContext);
}