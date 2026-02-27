import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const Socials = () => {
    const socialLinks = [
        { name: 'X_TWITTER', url: 'https://x.com/Kv404_', id: 'NET-01', status: 'ACTIVE' },
        { name: 'INSTAGRAM', url: 'https://www.instagram.com/theycallmekv__/', id: 'NET-02', status: 'ACTIVE' },
        { name: 'BLUESKY', url: 'https://bsky.app/profile/kv404.dev', id: 'NET-03', status: 'STANDBY' },
        { name: 'SPOTIFY', url: 'https://open.spotify.com/user/31wls23lf323kkxjxa73pieq2owy?si=306bac6302ae4fa9', id: 'AUDIO-01', status: 'LISTENING' }
    ];

    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <PageTransition>
            <main className="container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '4rem',
                    textAlign: 'right',
                    zIndex: 10
                }}>
                    <h2 style={{ fontSize: '1rem', opacity: 0.5, letterSpacing: '2px' }}>
                        <DecryptedText text="NETWORK // CONNECT" animateOn="view" revealDirection="end" />
                    </h2>
                </div>

                <Link to="/" className="btn btn-outline" style={{
                    position: 'fixed',
                    top: '2rem',
                    left: '2rem',
                    zIndex: 100,
                    fontSize: '0.8rem',
                    opacity: 0.7,
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(0,0,0,0.8)'
                }}>
                    <DecryptedText text="< RETURN_ROOT" animateOn="hover" speed={50} />
                </Link>

                <div style={{
                    width: '100%',
                    maxWidth: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    background: 'rgba(10, 10, 10, 0.4)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '1rem',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
                }}>
                    {socialLinks.map((link, index) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1.5rem 1rem',
                                textDecoration: 'none',
                                cursor: 'none',
                                position: 'relative',
                                background: hoveredIndex === index ? 'rgba(255,255,255,0.05)' : 'transparent',
                                borderLeft: hoveredIndex === index ? '4px solid var(--accent-color)' : '2px solid transparent',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <span style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: '0.8rem',
                                    opacity: hoveredIndex === index ? 1 : 0.4,
                                    width: '60px',
                                    color: hoveredIndex === index ? 'var(--accent-color)' : 'var(--text-color)',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {link.id}
                                </span>
                                <span style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    opacity: hoveredIndex === index ? 1 : 0.7,
                                    letterSpacing: hoveredIndex === index ? '2px' : '0px',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {link.name}
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                opacity: hoveredIndex === index ? 1 : 0,
                                transform: hoveredIndex === index ? 'translateX(0)' : 'translateX(-20px)',
                                transition: 'all 0.3s ease'
                            }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--accent-color)', fontFamily: "'Space Mono', monospace" }}>
                                    [{link.status}]
                                </span>
                                <span style={{ fontSize: '1.2rem' }}>&nearr;</span>
                            </div>
                        </a>
                    ))}
                </div>
            </main>
        </PageTransition>
    );
};

export default Socials;
