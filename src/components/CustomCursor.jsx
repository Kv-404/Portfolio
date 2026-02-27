import { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = dotRef.current;
        if (!cursor || !dot) return;

        const mouse = { x: -100, y: -100 }; // Hide initially
        const pos = { x: 0, y: 0 };
        const speed = 0.1; // Lag factor

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            // Immediate update for the dot
            dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
        };

        const updateCursor = () => {
            const diffX = mouse.x - pos.x;
            const diffY = mouse.y - pos.y;

            pos.x += diffX * speed;
            pos.y += diffY * speed;

            cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

            requestAnimationFrame(updateCursor);
        };

        window.addEventListener('mousemove', handleMouseMove);
        const animationId = requestAnimationFrame(updateCursor);

        // Hover Effects - Global delegation
        const handleMouseOver = (e) => {
            if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.hover-trigger')) {
                cursor.classList.add('hovered');
                dot.classList.add('hovered');
            } else {
                cursor.classList.remove('hovered');
                dot.classList.remove('hovered');
            }
        };

        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <>
            <div id="custom-cursor" ref={cursorRef}></div>
            <div id="cursor-dot" ref={dotRef}></div>
        </>
    );
};

export default CustomCursor;
