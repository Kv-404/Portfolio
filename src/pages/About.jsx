import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const Redacted = ({ children, delay = 0 }) => {
    return (
        <span
            style={{
                background: 'var(--text-color)',
                color: 'transparent',
                padding: '0 4px',
                borderRadius: '2px',
                display: 'inline-block', // Ensures block shape
                lineHeight: 'inherit',
                userSelect: 'none', // Prevent selection to peek
                cursor: 'default'
            }}
        >
            <span style={{ opacity: 0, pointerEvents: 'none' }}>
                {children}
            </span>
        </span>
    );
};

const About = () => {
    return (
        <PageTransition>
            <main className="container" style={{ alignItems: 'flex-start', paddingTop: '6rem' }}>
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '4rem',
                    textAlign: 'right',
                    zIndex: 10
                }}>
                    <h2 style={{ fontSize: '1rem', opacity: 0.5, letterSpacing: '2px' }}>
                        <DecryptedText text="ABOUT // IDENTITY_FILE" animateOn="view" revealDirection="end" />
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
                    display: 'grid',
                    gridTemplateColumns: 'minmax(300px, 1fr) 2fr',
                    gap: '4rem',
                    width: '100%',
                    alignItems: 'start'
                }}>
                    {/* Left Column: Stats & ID */}
                    <div className="cyber-card">
                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                margin: '0 auto 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <span style={{ fontSize: '2rem' }}>KV</span>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>KV_404</h3>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>FULL_STACK_DEV</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                <span style={{ opacity: 0.5 }}>STATUS:</span>
                                <span style={{ color: '#0f0' }}>ONLINE</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                <span style={{ opacity: 0.5 }}>LOC:</span>
                                <Redacted>UNKNOWN_SECTOR</Redacted>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                <span style={{ opacity: 0.5 }}>CLEARANCE:</span>
                                <Redacted>LEVEL_5</Redacted>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bio & Modules */}
                    <div>
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{
                                fontSize: '1rem',
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: 0.7
                            }}>
                                <span style={{ width: '10px', height: '10px', background: 'var(--accent-color)' }}></span>
                                BIO_DATA_LOG
                            </h3>
                            <div style={{ lineHeight: '1.8', opacity: 0.8, fontSize: '1.1rem', maxWidth: '800px' }}>
                                <Redacted>
                                    A creative developer focused on building immersive digital experiences. Blending technical precision with artistic direction to create interfaces that feel alive.
                                </Redacted>
                            </div>
                            <br />
                            <div style={{ lineHeight: '1.8', opacity: 0.8, fontSize: '1.1rem', maxWidth: '800px' }}>
                                <Redacted>
                                    Specializing in frontend performance, WebGL interactions, and clean architectural patterns. Currently operating in stealth mode, building the next generation of web applications.
                                </Redacted>
                            </div>
                        </div>

                        <div>
                            <h3 style={{
                                fontSize: '1rem',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: 0.7
                            }}>
                                <span style={{ width: '10px', height: '10px', background: 'var(--accent-color)' }}></span>
                                EQUIPPED_MODULES
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {['REACT', 'NODE.JS', 'THREE.JS', 'FRAMER_MOTION', 'TYPESCRIPT', 'UI/UX', 'POSTGRESQL', 'DOCKER'].map(skill => (
                                    <div key={skill} style={{
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.8rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        fontFamily: "'Space Mono', monospace"
                                    }}>
                                        <Redacted>{skill}</Redacted>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
};

export default About;
