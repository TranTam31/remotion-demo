import React from 'react';
import {
  AbsoluteFill,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const colors = {
  ink: '#10212b',
  cream: '#f6f1e8',
  coral: '#ff7058',
  teal: '#4faaa0',
  yellow: '#f5c95b',
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Grid = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      opacity: 0.18,
      backgroundImage:
        'linear-gradient(rgba(16,33,43,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(16,33,43,.22) 1px, transparent 1px)',
      backgroundSize: '64px 64px',
      maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
    }}
  />
);

const FloatingShape = ({
  color,
  size,
  left,
  top,
  delay,
}: {
  color: string;
  size: number;
  left: string;
  top: string;
  delay: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drift = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 18, stiffness: 55}});
  const rotation = interpolate(frame, [0, 150], [0, 22], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: color,
        transform: `translateY(${interpolate(drift, [0, 1], [40, -12])}px) rotate(${rotation}deg)`,
        boxShadow: `0 ${size * 0.12}px ${size * 0.22}px rgba(16,33,43,.14)`,
      }}
    />
  );
};

const Demo = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleIn = spring({frame: frame - 8, fps, config: {damping: 14, stiffness: 100}});
  const detailIn = spring({frame: frame - 28, fps, config: {damping: 16, stiffness: 80}});
  const progress = interpolate(frame, [0, 150], [0, 1], clamp);
  const titleY = interpolate(titleIn, [0, 1], [72, 0], clamp);
  const titleOpacity = interpolate(titleIn, [0, 1], [0, 1], clamp);
  const detailY = interpolate(detailIn, [0, 1], [24, 0], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: colors.cream, color: colors.ink, fontFamily: 'Arial, sans-serif', overflow: 'hidden'}}>
      <Grid />
      <FloatingShape color={colors.coral} size={118} left="10%" top="16%" delay={0} />
      <FloatingShape color={colors.teal} size={72} left="82%" top="25%" delay={12} />
      <FloatingShape color={colors.yellow} size={52} left="74%" top="72%" delay={20} />

      <div style={{position: 'absolute', top: 76, left: 88, right: 88, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 4}}>STUDIO  /  01</div>
        <div style={{fontSize: 18, fontWeight: 700, opacity: 0.6}}>MOTION DESIGN</div>
      </div>

      <div style={{position: 'absolute', left: 88, top: 220, transform: `translateY(${titleY}px)`, opacity: titleOpacity}}>
        <div style={{fontSize: 26, fontWeight: 700, color: colors.coral, marginBottom: 18}}>A REACT VIDEO FRAMEWORK</div>
        <div style={{fontSize: 142, lineHeight: 0.86, fontWeight: 900, letterSpacing: -6}}>REMOTION</div>
        <div style={{marginTop: 34, width: 650, fontSize: 30, lineHeight: 1.28, fontWeight: 500}}>
          Code your story. Render every frame.
        </div>
      </div>

      <div style={{position: 'absolute', left: 92, bottom: 82, transform: `translateY(${detailY}px)`, opacity: detailIn}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 20, fontWeight: 700}}>
          <span style={{width: 14, height: 14, borderRadius: 99, backgroundColor: colors.coral}} />
          00:00:05:00
          <span style={{fontWeight: 400, opacity: 0.5}}> / </span>
          1920 × 1080
        </div>
        <div style={{marginTop: 22, width: 580, height: 10, borderRadius: 5, backgroundColor: 'rgba(16,33,43,.14)', overflow: 'hidden'}}>
          <div style={{width: `${progress * 100}%`, height: '100%', backgroundColor: colors.coral}} />
        </div>
      </div>

      <div style={{position: 'absolute', right: 88, bottom: 84, fontSize: 18, fontWeight: 700, writingMode: 'vertical-rl', transform: 'rotate(180deg)', opacity: 0.55}}>
        OPEN SOURCE / FRAME BY FRAME
      </div>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={150} fps={30} width={1920} height={1080} />
  </>
);
