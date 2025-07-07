import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export default function App() {
  const [otherCursor, setOtherCursor] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const socketRef = useRef<any>(null);
  const [cursorOpacity, setCursorOpacity] = useState(0.4);

  useEffect(() => {
    // Only create the socket once
    socketRef.current = io('http://localhost:3001');

    const handleMouseMove = (e: MouseEvent) => {
      console.log('Sending cursor position:', { x: e.clientX, y: e.clientY });
      socketRef.current?.emit('cursor-move', { x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setCursorOpacity(1);
      setTimeout(() => setCursorOpacity(0.4), 300);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    socketRef.current.on('cursor-update', (data: { x: number; y: number }) => {
      console.log('Received cursor update:', data);
      setOtherCursor(data);
    });

    socketRef.current.on('user-connected', (socketId: string) => {
      console.log('User connected:', socketId);
    });

    socketRef.current.on('user-disconnected', (socketId: string) => {
      console.log('User disconnected:', socketId);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      socketRef.current?.off('cursor-update');
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gray-100 relative">
      <h1 className="text-center pt-10 text-xl font-bold">Twogetha Cursor Room</h1>
      <div
        style={{
          position: 'fixed',
          left: `${otherCursor.x}px`,
          top: `${otherCursor.y}px`,
          zIndex: 99999,
          pointerEvents: 'none',
          width: 0,
          height: 0,
          opacity: cursorOpacity,
          transition: 'opacity 0.3s',
        }}
      >
        {/* White triangle pointer */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '24px solid white',
            position: 'absolute',
            left: -12,
            top: 0,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          }}
        />
        {/* Blue soft outline */}
        <div
          style={{
            position: 'absolute',
            left: -24,
            top: 24,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(0, 120, 255, 0.4)',
            pointerEvents: 'none',
            filter: 'blur(2px)',
          }}
        />
      </div>
    </div>
  );
}