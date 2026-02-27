import { Link } from 'react-router-dom';

import TerminalLog from '../components/TerminalLog';
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

                    <div style={{
                        position: 'fixed',
                        top: '2rem',
                        right: '4rem',
                        textAlign: 'right',
                        zIndex: 10
                    }}>
                        <h2 style={{ fontSize: '1rem', opacity: 0.5, letterSpacing: '2px' }}>
                            <DecryptedText text="SYSTEM // ERROR 404" animateOn="view" revealDirection="end" />
                        </h2>
                    </div>

                    <div className="cyber-frame">
                        <div className="terminal-header">
                            <span>CRITICAL_FAILURE_DETECTED</span>
                            <div className="status-light"></div>
                        </div>

                        <div className="terminal-body">
                            <h1 className="error-title">404</h1>

                            <div className="subtitle-box">
                                <span className="bracket">[</span>
                                <DecryptedText
                                    text="SIGNAL_LOST"
                                    speed={80}
                                    className="cyber-subtitle"
                                    animateOn="view"
                                />
                                <span className="bracket">]</span>
                            </div>

                            <div className="log-container">
                                <TerminalLog />
                            </div>

                            <p className="system-message">
                                &gt; CONNECTION TIMEOUT EXCEEDED<br />
                                &gt; REQUESTED SECTOR DOES NOT EXIST<br />
                                &gt; RECOMMEND IMMEDIATE SYSTEM REBOOT
                            </p>

                            <Link to="/" className="reboot-btn">
                                <span className="btn-icon">⚡</span>
                                <DecryptedText text="INITIATE_REBOOT" speed={40} className="btn-text" animateOn="hover" />
                            </Link>
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

                    .cyber-frame {
                        background: rgba(10, 10, 10, 0.4);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 8px;
                        max-width: 600px;
                        width: 100%;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
                        position: relative;
                        overflow: hidden;
                    }

                    .cyber-frame::after {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
                        background-size: 100% 4px;
                        pointer-events: none;
                        z-index: 2;
                    }

                    .terminal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: rgba(0, 0, 0, 0.6);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        padding: 0.8rem 1.5rem;
                        font-family: 'Space Mono', monospace;
                        font-size: 0.8rem;
                        color: rgba(255, 255, 255, 0.5);
                    }

                    .status-light {
                        width: 8px;
                        height: 8px;
                        background: #ff003c;
                        border-radius: 50%;
                        box-shadow: 0 0 10px #ff003c;
                        animation: blink 1s infinite;
                    }

                    .terminal-body {
                        padding: 3rem 2rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        position: relative;
                        z-index: 3;
                    }

                    .error-title {
                        font-family: 'Inter', system-ui, -apple-system, sans-serif;
                        font-size: 10rem;
                        line-height: 0.8;
                        font-weight: 900;
                        color: var(--accent-color, #ff003c); /* Default fallback */
                        margin: 0;
                        position: relative;
                        letter-spacing: -5px;
                    }

                    .subtitle-box {
                        margin-top: 1.5rem;
                        margin-bottom: 2rem;
                        display: flex;
                        gap: 0.5rem;
                        align-items: center;
                        font-family: 'Space Mono', monospace;
                        font-size: 1.5rem;
                    }

                    .bracket {
                        color: rgba(255,255,255,0.3);
                    }

                    .cyber-subtitle {
                        color: rgba(255, 255, 255, 0.8);
                        letter-spacing: 4px;
                    }

                    .log-container {
                        width: 100%;
                        max-width: 400px;
                        margin-bottom: 2rem;
                        background: rgba(0, 0, 0, 0.5);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .system-message {
                        font-family: 'Space Mono', monospace;
                        font-size: 0.85rem;
                        color: rgba(255, 255, 255, 0.5);
                        text-align: left;
                        line-height: 1.6;
                        margin-bottom: 3rem;
                        width: 100%;
                        max-width: 400px;
                        border-left: 2px solid var(--accent-color);
                        padding-left: 1rem;
                    }

                    .reboot-btn {
                        background: transparent;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        color: var(--text-color, #fff);
                        text-decoration: none;
                        padding: 1rem 2rem;
                        font-family: 'Space Mono', monospace;
                        font-size: 1rem;
                        letter-spacing: 2px;
                        transition: all 0.2s ease;
                        position: relative;
                        cursor: none;
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        width: 100%;
                        max-width: 400px;
                        justify-content: center;
                    }

                    .reboot-btn:hover {
                        background: rgba(255, 255, 255, 0.05);
                        border-color: var(--accent-color);
                        color: var(--accent-color);
                    }
                    
                    .reboot-btn:hover .btn-icon {
                        color: var(--accent-color);
                    }

                    .btn-icon {
                        font-size: 1.2rem;
                        margin-bottom: 2px;
                    }

                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.3; }
                    }

                    @media (max-width: 768px) {
                        .terminal-body { padding: 2rem 1.5rem; }
                        .error-title { font-size: 6rem; }
                        .subtitle-box { font-size: 1.2rem; }
                        .system-message { font-size: 0.75rem; }
                    }
                `}</style>
            </PageTransition >
        </>
    );
};

export default NotFound;
