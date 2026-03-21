


const Scanlines = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 9998,
            overflow: 'hidden',
            background: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, rgba(57, 255, 20, 0.03), rgba(0, 0, 0, 0.01), rgba(57, 255, 20, 0.03))',
            backgroundSize: '100% 2px, 3px 100%',
            opacity: 0.35
        }} />
    );
};

export default Scanlines;
