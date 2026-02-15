import React, { useState, useEffect } from 'react';

const LOG_MESSAGES = [
    "INITIALIZING_VIRTUAL_ENVIRONMENT...",
    "SCANNING_SECTOR_7G...",
    "ERROR: COORDINATES_INVALID",
    "ATTEMPTING_RECONNECTION...",
    "PING_TIMEOUT: 127.0.0.1",
    "LOADING_ASSETS...",
    "MEMORY_DUMP: 0x4F3A2...",
    "SIGNAL_LOST_AT_VECTOR_404",
    "RETRYING_HANDSHAKE...",
    "SYSTEM_STATUS: UNSTABLE",
    "SEARCHING_FOR_PATH...",
    "DATA_PACKET_CORRUPTED",
    "REROUTING_TRAFFIC...",
    "CHECKING_INTEGRITY...",
    "ACCESS_DENIED_BY_PROTOCOL"
];

const TerminalLog = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Initial population
        setLogs(LOG_MESSAGES.slice(0, 5));

        const interval = setInterval(() => {
            setLogs(prev => {
                const nextMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
                const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
                const newLog = `[${timestamp}] > ${nextMsg}`;
                // Keep last 8 lines
                return [...prev, newLog].slice(-8);
            });
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.8rem',
            opacity: 0.5,
            lineHeight: 1.6,
            color: 'var(--text-color)',
            textAlign: 'left',
            padding: '1rem',
            borderLeft: '2px solid rgba(255,255,255,0.1)',
            height: '200px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%)'
        }}>
            {logs.map((log, i) => (
                <div key={i}>{log}</div>
            ))}
            <div className="blink">_</div>

            <style>{`
                .blink {
                    animation: blinker 1s linear infinite;
                }
                @keyframes blinker {
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default TerminalLog;
