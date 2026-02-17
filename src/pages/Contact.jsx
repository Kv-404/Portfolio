import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const Contact = () => {
    const [emailBtnText, setEmailBtnText] = useState('INITIATE_COPY');
    const [status, setStatus] = useState('IDLE');
    const email = 'kv404@protonmail.com';

    const handleEmailClick = () => {
        setStatus('PROCESSING');
        setEmailBtnText('ACCESSING_CLIPBOARD...');

        navigator.clipboard.writeText(email).then(() => {
            setEmailBtnText('ADDRESS_SECURED');
            setStatus('SUCCESS');

            setTimeout(() => {
                setEmailBtnText('INITIATE_COPY');
                setStatus('IDLE');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            window.location.href = `mailto:${email}`;
            setEmailBtnText('MAIL_CLIENT_OPENED');
            setStatus('WARN');
        });
    };

    return (
        <PageTransition>
            <main className="container">
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '4rem',
                    textAlign: 'right',
                    zIndex: 10
                }}>
                    <h2 style={{ fontSize: '1rem', opacity: 0.5, letterSpacing: '2px' }}>
                        <DecryptedText text="CONTACT // UPLINK" animateOn="view" revealDirection="end" />
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

                <div className="cyber-card" style={{ maxWidth: '700px', border: 'none', background: 'transparent', boxShadow: 'none' }}>
                    <div style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '0.9rem',
                        marginBottom: '2rem',
                        borderLeft: '2px solid var(--accent-color)',
                        paddingLeft: '1rem',
                        opacity: 0.8
                    }}>
                        <p>&gt; ESTABLISHING SECURE CONNECTION...</p>
                        <p>&gt; ENCRYPTION: AES-256</p>
                        <p>&gt; TARGET: KV_404</p>
                        <p>&gt; STATUS: READY</p>
                    </div>

                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '4rem', lineHeight: '1', marginBottom: '1rem' }}>
                            <DecryptedText text="HELLO_WORLD" animateOn="view" speed={100} />
                        </h1>
                        <p style={{ maxWidth: '400px', margin: '0 auto', opacity: 0.7 }}>
                            Open to collaborations, freelance commissions, and classified operations.
                        </p>
                    </div>

                    <div style={{
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '2px',
                        background: 'rgba(0,0,0,0.5)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={handleEmailClick}
                            style={{
                                width: '100%',
                                background: status === 'SUCCESS' ? 'var(--accent-color)' : 'transparent',
                                color: status === 'SUCCESS' ? '#000' : '#fff',
                                border: 'none',
                                padding: '1.5rem',
                                fontFamily: "'Space Mono', monospace",
                                fontSize: '1rem',
                                cursor: 'none',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            onMouseEnter={(e) => {
                                if (status !== 'SUCCESS') {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (status !== 'SUCCESS') {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <span style={{ display: 'flex', gap: '1rem' }}>
                                <span style={{ opacity: 0.5 }}>$</span>
                                <DecryptedText text={emailBtnText} animateOn="none" speed={20} />
                            </span>
                            <span>[{status}]</span>
                        </button>
                    </div>

                    <div style={{
                        marginTop: '1rem',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '2px',
                        background: 'rgba(0,0,0,0.5)',
                        position: 'relative'
                    }}>
                        <a
                            href="https://www.linkedin.com/in/kv404"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '100%',
                                background: 'transparent',
                                color: '#fff',
                                textDecoration: 'none',
                                padding: '1.5rem',
                                fontFamily: "'Space Mono', monospace",
                                fontSize: '1rem',
                                cursor: 'none',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <span style={{ display: 'flex', gap: '1rem' }}>
                                <span style={{ opacity: 0.5 }}>$</span>
                                <DecryptedText text="ESTABLISH_LINKEDIN_UPLINK" animateOn="hover" speed={40} />
                            </span>
                            <span>[CONNECT]</span>
                        </a>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
};

export default Contact;
