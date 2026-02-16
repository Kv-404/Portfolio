import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TerminalLog from '../components/TerminalLog';
import FrequencyGame from '../components/FrequencyGame';
import BackgroundCanvas from '../components/BackgroundCanvas';
import CustomCursor from '../components/CustomCursor';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const NotFound = () => {
    return (
        <>
            <BackgroundCanvas />
            <CustomCursor />
            <PageTransition>
                <div className="not-found-container">
                    <div className="layout-table">

                        {/* Left Side: Error Info */}
                        <div className="info-cell">
                            <div className="error-header">
                                <h1 className="glitch-404">404</h1>
                                <div className="subtitle-wrapper">
                                    <DecryptedText
                                        text="SIGNAL_LOST"
                                        speed={100}
                                        className="error-subtitle"
                                        revealDirection="center"
                                    />
                                </div>
                            </div>

                            <div className="terminal-wrapper">
                                <TerminalLog />
                            </div>

                            <div className="action-area">
                                <Link to="/" className="btn-reboot">
                                    <span className="bracket">[</span>
                                    <span className="btn-text">INITIATE_REBOOT</span>
                                    <span className="bracket">]</span>
                                </Link>
                                <p className="hint-text">
                                    // ERROR: Transmission Desynchronized.<br />
                                    // Align waveform frequency to restore uplink.
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Mini Game */}
                        <div className="game-cell">
                            <div className="game-frame">
                                <div className="frame-header">
                                    <span>SIGNAL_TUNER_V1.0</span>
                                    <div className="status-light"></div>
                                </div>
                                <FrequencyGame />
                            </div>
                        </div>

                    </div>
                </div>

                <style>{`
                    .not-found-container {
                        min-height: 100vh;
                        width: 100vw;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        z-index: 10;
                        padding: 2rem;
                        box-sizing: border-box;
                        overflow: hidden;
                    }

                    .layout-table {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        gap: 5rem;
                        width: 100%;
                        max-width: 1200px;
                        flex-wrap: wrap;
                    }

                    /* Left Column */
                    .info-cell {
                        display: flex;
                        flex-direction: column;
                        gap: 2rem;
                        text-align: left;
                        flex: 1;
                        min-width: 300px;
                        max-width: 450px;
                    }

                    .glitch-404 {
                        font-family: var(--font-heading);
                        font-size: 8rem;
                        line-height: 0.8;
                        font-weight: 900;
                        color: var(--accent-color);
                        letter-spacing: -5px;
                        margin: 0;
                        text-shadow: 2px 2px 0px rgba(255,0,0,0.5), -2px -2px 0px rgba(0,255,255,0.5);
                    }
                    
                    .subtitle-wrapper {
                        margin-top: 1rem;
                    }

                    .error-subtitle {
                        font-family: 'Space Mono', monospace;
                        font-size: 1.5rem;
                        color: rgba(255, 255, 255, 0.7);
                        letter-spacing: 5px;
                    }

                    .terminal-wrapper {
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        background: rgba(0, 0, 0, 0.5);
                        padding: 1rem;
                        width: 100%;
                    }

                    .action-area {
                        margin-top: 1rem;
                    }

                    .btn-reboot {
                        font-family: var(--font-heading);
                        font-size: 1.2rem;
                        color: var(--text-color);
                        text-decoration: none;
                        display: inline-flex;
                        gap: 0.5rem;
                        transition: all 0.3s ease;
                        padding: 0.5rem 1rem;
                        border: 1px solid transparent;
                        cursor: none;
                    }

                    .btn-reboot:hover {
                        border-color: var(--accent-color);
                        background: rgba(255, 255, 255, 0.05);
                        letter-spacing: 1px;
                        transform: translateX(5px);
                    }

                    .bracket {
                        color: var(--accent-color);
                    }

                    .hint-text {
                        font-family: 'Space Mono', monospace;
                        font-size: 0.8rem;
                        color: rgba(255, 255, 255, 0.4);
                        margin-top: 1rem;
                        line-height: 1.5;
                    }

                    /* Right Column */
                    .game-cell {
                        flex: 1.5; /* Give game more space */
                        display: flex;
                        justify-content: center;
                        perspective: 1000px;
                        min-width: 350px;
                        max-width: 600px;
                    }

                    .game-frame {
                        background: rgba(10, 10, 10, 0.9);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        padding: 2px; /* Minimal padding for screen look */
                        box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
                        transform: rotateY(-5deg);
                        transition: transform 0.5s ease;
                        width: 100%;
                    }

                    .game-frame:hover {
                        transform: rotateY(0deg);
                        border-color: var(--accent-color);
                    }

                    .frame-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 0.5rem;
                        padding: 0.5rem 1rem;
                        font-family: 'Space Mono', monospace;
                        font-size: 0.8rem;
                        color: rgba(255, 255, 255, 0.5);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .status-light {
                        width: 8px;
                        height: 8px;
                        background: #00ff00;
                        border-radius: 50%;
                        box-shadow: 0 0 5px #00ff00;
                        animation: blink 2s infinite;
                    }

                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }

                    /* Responsive */
                    @media (max-width: 900px) {
                        .layout-table {
                            flex-direction: column;
                            gap: 3rem;
                            padding-bottom: 4rem;
                        }
                        
                        .not-found-container {
                            overflow-y: auto;
                            align-items: flex-start;
                        }
                        
                        .info-cell {
                            align-items: center;
                            text-align: center;
                            width: 100%;
                        }
                        
                        .game-frame {
                            transform: none;
                        }

                        .glitch-404 {
                            font-size: 5rem;
                        }
                        
                        .game-cell {
                            width: 100%;
                        }
                    }
                `}</style>
            </PageTransition>
        </>
    );
};

export default NotFound;
