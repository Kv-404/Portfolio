import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const Home = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const navigate = useNavigate();

    const sections = [
        { id: '01', label: 'PROJECTS', path: '/projects', desc: 'Explore my latest work' },
        { id: '02', label: 'ABOUT', path: '/about', desc: 'Who I am & what I do' },
        { id: '03', label: 'SOCIALS', path: '/socials', desc: 'Connect across platforms' },
        { id: '04', label: 'CONTACT', path: '/contact', desc: 'Get in touch' }
    ];

    return (
        <PageTransition>
            <div className="home-container">
                {/* Header: Logo & Status */}
                <header className="home-header">
                    <div className="brand">
                        <DecryptedText
                            text="KV"
                            speed={100}
                            animateOn="view"
                            revealDirection="start"
                            className="brand-text"
                        />
                        <span className="brand-sub">Full_stack_developer</span>
                    </div>
                    <div className="status-indicator">
                        <div className={`status-dot ${hoveredIndex !== null ? 'active' : ''}`}></div>
                        <DecryptedText
                            text={hoveredIndex !== null ? 'INTERACTING...' : 'SYSTEM_ONLINE'}
                            speed={50}
                            className="status-text"
                        />
                    </div>
                </header>

                {/* Main Accordion Navigation */}
                <main className="accordion-container">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            className={`accordion-item ${hoveredIndex === index ? 'active' : ''}`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => navigate(section.path)}
                            layout
                            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                        >
                            <div className="accordion-content">
                                <div className="accordion-number">
                                    <DecryptedText text={`//${section.id}`} speed={60} animateOn="view" />
                                </div>

                                <div className="accordion-text-group">
                                    <h2 className="accordion-title">
                                        {/* Render vertical text for inactive, horizontal for active */}
                                        <span className="title-inner">
                                            {section.label}
                                        </span>
                                    </h2>

                                    <AnimatePresence>
                                        {hoveredIndex === index && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                                className="accordion-desc"
                                            >
                                                {section.desc}
                                                <div className="arrow-icon">→</div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="accordion-bg"></div>
                            </div>
                        </motion.div>
                    ))}
                </main>

                <style>{`
                    .home-container {
                        width: 100vw;
                        height: 100vh;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        position: relative;
                        z-index: 10;
                    }

                    /* Header */
                    .home-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        padding: 3rem 4rem;
                        height: 15vh;
                        box-sizing: border-box;
                    }

                    .brand {
                        display: flex;
                        flex-direction: column;
                        gap: 0.2rem;
                    }

                    .brand-text {
                        font-family: var(--font-heading);
                        font-size: 2rem;
                        font-weight: 700;
                        letter-spacing: -1px;
                        color: var(--text-color);
                    }

                    .brand-sub {
                        font-family: var(--font-body);
                        font-size: 0.8rem;
                        opacity: 0.5;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }

                    .status-indicator {
                        display: flex;
                        align-items: center;
                        gap: 0.8rem;
                    }

                    .status-dot {
                        width: 8px;
                        height: 8px;
                        background: #00ff00;
                        border-radius: 50%;
                        box-shadow: 0 0 10px #00ff00;
                        transition: all 0.3s ease;
                    }

                    .status-dot.active {
                        background: var(--accent-color);
                        box-shadow: 0 0 15px var(--accent-color);
                        animation: blink 0.5s infinite alternate;
                    }

                    .status-text {
                        font-family: 'Space Mono', monospace;
                        font-size: 0.75rem;
                        opacity: 0.7;
                        min-width: 100px; /* Prevent jump */
                        text-align: right;
                    }

                    /* Accordion */
                    .accordion-container {
                        display: flex;
                        height: 85vh;
                        width: 100%;
                        overflow: hidden;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .accordion-item {
                        position: relative;
                        height: 100%;
                        flex: 1;
                        border-right: 1px solid rgba(255, 255, 255, 0.1);
                        cursor: none; /* Custom cursor */
                        overflow: hidden;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(0, 0, 0, 0);
                        transition: background 0.4s ease;
                    }

                    .accordion-item:last-child {
                        border-right: none;
                    }

                    .accordion-item:hover, .accordion-item.active {
                        background: rgba(255, 255, 255, 0.03); 
                    }

                    .accordion-item.active {
                        flex: 4; 
                    }

                    .accordion-content {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        padding: 3rem;
                        box-sizing: border-box;
                    }

                    .accordion-number {
                        position: absolute;
                        top: 2rem;
                        left: 2rem; /* Consistent top-left for number */
                        font-family: var(--font-heading);
                        font-size: 1rem;
                        opacity: 0.4;
                        color: var(--text-color);
                    }

                    .accordion-text-group {
                        z-index: 2;
                        position: absolute;
                        bottom: 3rem;
                        left: 3rem;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .accordion-title {
                        font-family: var(--font-heading);
                        font-weight: 800;
                        line-height: 1;
                        color: rgba(255, 255, 255, 0.6);
                        text-transform: uppercase;
                        margin: 0;
                        white-space: nowrap;
                        font-size: 3rem; 
                        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                        
                        /* Vertical text logic for inactive items */
                        writing-mode: vertical-rl;
                        transform: rotate(180deg);
                        height: auto;
                        width: min-content;
                    }

                    .accordion-item.active .accordion-title {
                        writing-mode: horizontal-tb;
                        transform: rotate(0deg);
                        color: var(--text-color);
                        font-size: 4rem; /* Reduced to fit better */
                        /* Allow wrapping or resizing if really needed, but prevent overflow */
                        max-width: 100%;
                        text-shadow: 0 0 20px rgba(255,255,255,0.1);
                        width: auto;
                    }
                    
                    /* Desktop non-active state positioning */
                    @media (min-width: 901px) {
                        .accordion-item:not(.active) .accordion-text-group {
                             bottom: 50%;
                             left: 50%;
                             transform: translate(-50%, 50%);
                        }
                    }

                    .accordion-desc {
                        font-family: var(--font-body);
                        font-size: 1.2rem;
                        margin-top: 1rem;
                        color: var(--accent-color);
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }

                    .accordion-bg {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(to top, rgba(255,255,255,0.05) 0%, transparent 100%);
                        opacity: 0;
                        transition: opacity 0.5s ease;
                        z-index: 1;
                    }

                    .accordion-item.active .accordion-bg {
                        opacity: 1;
                    }

                    .arrow-icon {
                        font-size: 1.5rem;
                        transition: transform 0.3s ease;
                    }

                    .accordion-item:hover .arrow-icon {
                        transform: translateX(10px);
                    }

                    @keyframes blink {
                        0% { opacity: 0.6; }
                        100% { opacity: 1; }
                    }

                    /* Responsive Mobile: Stack vertically */
                    @media (max-width: 900px) {
                        .accordion-container {
                            flex-direction: column;
                            height: auto;
                            min-height: 85vh; /* Allow scrolling if needed, or fit */
                            padding-bottom: 80px; /* Space for range slider */
                        }
                        
                        .home-container {
                            height: auto;
                            min-height: 100vh;
                            overflow-y: auto;
                        }

                        .accordion-item {
                            width: 100%;
                            flex: none; /* Disable flex growth on mobile for simpler stacking or use fixed heights */
                            height: 15vh; /* Collapsed height */
                            border-right: none;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                            transition: height 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                        }

                        .accordion-item.active {
                            height: 40vh; /* Expanded height */
                            flex: none;
                        }

                        .accordion-title {
                            writing-mode: horizontal-tb;
                            transform: rotate(0deg);
                            font-size: 2rem;
                        }
                        
                        .accordion-item.active .accordion-title {
                            font-size: 3rem;
                        }

                        .accordion-item:not(.active) .accordion-text-group {
                            bottom: auto;
                            left: 2rem;
                            top: 50%;
                            transform: translateY(-50%);
                            align-items: flex-start;
                        }
                        
                        .accordion-text-group {
                             bottom: 2rem;
                             left: 2rem;
                             top: auto;
                             transform: none;
                        }

                        .accordion-number {
                            top: 50%;
                            right: 2rem;
                            left: auto;
                            transform: translateY(-50%);
                        }
                        
                        .home-header {
                            padding: 2rem;
                            height: auto;
                        }
                    }
                `}</style>
            </div>
        </PageTransition>
    );
};

export default Home;
