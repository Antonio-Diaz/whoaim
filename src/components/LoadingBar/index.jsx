import { useEffect, useState } from 'react';
import { startHddSound, stopHddSound, sounds } from '../../utils/sounds';
import styles from './LoadingBar.module.css';

const SEGMENTS = 10;

export function LoadingBar({ onComplete }) {
  const [activeSegments, setActiveSegments] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      startHddSound();
    }, 300);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setActiveSegments(current);
      if (current >= SEGMENTS) {
        clearInterval(interval);
        stopHddSound();
        sounds.startup();
        setTimeout(onComplete, 1400);
      }
    }, 280);

    return () => {
      clearInterval(interval);
      stopHddSound();
    };
  }, [visible, onComplete]);

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoFlags}>
            <div className={styles.flagTL} />
            <div className={styles.flagTR} />
            <div className={styles.flagBL} />
            <div className={styles.flagBR} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.windowsWord}>Windows</span>
            <span className={styles.xpWord}>XP</span>
          </div>
        </div>

        <div className={styles.barTrack}>
          <div className={styles.barInner}>
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <div
                key={i}
                className={`${styles.segment} ${i < activeSegments ? styles.active : ''}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.copyright}>
          Copyright © Microsoft Corporation
        </div>
      </div>
    </div>
  );
}
