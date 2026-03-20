import { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import { playCrtFlicker } from '../../utils/sounds';
import styles from './BootScreen.module.css';

// ^N = Typed.js inline pause for N milliseconds
const BIOS_TEXT =
  `Award Modular BIOS v4.51PG, An Energy Star Ally^50<br>` +
  `Copyright (C) 1984-98, Award Software, Inc.^500<br>` +
  `<br>` +
  `Intel Pentium II 333MHz^50<br>` +
  `Memory Test : 65536K OK^400<br>` +
  `<br>` +
  `Award Plug and Play BIOS Extension v1.0A^50<br>` +
  `Initialize Plug and Play Cards...^80<br>` +
  `PnP Init Completed^400<br>` +
  `<br>` +
  `Detecting IDE Primary Master  ... ST38641A^60<br>` +
  `Detecting IDE Primary Slave   ... None^60<br>` +
  `Detecting IDE Secondary Master... SAMSUNG CD-ROM^60<br>` +
  `Detecting IDE Secondary Slave ... None^400<br>` +
  `<br>` +
  `Press DEL to enter SETUP^100<br>` +
  `Press F8 for BBS POPUP^400<br>` +
  `<br>` +
  `Verifying DMI Pool Data .......^300<br>` +
  `Boot from CD :<br>` +
  `No bootable disk.^300<br>` +
  `<br>` +
  `Boot from HDD-0 ...^600<br>` +
  `<br>` +
  `Starting Windows 97...`;

// Flicker phase sequence after typing ends:
// typing → hold(800ms) → flicker1(90ms white) → gap(55ms black) → flicker2(110ms white) → dark(600ms) → done
const FLICKER_SEQUENCE = [
  { phase: 'hold',     duration: 800  },
  { phase: 'flicker',  duration: 90,  sound: true },
  { phase: 'gap',      duration: 55   },
  { phase: 'flicker',  duration: 110  },
  { phase: 'dark',     duration: 600  },
];

export function BootScreen({ onComplete }) {
  const elRef = useRef(null);
  const [screenPhase, setScreenPhase] = useState('typing'); // 'typing' | 'hold' | 'flicker' | 'gap' | 'dark'

  useEffect(() => {
    const typed = new Typed(elRef.current, {
      strings: [BIOS_TEXT],
      typeSpeed: 18,
      showCursor: false,
      contentType: 'html',
      onComplete: () => {
        let delay = 0;
        FLICKER_SEQUENCE.forEach(({ phase, duration, sound }) => {
          setTimeout(() => {
            setScreenPhase(phase);
            if (sound) playCrtFlicker();
          }, delay);
          delay += duration;
        });
        setTimeout(onComplete, delay);
      },
    });

    return () => typed.destroy();
  }, [onComplete]);

  const isFlicker = screenPhase === 'flicker';
  const isDark    = screenPhase === 'dark';

  return (
    <div
      className={`${styles.screen} ${isFlicker ? styles.screenFlicker : ''} ${isDark ? styles.screenDark : ''}`}
    >
      <div className={`${styles.textArea} ${isDark ? styles.hidden : ''}`}>
        <span ref={elRef} />
      </div>
    </div>
  );
}
