"use client";
import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";

const AlertBox = ({ message, type = "info", duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const baseClasses =
    "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-down";

  const styles = {
    info: "bg-blue-500",
    alert: "bg-red-500",
  };

  const icons = {
    info: <FaInfoCircle size={18} />,
    alert: <FaExclamationTriangle size={18} />,
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`${baseClasses} ${styles[type]}`}>
        {icons[type]}
        <span>{message}</span>
        <button
          onClick={() => setVisible(false)}
          className="ml-auto hover:text-gray-200"
        >
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  );
};

export default AlertBox;
