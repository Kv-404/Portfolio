import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const socials = [
    { name: 'X_TWITTER', url: 'https://x.com/Kv404_', id: 'NET-01', status: 'ACTIVE' },
    { name: 'INSTAGRAM', url: 'https://www.instagram.com/theycallmekv__/', id: 'NET-02', status: 'ACTIVE' },
    { name: 'BLUESKY', url: 'https://bsky.app/profile/kv404.dev', id: 'NET-03', status: 'STANDBY' },
    { name: 'SPOTIFY', url: 'https://open.spotify.com/user/31wls23lf323kkxjxa73pieq2owy?si=306bac6302ae4fa9', id: 'AUDIO-01', status: 'LISTENING' }
];

export default function Socials() {
    const [hovered, setHovered] = useState(null);

    return (
        <PageTransition>
            <div className="page-shell" style={{ justifyContent: 'center', alignItems: 'center', padding: '6rem 2.5rem 3rem' }}>
                <header className="topbar">
                    <Link to="/" className="btn" style={{ opacity: .7 }}>
                        <DecryptedText text="< ROOT" animateOn="hover" speed={50} />
                    </Link>
                    <span className="topbar-status" style={{ opacity: .5 }}>
                        <DecryptedText text="NETWORK // UPLINKS" animateOn="view" revealDirection="end" />
                    </span>
                </header>

                <div className="card" style={{ width: '100%', maxWidth: 600, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {socials.map((s, i) => (
                        <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '1.3rem 1rem', textDecoration: 'none', cursor: 'none', position: 'relative',
                                background: hovered === i ? 'rgba(57,255,20,.04)' : 'transparent',
                                borderLeft: hovered === i ? '3px solid var(--accent)' : '3px solid transparent',
                                transition: 'all .25s'
                            }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <span className="mono" style={{ fontSize: '.7rem', opacity: hovered === i ? 1 : .3, color: hovered === i ? 'var(--accent)' : 'var(--fg)', width: '55px', transition: 'all .25s' }}>
                                    {s.id}
                                </span>
                                <span style={{ fontSize: '1.6rem', fontWeight: 700, opacity: hovered === i ? 1 : .6, letterSpacing: hovered === i ? '2px' : '0', transition: 'all .3s' }}>
                                    {s.name}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', opacity: hovered === i ? 1 : 0, transform: hovered === i ? 'translateX(0)' : 'translateX(-15px)', transition: 'all .3s' }}>
                                <span className="tag">[{s.status}]</span>
                                <span style={{ fontSize: '1rem' }}>↗</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </PageTransition>
    );
}
