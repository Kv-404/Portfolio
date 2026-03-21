import FaultyTerminal from './FaultyTerminal';

const BackgroundCanvas = ({ intensity = 0.5 }) => {
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
        background: '#000'
      }}
    >
      <FaultyTerminal
        scale={1.5}
        gridMul={[2, 1]}
        digitSize={1.2}
        timeScale={0.3 + intensity * 0.2}
        pause={false}
        scanlineIntensity={0.5}
        glitchAmount={1}
        flickerAmount={0.6 + intensity * 0.4}
        noiseAmp={0.5 + intensity * 0.5}
        chromaticAberration={0}
        dither={0}
        curvature={0.08}
        tint="#A7EF9E"
        mouseReact
        mouseStrength={0.5}
        pageLoadAnimation
        brightness={0.5 + intensity * 0.3}
      />
    </div>
  );
};

export default BackgroundCanvas;
