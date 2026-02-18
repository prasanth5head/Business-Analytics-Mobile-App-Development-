import React, { useEffect, useRef, useState } from 'react';
import './ReactiveCursor.css';

const ReactiveCursor = () => {
    const cursorRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;

        const moveCursor = (e) => {
            if (cursor) {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            }
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
                setHovered(true);
            } else {
                setHovered(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return <div className={`reactive-cursor ${hovered ? 'hovered' : ''}`} ref={cursorRef}></div>;
};

export default ReactiveCursor;
