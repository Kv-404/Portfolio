import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';
import InteractiveTerminal from '../components/InteractiveTerminal';

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 40, damping: 14 } }
};

const quickLinks = [
    { label: 'PROJECTS', to: '/projects', icon: '◈' },
    { label: 'CAREER', to: '/career', icon: '◇' },
    { label: 'ABOUT', to: '/about', icon: '◆' },
    { label: 'SOCIALS', to: '/socials', icon: '◎' },
    { label: 'CONTACT', to: '/contact', icon: '◉' },
];

export default function Home() {
    const [time, setTime] = useState('');
    const nav = useNavigate();

    useEffect(() => {
        const tick = () => {
            const d = new Date();
            setTime(d.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0'));
        };
        tick();
        const id = setInterval(tick, 100);
        return () => clearInterval(id);
    }, []);

    return (
        <PageTransition>
            <div className="page-shell" style={{ justifyContent: 'space-between' }}>

                {/* Top bar */}
                <header className="topbar">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.15rem' }}>
                        <span className="topbar-brand" style={{ fontSize: '1.1rem' }}>
                            <DecryptedText text="KV_404" speed={60} animateOn="view" revealDirection="start" />
                        </span>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: .4 }}
                            transition={{ delay: 1.5, duration: .8 }}
                            className="mono"
                            style={{ fontSize: '.6rem', letterSpacing: '3px' }}
                        >
                            FULL_STACK_OPERATIVE
                        </motion.span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <motion.span
                            className="mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: .3 }}
                            transition={{ delay: 2 }}
                            style={{ fontSize: '.6rem', letterSpacing: '1px' }}
                        >
                            {time}
                        </motion.span>
                        <div className="topbar-status">
                            <motion.div
                                className="status-dot"
                                animate={{ boxShadow: ['0 0 4px rgba(57,255,20,.4)', '0 0 14px rgba(57,255,20,.9)', '0 0 4px rgba(57,255,20,.4)'] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                            <span>[ONLINE]</span>
                        </div>
                    </div>
                </header>

                {/* Under Construction Banner */}
                <motion.div
                    className="construction-banner"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.6 }}
                >
                    <span className="construction-banner__text">
                        ⚠ SITE UNDER CONSTRUCTION — SOME MODULES ARE STILL BEING DEPLOYED — EXPECT GLITCHES
                    </span>
                </motion.div>

                {/* Main — Split panel */}
                <main className="home-split">

                    {/* Left: Hero identity */}
                    <motion.div
                        className="home-hero"
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.div variants={fadeUp} className="home-hero__identity">
                            <h1 className="home-hero__name">
                                <DecryptedText text="KV_404" speed={55} animateOn="view" revealDirection="start" />
                            </h1>
                            <div className="home-hero__role">
                                <span className="home-hero__role-dot" />
                                <DecryptedText text="FULL_STACK_OPERATIVE" speed={35} animateOn="view" revealDirection="start" />
                            </div>
                        </motion.div>

                        <motion.p variants={fadeUp} className="home-hero__desc mono">
                            Building immersive digital experiences with code, shaders, and obsessive attention to detail.
                        </motion.p>

                        {/* Quick nav links */}
                        <motion.div variants={fadeUp} className="home-hero__nav">
                            {quickLinks.map((link) => (
                                <button
                                    key={link.label}
                                    className="home-hero__nav-btn btn"
                                    onClick={() => nav(link.to)}
                                >
                                    <span className="home-hero__nav-icon">{link.icon}</span>
                                    {link.label}
                                </button>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeUp} className="home-hero__hint mono">
                            <span style={{ color: 'var(--accent)', opacity: .6 }}>TIP:</span> Type <code>help</code> in the terminal →
                        </motion.div>
                    </motion.div>

                    {/* Right: Terminal */}
                    <motion.div
                        className="home-terminal"
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <InteractiveTerminal />
                    </motion.div>
                </main>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: .3 }}
                    transition={{ delay: 2.5, duration: 1 }}
                    className="mono"
                    style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2.5rem', fontSize: '.55rem', letterSpacing: '2px', borderTop: '1px solid var(--border)' }}
                >
                    <span>SYS_V2.1</span>
                    <span style={{ animation: 'flicker 5s infinite' }}>UPTIME: CONTINUOUS</span>
                    <span>ENCRYPTED_CHANNEL</span>
                </motion.footer>
            </div>
        </PageTransition>
    );
}
