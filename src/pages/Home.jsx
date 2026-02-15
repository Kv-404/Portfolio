import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const Home = () => {
    // Text Reveal Logic
    const [isSystemOnline, setIsSystemOnline] = useState(false);

    const navItems = [
        { label: 'PROJECTS', path: '/projects', id: '01' },
        { label: 'ABOUT', path: '/about', id: '02' },
        { label: 'NETWORK', path: '/socials', id: '03' },
        { label: 'CONTACT', path: '/contact', id: '04' }
    ];

    return (
        <PageTransition>
            <div className="container" style={{
                height: '100vh',
                width: '100%',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden',
                padding: '2rem'
            }}>
                {/* KV Brand: Top Left, Huge, Glitchy */}
                <div style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '2rem',
                    zIndex: 20
                }}>
                    <DecryptedText
                        text="Kv"
                        animateOn="view"
                        revealDirection="start"
                        speed={100}
                        maxIterations={20}
                        onDecryptionComplete={() => setIsSystemOnline(true)}
                        style={{
                            display: 'inline-block',
                            whiteSpace: 'pre-wrap',
                            fontSize: '15vw', // Back to BIG, but flexible
                            lineHeight: 0.8,
                            fontWeight: 900,
                            letterSpacing: '-0.05em',
                            cursor: 'default',
                            userSelect: 'none',
                            color: 'var(--text-color)',
                            mixBlendMode: 'difference',
                            margin: 0,
                            position: 'relative',
                            zIndex: 10
                        }}
                    />
                </div>

                {/* System Status: Top Right */}
                <div style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    zIndex: 20
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: isSystemOnline ? '#00ff00' : '#ff0000', // Red to Green
                        borderRadius: '50%',
                        boxShadow: isSystemOnline ? '0 0 10px #00ff00' : '0 0 10px #ff0000',
                        transition: 'all 0.5s ease'
                    }} />
                    <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '0.8rem',
                        opacity: 0.8,
                        letterSpacing: '0.1em'
                    }}>
                        SYSTEM_ONLINE
                    </span>
                </div>

                {/* Navigation: Centered Vertical List */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '2rem', // Keep it left-aligned but centered vertically? Or truly centered? 
                    // User said "Redesign the homepage", let's make it a clean left-aligned list but more prominent
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '1.5rem',
                    zIndex: 20
                }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="nav-link-container"
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                position: 'relative'
                            }}
                        >
                            <span style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: '1rem',
                                color: 'var(--accent-color)',
                                opacity: 0.6
                            }}>
                                <DecryptedText
                                    text={`//${item.id}`}
                                    animateOn="view"
                                    speed={80}
                                />
                            </span>
                            <span
                                className="nav-link-text"
                                style={{
                                    fontSize: '4rem', // Much larger
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    lineHeight: 0.9,
                                    color: 'transparent', // Outline style by default
                                    WebkitTextStroke: '1px var(--text-color)',
                                    opacity: 0.5,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <DecryptedText
                                    text={item.label}
                                    animateOn="view"
                                    speed={60}
                                    revealDirection="start"
                                />
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Mobile/Responsive Styles */}
                <style>{`
                    .nav-link-container:hover .nav-link-text {
                        color: var(--text-color); /* Fill in on hover */
                        opacity: 1;
                        text-shadow: 4px 4px 0px var(--accent-color);
                        transform: translateX(20px);
                    }
                    
                    @media (max-width: 900px) {
                        .nav-link-text {
                            fontSize: '1.5rem' !important;
                        }
                        h1 {
                            fontSize: '25vw' !important;
                        }
                    }
                `}</style>
            </div>
        </PageTransition>
    );
};

export default Home;
