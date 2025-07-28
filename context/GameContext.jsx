'use client'

import socket from '@/utils/socket';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
const gameContext = createContext(null);

const GameContextProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [gameRoom, setGameRoom] = useState("");
    const [game, setGame] = useState({ state: "waiting" })
    const [user, setUser] = useState(null)
    const [messages, setMessages] = useState([]);
    const [word, setWord] = useState("");

    const [serverActive, setServerActive] = useState(false);

    const PORT = "https://socketclone.onrender.com";

    useEffect(() => {

        async function wakeServer(retries = 5, delay = 2000) {
            setServerActive(false);

            for (let i = 0; i < retries; i++) {
                try {
                    const res = await axios.get(`${PORT}/wake-server`);
                    console.log("Server woke up:", res.data);
                    setServerActive(true);
                    return;
                } catch (err) {
                    console.log(`Server not up yet, retrying in ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2; // exponential backoff
                }
            }

            console.log("Failed to wake server after retries.");
        }
        wakeServer();

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

    function getPlayer(socketId) {
        console.log("players: ", players);
        console.log("socketID:", socketId);

        return players.find(p => p.id == socketId);
    }

    const v = { players, setPlayers, gameRoom, setGameRoom, user, setUser, game, setGame, getPlayer, messages, setMessages, word, setWord, serverActive }
    return (
        <gameContext.Provider value={v}>{children}</gameContext.Provider>
    )
}


export default GameContextProvider

export const useGameContext = () => {
    return useContext(gameContext);
}