import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 55, damping: 14 } } };

const timeline = [
    {
        id: 'OP-04',
        role: 'FULL_STACK_DEVELOPER',
        org: 'FREELANCE // INDEPENDENT',
        period: '2024 — PRESENT',
        status: 'ACTIVE',
        desc: 'Building custom web applications, portfolio sites, and interactive experiences for clients. Specializing in React, WebGL, and modern frontend stacks.',
        tech: ['React', 'Next.js', 'Three.js', 'Node.js'],
    },
    {
        id: 'OP-03',
        role: 'FRONTEND_INTERN',
        org: '[REDACTED] // STARTUP',
        period: '2023 — 2024',
        status: 'COMPLETED',
        desc: 'Developed responsive UI components and integrated REST APIs. Collaborated with design team on user experience improvements.',
        tech: ['React', 'TypeScript', 'REST APIs'],
    },
    {
        id: 'OP-02',
        role: 'CS_UNDERGRADUATE',
        org: 'UNIVERSITY // COMPUTER_SCIENCE',
        period: '2021 — 2025',
        status: 'IN_PROGRESS',
        desc: 'Pursuing Bachelor of Technology in Computer Science. Coursework in algorithms, data structures, databases, and software engineering.',
        tech: ['C++', 'Python', 'Java', 'SQL'],
    },
    {
        id: 'OP-01',
        role: 'SELF_TAUGHT_DEV',
        org: 'INDEPENDENT // OPEN_SOURCE',
        period: '2019 — 2021',
        status: 'ARCHIVED',
        desc: 'Started coding journey with web fundamentals. Built personal projects, contributed to open source, and learned through online resources.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Git'],
    },
];

export default function Career() {
    return (
        <PageTransition>
            <div className="page-shell" style={{ padding: '6rem 2.5rem 3rem' }}>
                <header className="topbar">
                    <Link to="/" className="btn" style={{ opacity: .7 }}>
                        <DecryptedText text="< ROOT" animateOn="hover" speed={50} />
                    </Link>
                    <span className="topbar-status" style={{ opacity: .5 }}>
                        <DecryptedText text="CAREER // MISSION_LOG" animateOn="view" revealDirection="end" />
                    </span>
                </header>

                <motion.div variants={stagger} initial="hidden" animate="show" style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>

                    {/* Header */}
                    <motion.div variants={fade} style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '.5rem', letterSpacing: '-1px' }}>
                            <DecryptedText text="MISSION_HISTORY" animateOn="view" speed={80} />
                        </h1>
                        <p className="mono" style={{ fontSize: '.75rem', opacity: .4 }}>&gt; OPERATIONAL_TIMELINE // ACTIVE_SINCE_2019</p>
                    </motion.div>

                    {/* Timeline */}
                    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                        {/* Vertical line */}
                        <div style={{ position: 'absolute', left: '6px', top: 0, bottom: 0, width: '1px', background: 'var(--border)' }} />

                        {timeline.map((item, i) => (
                            <motion.div
                                key={item.id}
                                variants={fade}
                                style={{ marginBottom: i < timeline.length - 1 ? '2rem' : 0, position: 'relative' }}
                            >
                                {/* Dot on timeline */}
                                <div style={{
                                    position: 'absolute', left: '-2rem', top: '1.5rem',
                                    width: '13px', height: '13px', borderRadius: '50%',
                                    background: item.status === 'ACTIVE' ? 'var(--accent)' : 'var(--card-bg)',
                                    border: `2px solid ${item.status === 'ACTIVE' ? 'var(--accent)' : 'rgba(57,255,20,.3)'}`,
                                    boxShadow: item.status === 'ACTIVE' ? '0 0 10px rgba(57,255,20,.4)' : 'none',
                                    zIndex: 2
                                }} />

                                <div className="card" style={{ padding: 0 }}>
                                    {/* Card header */}
                                    <div style={{
                                        padding: '1rem 1.5rem',
                                        borderBottom: '1px solid var(--border)',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        background: 'rgba(57,255,20,.015)',
                                        flexWrap: 'wrap', gap: '.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span className="mono" style={{ fontSize: '.7rem', opacity: .4 }}>{item.id}</span>
                                            <span className="mono" style={{ fontSize: '.7rem', opacity: .5 }}>{item.period}</span>
                                        </div>
                                        <span className="tag" style={
                                            item.status === 'ACTIVE' ? { boxShadow: '0 0 8px rgba(57,255,20,.2)' } :
                                            item.status === 'ARCHIVED' ? { borderColor: 'rgba(255,68,68,.3)', color: '#ff4444' } : {}
                                        }>
                                            {item.status}
                                        </span>
                                    </div>

                                    {/* Card body */}
                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '.3rem', color: item.status === 'ACTIVE' ? 'var(--accent)' : 'var(--fg)' }}>
                                            <DecryptedText text={item.role} animateOn="view" speed={50} />
                                        </h3>
                                        <p className="mono" style={{ fontSize: '.7rem', opacity: .5, marginBottom: '1rem' }}>@ {item.org}</p>
                                        <p style={{ fontSize: '.85rem', opacity: .6, lineHeight: 1.6, marginBottom: '1.2rem' }}>{item.desc}</p>
                                        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                                            {item.tech.map(t => <span key={t} className="tag">{t}</span>)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div variants={fade} className="mono" style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '.7rem', opacity: .35 }}>
                        &gt; END_OF_LOG // MORE_OPERATIONS_PENDING
                    </motion.div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
