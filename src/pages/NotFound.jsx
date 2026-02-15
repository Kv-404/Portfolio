import React from 'react';
import { Link } from 'react-router-dom';
import TerminalLog from '../components/TerminalLog';
import BackgroundCanvas from '../components/BackgroundCanvas';
import CustomCursor from '../components/CustomCursor';
import PageTransition from '../components/PageTransition';

const NotFound = () => {
    return (
        <>
            <BackgroundCanvas />
            <CustomCursor />
            <PageTransition>
                <div className="container" style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    width: '100%',
                    padding: '2rem'
                }}>
                    <div className="glass-card" style={{
                        maxWidth: '600px',
                        padding: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem'
                    }}>
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                            <h1 style={{
                                fontSize: '5rem',
                                lineHeight: 1,
                                marginBottom: '0.5rem',
                                color: 'var(--accent-color)',
                                letterSpacing: '-2px',
                                fontWeight: 900
                            }}>
                                404
                            </h1>
                            <h2 style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: '1.2rem',
                                opacity: 0.8,
                                letterSpacing: '2px'
                            }}>
                                SIGNAL_LOST
                            </h2>
                        </div>

                        <TerminalLog />

                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', opacity: 0.4 }}>
                                ERROR_CODE: ID-10-T
                            </span>
                            <Link to="/" className="btn btn-primary">
                                REBOOT_SYSTEM
                            </Link>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </>
    );
};

export default NotFound;
