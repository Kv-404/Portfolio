import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const Redacted = ({ children }) => (
    <span style={{ background: 'var(--fg)', color: 'transparent', padding: '0 4px', borderRadius: '1px', userSelect: 'none', display: 'inline-block', lineHeight: 'inherit' }}>
        <span style={{ opacity: 0, pointerEvents: 'none' }}>{children}</span>
    </span>
);

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const fade = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const skills = ['REACT', 'NODE.JS', 'THREE.JS', 'FRAMER_MOTION', 'TYPESCRIPT', 'UI/UX', 'POSTGRESQL', 'DOCKER'];

export default function About() {
    return (
        <PageTransition>
            <div className="page-shell" style={{ padding: '6rem 2.5rem 3rem' }}>
                <header className="topbar">
                    <Link to="/" className="btn" style={{ opacity: .7 }}>
                        <DecryptedText text="< ROOT" animateOn="hover" speed={50} />
                    </Link>
                    <span className="topbar-status" style={{ opacity: .5 }}>
                        <DecryptedText text="ABOUT // IDENTITY_FILE" animateOn="view" revealDirection="end" />
                    </span>
                </header>

                <motion.div variants={stagger} initial="hidden" animate="show" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem', alignItems: 'start' }}>

                    {/* Left — ID Card */}
                    <motion.div variants={fade} className="card" style={{ textAlign: 'center' }}>
                        <div style={{ width: 90, height: 90, borderRadius: '50%', border: '1px solid rgba(57,255,20,.2)', background: 'rgba(255,255,255,.05)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)' }}>KV</span>
                        </div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '.3rem' }}>KV_404</h3>
                        <p className="mono" style={{ fontSize: '.7rem', opacity: .5, marginBottom: '1.5rem' }}>FULL_STACK_OPERATIVE</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', fontSize: '.8rem', textAlign: 'left' }}>
                            {[
                                ['STATUS', <span style={{ color: 'var(--accent)' }}>ONLINE</span>],
                                ['LOC', <Redacted>UNKNOWN_SECTOR</Redacted>],
                                ['CLEARANCE', <Redacted>LEVEL_5</Redacted>],
                            ].map(([label, val], i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '.4rem' }}>
                                    <span style={{ opacity: .4 }}>{label}:</span>
                                    {val}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Bio & Skills */}
                    <div>
                        <motion.div variants={fade} style={{ marginBottom: '2.5rem' }}>
                            <div className="section-hdr"><span className="dot" /> BIO_DATA_LOG</div>
                            <div style={{ lineHeight: 1.8, opacity: .75, fontSize: '1rem', maxWidth: 700 }}>
                                <Redacted>A creative developer focused on building immersive digital experiences. Blending technical precision with artistic direction to create interfaces that feel alive.</Redacted>
                            </div>
                            <br />
                            <div style={{ lineHeight: 1.8, opacity: .75, fontSize: '1rem', maxWidth: 700 }}>
                                <Redacted>Specializing in frontend performance, WebGL interactions, and clean architectural patterns. Currently operating in stealth mode.</Redacted>
                            </div>
                        </motion.div>

                        <motion.div variants={fade}>
                            <div className="section-hdr"><span className="dot" /> EQUIPPED_MODULES</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.8rem' }}>
                                {skills.map(s => (
                                    <div key={s} className="card" style={{ padding: '.45rem .9rem' }}>
                                        <Redacted>{s}</Redacted>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
