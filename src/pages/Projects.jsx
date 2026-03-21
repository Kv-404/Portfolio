import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const allProjects = [
    {
        id: 'PRJ-01', name: 'PORTFOLIO_V1', cat: 'personal', status: 'ARCHIVED',
        desc: 'First iteration of personal site. Built from scratch with vanilla web technologies.',
        tech: ['HTML5', 'CSS3', 'JS'], link: 'https://github.com/Kv-404/Portfolio_V1'
    },
    {
        id: 'CLG-01', name: 'UNIVERSITY_NODE', cat: 'college', status: 'SECURE',
        desc: 'Academic assignment tracker and scheduling system for university coursework.',
        tech: ['React', 'NodeJS', 'MongoDB'], link: ''
    }
];

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const slide = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.35 } } };

export default function Projects() {
    const [tab, setTab] = useState('personal');
    const filtered = allProjects.filter(p => p.cat === tab);

    return (
        <PageTransition>
            <div className="page-shell" style={{ padding: '6rem 2.5rem 3rem' }}>

                {/* Topbar */}
                <header className="topbar">
                    <Link to="/" className="btn" style={{ opacity: .7 }}>
                        <DecryptedText text="< ROOT" animateOn="hover" speed={50} />
                    </Link>
                    <span className="topbar-status" style={{ opacity: .5 }}>
                        <DecryptedText text={`PROJECTS // ${tab.toUpperCase()}`} animateOn="view" revealDirection="end" />
                    </span>
                </header>

                {/* External Links */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="https://github.com/Kv-404" target="_blank" rel="noopener noreferrer" className="btn">
                        <span style={{ color: 'var(--accent)' }}>&gt;</span> GITHUB_REPO
                    </a>
                    <a href="https://leetcode.com/u/Kv_404/" target="_blank" rel="noopener noreferrer" className="btn">
                        <span style={{ color: 'var(--accent)' }}>&gt;</span> LEETCODE
                    </a>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
                    {['personal', 'college'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className="btn"
                            style={tab === t ? {
                                background: 'var(--accent)', color: '#000', borderColor: 'var(--accent)',
                                boxShadow: '0 0 15px rgba(57,255,20,.3)'
                            } : {}}
                        >
                            {t === 'personal' ? 'PERSONAL_OPS' : 'COLLEGE_OPS'}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
                    <AnimatePresence mode="popLayout">
                        {filtered.map(p => (
                            <motion.div key={p.id} layout variants={slide} initial="hidden" animate="show" exit="hidden" className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>

                                {/* Head */}
                                <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(57,255,20,.02)' }}>
                                    <span className="mono" style={{ fontSize: '.75rem', opacity: .5 }}>{p.id}</span>
                                    <span className="tag" style={p.status === 'ARCHIVED' ? { borderColor: 'rgba(255,68,68,.3)', color: '#ff4444' } : {}}>{p.status}</span>
                                </div>

                                {/* Body */}
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                        <DecryptedText text={p.name} animateOn="view" speed={60} />
                                    </h3>
                                    <p className="mono" style={{ fontSize: '.8rem', opacity: .55, lineHeight: 1.6, flex: 1 }}>{p.desc}</p>
                                    <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                                        {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
                                    </div>
                                </div>

                                {/* Foot */}
                                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                                    {p.link ? (
                                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn">ACCESS &gt;</a>
                                    ) : (
                                        <span className="btn" style={{ opacity: .35 }}>ENCRYPTED</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {/* Placeholder */}
                        <motion.div layout variants={slide} initial="hidden" animate="show" exit="hidden" className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px', borderStyle: 'dashed', opacity: .45 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', opacity: .3, marginBottom: '.8rem' }}>+</div>
                                <DecryptedText text="AWAITING_INPUT" animateOn="view" speed={100} />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </PageTransition>
    );
}
