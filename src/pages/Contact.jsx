import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

export default function Contact() {
    const [btnText, setBtnText] = useState('COPY_EMAIL');
    const [status, setStatus] = useState('IDLE');
    const email = 'kv404@protonmail.com';

    const copy = () => {
        setStatus('PROCESSING');
        setBtnText('ACCESSING_CLIPBOARD...');
        navigator.clipboard.writeText(email).then(() => {
            setBtnText('SECURED ✓');
            setStatus('SUCCESS');
            setTimeout(() => { setBtnText('COPY_EMAIL'); setStatus('IDLE'); }, 2000);
        }).catch(() => {
            window.location.href = `mailto:${email}`;
            setBtnText('MAIL_CLIENT_OPENED');
            setStatus('WARN');
        });
    };

    return (
        <PageTransition>
            <div className="page-shell" style={{ justifyContent: 'center', alignItems: 'center', padding: '6rem 2.5rem 3rem' }}>
                <header className="topbar">
                    <Link to="/" className="btn" style={{ opacity: .7 }}>
                        <DecryptedText text="< ROOT" animateOn="hover" speed={50} />
                    </Link>
                    <span className="topbar-status" style={{ opacity: .5 }}>
                        <DecryptedText text="CONTACT // UPLINK" animateOn="view" revealDirection="end" />
                    </span>
                </header>

                <div className="card" style={{ maxWidth: 650, width: '100%' }}>

                    {/* Terminal preamble */}
                    <div className="mono" style={{ fontSize: '.8rem', marginBottom: '2rem', borderLeft: '2px solid var(--accent)', paddingLeft: '1rem', opacity: .7 }}>
                        <p>&gt; ESTABLISHING SECURE CONNECTION...</p>
                        <p>&gt; ENCRYPTION: AES-256</p>
                        <p>&gt; TARGET: KV_404</p>
                        <p>&gt; STATUS: READY</p>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '.8rem' }}>
                            <DecryptedText text="HELLO_WORLD" animateOn="view" speed={100} />
                        </h1>
                        <p style={{ maxWidth: 400, margin: '0 auto', opacity: .6, fontSize: '.9rem' }}>
                            Open to collaborations, freelance commissions, and classified operations.
                        </p>
                    </div>

                    {/* Email button */}
                    <div style={{ border: '1px solid var(--border)', background: 'rgba(0,0,0,.4)', marginBottom: '.8rem' }}>
                        <button onClick={copy} style={{
                            width: '100%', background: status === 'SUCCESS' ? 'var(--accent)' : 'transparent',
                            color: status === 'SUCCESS' ? '#000' : 'var(--fg)', border: 'none', padding: '1.2rem 1.5rem',
                            fontFamily: "var(--mono)", fontSize: '.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            transition: 'all .2s'
                        }}
                            onMouseEnter={e => { if (status !== 'SUCCESS') e.currentTarget.style.background = 'rgba(57,255,20,.04)'; }}
                            onMouseLeave={e => { if (status !== 'SUCCESS') e.currentTarget.style.background = 'transparent'; }}
                        >
                            <span style={{ display: 'flex', gap: '.8rem' }}>
                                <span style={{ opacity: .5 }}>$</span>
                                <DecryptedText text={btnText} animateOn="none" speed={20} />
                            </span>
                            <span>[{status}]</span>
                        </button>
                    </div>

                    {/* LinkedIn */}
                    <div style={{ border: '1px solid var(--border)', background: 'rgba(0,0,0,.4)' }}>
                        <a href="https://www.linkedin.com/in/kv404" target="_blank" rel="noopener noreferrer" style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '1.2rem 1.5rem', fontFamily: 'var(--mono)', fontSize: '.9rem', transition: 'background .2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(57,255,20,.04)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ display: 'flex', gap: '.8rem' }}>
                                <span style={{ opacity: .5 }}>$</span>
                                <DecryptedText text="LINKEDIN_UPLINK" animateOn="hover" speed={40} />
                            </span>
                            <span>[CONNECT]</span>
                        </a>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
