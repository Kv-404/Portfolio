import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import DecryptedText from '../components/DecryptedText';

const Projects = () => {
    const projects = [
        {
            id: 'PRJ-01',
            name: 'PORTFOLIO_V1',
            status: 'ARCHIVED',
            desc: 'The first version of my portfolio. Built with HTML, CSS, and JS.',
            tech: ['HTML5', 'CSS3', 'JS'],
            link: 'https://github.com/Kv-404/Portfolio_V1'
        },
    ];

    return (
        <PageTransition>
            <main className="container" style={{ alignItems: 'flex-start', paddingTop: '8rem' }}>
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '4rem',
                    textAlign: 'right',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.5rem'
                }}>
                    <h2 style={{ fontSize: '1rem', opacity: 0.5, letterSpacing: '2px' }}>
                        <DecryptedText text="PROJECTS // CLASS: PUBLIC" animateOn="view" revealDirection="end" />
                    </h2>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                        <a href="https://github.com/Kv-404" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7, fontSize: '0.8rem', textDecoration: 'none' }}>
                            <span style={{ color: 'var(--accent-color)' }}>&gt;</span>
                            <DecryptedText text="GITHUB_REPO" animateOn="hover" speed={80} />
                        </a>
                        <a href="https://leetcode.com/u/Kv_404/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7, fontSize: '0.8rem', textDecoration: 'none' }}>
                            <span style={{ color: 'var(--accent-color)' }}>&gt;</span>
                            <DecryptedText text="LEETCODE_STATS" animateOn="hover" speed={80} />
                        </a>
                    </div>
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
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem',
                    width: '100%',
                    marginTop: '2rem'
                }}>
                    {projects.map((project) => (
                        <div key={project.id} className="cyber-card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', padding: '0' }}>
                            {/* Card Header */}
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.02)'
                            }}>
                                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', opacity: 0.5 }}>
                                    {project.id}
                                </span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: project.status === 'ONLINE' ? '#0f0' : '#f00',
                                    border: `1px solid ${project.status === 'ONLINE' ? '#0f0' : '#f00'}`,
                                    padding: '2px 6px',
                                    borderRadius: '2px'
                                }}>
                                    {project.status}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                                    <DecryptedText text={project.name} animateOn="view" speed={60} />
                                </h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: '1.6' }}>
                                    {project.desc}
                                </p>

                                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {project.tech.map(t => (
                                        <span key={t} style={{
                                            fontSize: '0.7rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            padding: '4px 8px',
                                            opacity: 0.8
                                        }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div style={{
                                padding: '1rem',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                justifyContent: 'flex-end'
                            }}>
                                {project.link ? (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', textDecoration: 'none', display: 'inline-block' }}>
                                        ACCESS_DATA &gt;
                                    </a>
                                ) : (
                                    <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', opacity: 0.5, cursor: 'not-allowed' }}>
                                        DATA_SECURED &gt;
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Placeholder for "Work In Progress" */}
                    <div className="cyber-card" style={{
                        minHeight: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.5,
                        borderStyle: 'dashed'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>+</div>
                            <DecryptedText text="AWAITING_INPUT" animateOn="view" speed={100} />
                        </div>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
};

export default Projects;
