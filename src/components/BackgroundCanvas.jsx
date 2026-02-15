
import React from 'react';
import Dither from './Dither';

const BackgroundCanvas = ({ intensity = 0.5 }) => {
  // Map intensity (0.0 to 1.0) to component parameters
  // Default (0.5) matches the user's "perfect" settings.
  // We lock pixelSize and colorNum to preserve the "dither look" the user likes.
  // Slider only controls the "chaos" (amplitude, frequency, speed).

  const amplitude = intensity * 0.6;          // 0.0 to 0.6 (at 0.5 -> 0.3)
  const speed = intensity * 0.04;             // 0.0 to 0.04 (at 0.5 -> 0.02)

  // Locked aesthetic params based on user's "perfect" feedback
  const frequency = 1.0;  // Spread out look
  const pxSize = 3;
  const colors = 6;

  return (
    <div
      id="bgCanvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      <Dither
        waveColor={[0.5, 0.5, 0.5]}
        disableAnimation={false}
        enableMouseInteraction={true}
        mouseRadius={0.25}
        colorNum={6}
        pixelSize={3}
        waveAmplitude={amplitude}
        waveFrequency={frequency}
        waveSpeed={speed}
      />
    </div>
  );
};

export default BackgroundCanvas;
