import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PageTransition = ({ children, className = '' }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                navigate('/');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] // Custom cubic bezier for smooth "cyber" feel
            }}
            className={className}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
