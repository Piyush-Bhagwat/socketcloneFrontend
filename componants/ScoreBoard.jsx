import { useGameContext } from '@/context/GameContext';
import React from 'react';

const ScoreBoard = ({ score }) => {
    const { getPlayer } = useGameContext();

    function renderScore() {
        return (
            <div className="flex flex-col gap-2 mt-2">
                {score?.map((s) => {
                    const player = getPlayer(s.id);
                    return (
                        <div
                            key={s.id}
                            className="flex justify-between items-center px-3 sm:px-4 py-2 rounded-lg shadow bg-gray-700 text-gray-100"
                        >
                            <p className="font-semibold text-base sm:text-lg truncate">{player.name}</p>
                            <p className="text-green-400 font-bold text-base sm:text-lg">{s.score}</p>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-4 rounded-xl shadow-md bg-gray-800/90 text-gray-100 w-screen h-screen fixed top-0 left-0 z-20 flex justify-center items-center">
            <div className="bg-gray-800 p-3 sm:p-5 rounded-2xl shadow-lg w-full max-w-sm min-h-48 sm:min-h-52 mx-2">
                <h2 className="text-center text-lg sm:text-xl font-bold mb-3 border-b border-gray-600 pb-2">
                    Scoreboard
                </h2>
                {renderScore()}
            </div>
        </div>
    );
};

export default ScoreBoard;
