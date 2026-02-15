
import React from 'react';
import { Outlet } from 'react-router-dom';
import BackgroundCanvas from './BackgroundCanvas';
import CustomCursor from './CustomCursor';

import Scanlines from './Scanlines';

const Layout = () => {
    // Default intensity 0.5 (matches current "tuned" look), range 0.0 to 1.0
    const [ditherIntensity, setDitherIntensity] = React.useState(0.5);

    return (
        <>
            <style>
                {`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 1px;
                    height: 16px;
                    background: var(--accent-color);
                    cursor: none; // Match site-wide custom cursor
                    border: none;
                }
                input[type=range]::-moz-range-thumb {
                    width: 1px;
                    height: 16px;
                    background: var(--accent-color);
                    cursor: none; // Match site-wide custom cursor
                    border: none;
                }
                input[type=range] {
                    -webkit-appearance: none;
                    background: rgba(255, 255, 255, 0.2);
                    height: 1px;
                    border-radius: 0;
                    cursor: none; // Match site-wide custom cursor
                }
                `}
            </style>
            <Scanlines />
            <BackgroundCanvas intensity={ditherIntensity} />
            <CustomCursor />
            <div className="fade-in">
                <Outlet />
            </div>

            {/* Intensity Slider - Bottom Left, Thin */}
            <div
                className="hover-trigger" // Make custom cursor react
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: '2rem',
                    zIndex: 100,
                    width: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.5,
                    transition: 'opacity 0.3s',
                    cursor: 'none' // Ensure container also has no cursor
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
            >
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={ditherIntensity}
                    onChange={(e) => setDitherIntensity(parseFloat(e.target.value))}
                    style={{
                        width: '100%',
                        height: '1px',
                        cursor: 'none', // Critical: hide system cursor
                        accentColor: 'transparent',
                    }}
                />
            </div>
        </>
    );
};

export default Layout;
