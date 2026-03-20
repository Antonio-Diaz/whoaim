import { useState, useCallback } from 'react';
import { BootScreen } from './components/BootScreen';
import { LoadingBar } from './components/LoadingBar';
import { Desktop } from './components/Desktop';
import { MobileBlock } from './components/MobileBlock';
import { useIsMobile } from './hooks/useIsMobile';

export default function App() {
  const [phase, setPhase] = useState('boot'); // 'boot' | 'loading' | 'desktop'
  const isMobile = useIsMobile();

  const handleBootComplete = useCallback(() => {
    setPhase('loading');
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setPhase('desktop');
  }, []);

  if (isMobile) {
    return <MobileBlock />;
  }

  return (
    <>
      {phase === 'boot' && (
        <BootScreen onComplete={handleBootComplete} />
      )}
      {phase === 'loading' && (
        <LoadingBar onComplete={handleLoadingComplete} />
      )}
      {phase === 'desktop' && (
        <Desktop />
      )}
    </>
  );
}
