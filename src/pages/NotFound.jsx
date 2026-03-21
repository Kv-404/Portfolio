import { Link } from 'react-router-dom';
import BackgroundCanvas from '../components/BackgroundCanvas';
import CustomCursor from '../components/CustomCursor';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

export default function NotFound() {
    return (
        <>
            <BackgroundCanvas />
            <CustomCursor />
            <PageTransition>
                <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, padding: '2rem' }}>
                    <div className="card" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>

                        <div className="mono" style={{ fontSize: '.75rem', opacity: .5, marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '.8rem' }}>
                            <span>CRITICAL_FAILURE</span>
                            <span style={{ width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%', boxShadow: '0 0 8px var(--danger)', display: 'inline-block', animation: 'pulse-dot 1s infinite' }} />
                        </div>

                        <h1 style={{ fontSize: '8rem', lineHeight: .85, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-4px', marginBottom: '1rem' }}>404</h1>

                        <p className="mono" style={{ fontSize: '1.1rem', marginBottom: '2rem', letterSpacing: '3px' }}>
                            [<DecryptedText text="SIGNAL_LOST" speed={80} animateOn="view" />]
                        </p>

                        <div className="mono" style={{ fontSize: '.8rem', opacity: .5, textAlign: 'left', lineHeight: 1.7, marginBottom: '2rem', borderLeft: '2px solid var(--accent)', paddingLeft: '1rem' }}>
                            <p>&gt; REQUESTED SECTOR DOES NOT EXIST</p>
                            <p>&gt; RECOMMEND IMMEDIATE REBOOT</p>
                        </div>

                        <Link to="/" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
                            <DecryptedText text="INITIATE_REBOOT" speed={40} animateOn="hover" />
                        </Link>
                    </div>
                </div>
            </PageTransition>
        </>
    );
}
