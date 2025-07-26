import { useGameContext } from '@/context/GameContext';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

// System messages: no icon, centered text
const SystemMessage = ({ msg }) => (
    <div className="flex justify-center p-2">
        <p className="text-sm italic text-gray-400">{msg.text}</p>
    </div>
);

// Normal messages: icon + user + text
const NormalMessage = ({ msg }) => (
    <div className="flex items-start gap-2 p-2 rounded-lg shadow bg-gray-600/70 text-gray-100">
        <FaUserCircle size={24} className="text-gray-300" />
        <div>
            <p className="font-semibold">{msg.user}</p>
            <p className="text-sm">{msg.text}</p>
        </div>
    </div>
);

// Hidden messages: no icon, obscured content placeholder
const HiddenMessage = ({ msg }) => (
    <div className="flex items-start gap-2 p-2 rounded-lg shadow bg-green-300 text-neutral-800 italic">
        <div>
            <p className="font-semibold">{msg.user}</p>

            <p className="text-sm">{msg.text}</p>
        </div>
    </div>
);

// Answer messages: standout style, no icon
const AnswerMessage = ({ msg }) => (
    <div className="flex items-start gap-2 p-2 rounded-lg shadow bg-green-600/80 text-white animate-pulse">
        <div>
            <p className="font-semibold">{msg.text}</p>
        </div>
    </div>
);

// Main Message component
const Message = ({ msg }) => {
    const {word} = useGameContext();
    switch (msg.type) {
        case 'system':
            return <SystemMessage msg={msg} />;
        case 'normal':
            return <NormalMessage msg={msg} />;
        case 'hidden':
            if (word) {
                return <HiddenMessage msg={msg} />;
            }
            return;
        case 'answer':
            return <AnswerMessage msg={msg} />;
        default:
            return <NormalMessage msg={msg} />;
    }
};

export default Message;
