"use client";
import Canvas from "@/componants/Canvas";
import Message from "@/componants/Message";
import ScoreBoard from "@/componants/ScoreBoard";
import WordSelect from "@/componants/WordSelect";
import { useGameContext } from "@/context/GameContext";
import socket from '@/utils/socket';

import React, { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const Page = () => {
    const { players, user, game, setGame, gameRoom, getPlayer, messages, setWord, word } = useGameContext();
    const [isDrawer, setIsDrawer] = useState(false);
    const [wordOptions, setWordOptions] = useState(null);
    const [message, setMessage] = useState("");
    const [roundScores, setRoundScores] = useState(null);

    function handleStartGame() {
        socket.emit("start_game", gameRoom);
    }

    useEffect(() => {
        socket.on("game_started", () => toast("Game Started"));
        socket.on("round_start", (gameState) => {
            setGame(gameState);
            setIsDrawer(false);
            toast(`Round ${gameState.round} started`);
        });

        socket.on("drawer_selected", (drawer ) => {
            setRoundScores(null);
            setIsDrawer(drawer === user.id);
            setGame(p => ({ ...p, drawer }));
            toast(`${getPlayer(drawer).name} is drawing`);
        });

        socket.on("choose_word", (words) => {
            setWordOptions(words);
        });

        socket.on('draw_start', () => {
            setGame(p => ({ ...p, state: "drawing" }));
        });

        socket.on("draw_end", () => {
            toast("Drawing end");
            setGame(p => ({ ...p, state: "waiting" }));
        });

        socket.on("tick", ({ totalTime, remainingTime }) => {
            setGame(prev => ({ ...prev, totalTime, remainingTime }));
        });

        socket.on("drawer_skipped", () => {
            setIsDrawer(false);
            setWordOptions(null);
        });

        socket.on('scores', (s) => setRoundScores(s));

        return () => {
            socket.off("round_start");
            socket.off("drawer_selected");
            socket.off("draw_start");
            socket.off("choose_word");
            socket.off("draw_end");
            socket.off("game_over");
            socket.off("tick");
            socket.off("game_started");
            socket.off("drawer_skipped");
            socket.off('scores');
        };
    }, [socket, user, isDrawer, players]);

    async function handleWordSelect(w) {
        setWordOptions(null);
        setWord(w);
        socket.emit("word_chosen", w);
    }

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
        <main className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex flex-col">
            {/* Popups */}
            {wordOptions && <WordSelect words={wordOptions} onSelect={handleWordSelect} />}
            {roundScores && <ScoreBoard score={roundScores} />}

            {/* Navbar */}
            <nav className="flex justify-between items-center bg-gray-800/80 backdrop-blur-md px-4 py-3 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-green-400 tracking-wide">Guesser</h3>
                <button className="flex items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md font-semibold transition-colors text-sm sm:text-base">
                    <FaSignOutAlt /> Logout
                </button>
            </nav>

            {user.isAdmin && game.state === "waiting" && (
                <div className="w-full flex justify-center my-2 sm:my-3">
                    <button
                        className="bg-green-600 shadow-lg px-3 sm:px-4 py-2 rounded-md hover:scale-105 active:scale-95 transition-all duration-100"
                        onClick={handleStartGame}
                    >
                        Start
                    </button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 h-full p-2 sm:p-4">
                {/* Canvas Area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-grow bg-white rounded-lg flex justify-center items-center p-2 sm:p-4">
                        <Canvas isDrawer={isDrawer} />
                    </div>

                    {/* Players strip */}
                    <div className="flex gap-2 overflow-x-auto p-2 sm:p-4 bg-gray-800/80 backdrop-blur-md rounded-lg">
                        {players?.map((player, i) => (
                            <div
                                key={i}
                                className={`relative flex flex-col items-center gap-1 bg-gray-700 p-2 sm:p-3 rounded-xl shadow-md min-w-[80px] sm:min-w-[100px] ${player.role === "admin" && "outline-2 outline-green-400"}`}
                            >
                                {/* Score Badge */}
                                <div className="absolute -top-2 -left-2 bg-yellow-500 text-black px-1.5 py-0.5 rounded-full text-xs font-bold shadow">
                                    {player.score} pts
                                </div>
                                <FaUserCircle size={30} className="text-gray-300 sm:size-40" />
                                <p className="font-medium text-xs sm:text-base text-center">{player.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-gray-800/80 rounded-lg backdrop-blur-md p-2 sm:p-4 flex flex-col">
                    <h1 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-blue-400">Chats</h1>
                    <div className="overflow-y-auto flex flex-col gap-1 sm:gap-2 p-2 bg-gray-700 rounded-lg flex-grow">
                        {renderMessages()}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-1 sm:gap-2 mt-2">
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
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;
