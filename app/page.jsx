'use client'
import { useGameContext } from "@/context/GameContext";
import socket from "../utils/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function Home() {
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(6);
    const [rounds, setRounds] = useState(5);

    const { setGameRoom, setUser, serverActive } = useGameContext();
    const router = useRouter();

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to socket server ✅", socket.id);
        });

        socket.on("room_created", ({ roomId, id }) => {
            toast('Room Created!');
            setGameRoom(roomId);
            router.push(`/room/${roomId}`);
            setUser({ name, isAdmin: true, id });
        });

        socket.on("room_joined", ({ roomId, id }) => {
            toast(`Room Joined ${roomId}`);
            setGameRoom(roomId);
            setUser({ name, isAdmin: false, id });
            router.push(`/room/${roomId}`);
        });

        socket.on("room_not_found", () => {
            toast.error("Room not Found");
        });

        return () => {
            socket.off("connect");
            socket.off("room_created");
            socket.off("room_joined");
            socket.off("room_not_found");
        };
    }, [name]);

    function handleCreateRoom() {
        if (!serverActive) return;
        if (!socket.connected) socket.connect();
        socket.emit("create_room", { name, maxPlayers, rounds });
    }

    function handleJoin() {
        if (!serverActive) return;
        if (!socket.connected) socket.connect();

        socket.emit("join_room", { name, roomId: roomId.toUpperCase() });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            {/* server inactive */}
            <div className={`bg-red-400 fixed left-0 w-full text-center transition-all duration-100 ease-in z-30 ${serverActive ? "-top-10" : "top-0"}`}>server starting please wait... this might take about a min</div>

            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 w-full max-w-4xl">
                {/* Create Room */}
                <div className="bg-gray-800/70 backdrop-blur-md p-5 sm:p-8 rounded-2xl shadow-2xl w-full border border-green-400/30">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-green-400 tracking-wide">
                        Create Room
                    </h1>
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-300 font-medium text-sm sm:text-base">Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-700/80 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-300 font-medium text-sm sm:text-base">Max Players</label>
                            <input
                                type="number"
                                min="1"
                                max="9"
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(e.target.value)}
                                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-700/80 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-300 font-medium text-sm sm:text-base">Rounds</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={rounds}
                                onChange={(e) => setRounds(e.target.value)}
                                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-700/80 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                            />
                        </div>

                        <button
                            className="mt-3 sm:mt-4 bg-green-500 hover:bg-green-600 active:scale-95 transition-transform text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg text-sm sm:text-base"
                            onClick={handleCreateRoom}
                        >
                            Create Room
                        </button>
                    </div>
                </div>

                {/* Join Room */}
                <div className="bg-gray-800/70 backdrop-blur-md p-5 sm:p-8 rounded-2xl shadow-2xl w-full border border-blue-400/30">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-blue-400 tracking-wide">
                        Join Room
                    </h1>
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-300 font-medium text-sm sm:text-base">Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-700/80 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-300 font-medium text-sm sm:text-base">Room ID</label>
                            <input
                                type="text"
                                placeholder="Enter Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-700/80 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                            />
                        </div>

                        <button
                            className="mt-3 sm:mt-4 bg-blue-500 hover:bg-blue-600 active:scale-95 transition-transform text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg text-sm sm:text-base"
                            onClick={handleJoin}
                        >
                            Join Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
