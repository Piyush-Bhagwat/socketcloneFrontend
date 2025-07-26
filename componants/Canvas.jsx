"use client";

import { useGameContext } from "@/context/GameContext";
import socket from '@/utils/socket';
import { useEffect, useRef, useState } from "react";

export default function Canvas({ isDrawer }) {
    const { gameRoom } = useGameContext();
    const canvasRef = useRef(null);
    const prevPos = useRef({ x: 0, y: 0 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement; // Get parent size

        const resizeCanvas = () => {
            const rect = parent.getBoundingClientRect();
            const scale = window.devicePixelRatio || 1;

            canvas.width = rect.width * scale;
            canvas.height = rect.height * scale;

            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            const context = canvas.getContext("2d");
            context.scale(scale, scale);

            context.lineCap = "round";
            context.lineWidth = 5;
            context.strokeStyle = "#000";
            setCtx(context);
        };

        resizeCanvas();

        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    useEffect(() => {
        socket.on("draw_stroke", ({ from, to }) => {
            if (!ctx) return;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        });

        socket.on("clean_canvas", () => {
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        });

        return () => {
            socket.off("draw_stroke");
            socket.off("clean_canvas");
        };
    }, [ctx]);

    const getPointerPos = (e) => {
        if (!isDrawer) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const startDrawing = (e) => {
        if (!isDrawer) return;
        e.preventDefault();
        const { x, y } = getPointerPos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        prevPos.current = { x, y };
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawer || !isDrawing) return;
        e.preventDefault();
        const { x, y } = getPointerPos(e);
        ctx.lineTo(x, y);
        ctx.stroke();

        socket.emit("drawing", {
            from: prevPos.current,
            to: { x, y },
            roomId: gameRoom,
        });
        prevPos.current = { x, y };
    };

    const stopDrawing = (e) => {
        if (!isDrawer) return;
        e.preventDefault();
        ctx.closePath();
        setIsDrawing(false);
    };

    return (
        <canvas
            ref={canvasRef}
            className="rounded-lg border border-gray-400 shadow-lg w-full h-full touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
        />
    );
}
