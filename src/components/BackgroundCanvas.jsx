import Dither from './Dither';

const BackgroundCanvas = ({ intensity = 0.5 }) => {
  const amplitude = intensity * 0.6;
  const speed = intensity * 0.04;

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
        waveFrequency={1.0}
        waveSpeed={speed}
      />
    </div>
  );
};

export default BackgroundCanvas;
