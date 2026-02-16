import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FrequencyGame = () => {
    const canvasRef = useRef(null);
    // Game State
    const [targetFreq, setTargetFreq] = useState(0);
    const [targetAmp, setTargetAmp] = useState(0);
    const [userFreq, setUserFreq] = useState(50);
    const [userAmp, setUserAmp] = useState(50);
    const [unlocked, setUnlocked] = useState(false);
    const [status, setStatus] = useState("SIGNAL_LOST");

    // Initialize random target
    useEffect(() => {
        setTargetFreq(Math.floor(Math.random() * 60) + 20); // 20-80
        setTargetAmp(Math.floor(Math.random() * 50) + 30);  // 30-80
    }, []);

    // Check Win Condition
    useEffect(() => {
        const freqDiff = Math.abs(userFreq - targetFreq);
        const ampDiff = Math.abs(userAmp - targetAmp);

        if (freqDiff < 5 && ampDiff < 5) {
            setUnlocked(true);
            setStatus("SIGNAL_LOCKED // SYSTEM_RESTORED");
        } else if (freqDiff < 15 && ampDiff < 15) {
            setStatus("ACQUIRING_LOCK...");
        } else {
            setStatus("NO_CARRIER");
        }
    }, [userFreq, userAmp, targetFreq, targetAmp]);

    // Render Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const render = () => {
            time += 0.05;
            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;

            ctx.clearRect(0, 0, width, height);

            // Draw Grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x < width; x += 20) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
            for (let y = 0; y < height; y += 20) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
            ctx.stroke();

            // Helper to draw wave
            const drawWave = (freq, amp, color, phaseShift, dashed = false) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                if (dashed) ctx.setLineDash([5, 5]);
                else ctx.setLineDash([]);

                for (let x = 0; x < width; x++) {
                    // Math: sin(x * frequency + time) * amplitude
                    const frequency = freq * 0.002;
                    const amplitude = amp * 0.8;
                    const y = centerY + Math.sin(x * frequency + time + phaseShift) * amplitude;

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            };

            // Draw Target Wave (Ghost)
            if (!unlocked) {
                drawWave(targetFreq, targetAmp, 'rgba(0, 255, 255, 0.3)', 0, true);
            }

            // Draw User Wave
            const waveColor = unlocked ? '#00ff00' : 'var(--accent-color)';
            drawWave(userFreq, userAmp, waveColor, unlocked ? 0 : 1); // Phase shift visually separates them until locked? Actually better to match phase logic so they overlap perfectly.

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [userFreq, userAmp, targetFreq, targetAmp, unlocked]);

    return (
        <div style={{
            width: '100%',
            height: '400px', // Match previous game height
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Space Mono', monospace",
            position: 'relative'
        }}>
            {/* Display Screen */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={250}
                    style={{ width: '100%', height: '100%' }}
                />

                {/* Status Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    color: unlocked ? '#00ff00' : 'var(--accent-color)',
                    fontSize: '0.8rem',
                    textShadow: '0 0 5px currentColor'
                }}>
                    STATUS: {status}
                </div>
            </div>

            {/* Controls Area */}
            <div style={{
                height: '140px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                backgroundColor: 'rgba(20, 20, 20, 0.8)'
            }}>
                {/* Frequency Control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '80px', fontSize: '0.7rem', opacity: 0.7 }}>FREQUENCY</span>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={userFreq}
                        onChange={(e) => setUserFreq(Number(e.target.value))}
                        disabled={unlocked}
                        style={{
                            flex: 1,
                            accentColor: 'var(--accent-color)',
                            cursor: unlocked ? 'default' : 'none'
                        }}
                    />
                </div>

                {/* Amplitude Control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '80px', fontSize: '0.7rem', opacity: 0.7 }}>AMPLITUDE</span>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={userAmp}
                        onChange={(e) => setUserAmp(Number(e.target.value))}
                        disabled={unlocked}
                        style={{
                            flex: 1,
                            accentColor: 'var(--accent-color)',
                            cursor: unlocked ? 'default' : 'none'
                        }}
                    />
                </div>

                {unlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            color: '#00ff00'
                        }}
                    >
                        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>UPLINK ESTABLISHED</h3>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Navigation Systems Online</p>
                    </motion.div>
                )}
            </div>

            <style>{`
                input[type=range] {
                    height: 2px;
                    -webkit-appearance: none;
                    background: rgba(255, 255, 255, 0.2);
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 15px;
                    height: 15px;
                    background: var(--accent-color);
                    border-radius: 0;
                    border: 2px solid black;
                    cursor: none;
                }
            `}</style>
        </div>
    );
};

export default FrequencyGame;
