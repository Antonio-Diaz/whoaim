import { useEffect, useState, useCallback } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { sounds } from '../../utils/sounds';
import styles from './Taskbar.module.css';

const WINDOW_ICONS = {
  profile:    '🖥️',
  curriculum: '📄',
  projects:   '💼',
  skills:     '🛠️',
  contact:    '📬',
  recycle:    '🗑️',
};

export function Taskbar() {
  const { windows, focusWindow, minimizeWindow, toggleStartMenu, startMenuOpen } = useWindowStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindows = Object.entries(windows).filter(([, w]) => w.isOpen);

  const handleWindowBtn = useCallback((e, id) => {
    e.stopPropagation();
    sounds.click();
    const win = windows[id];
    if (win.isMinimized) {
      focusWindow(id);
    } else {
      minimizeWindow(id);
    }
  }, [windows, focusWindow, minimizeWindow]);

  const handleStartClick = useCallback((e) => {
    e.stopPropagation();
    sounds.click();
    toggleStartMenu();
  }, [toggleStartMenu]);

  const formatTime = (d) =>
    d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.taskbar}>
      {/* Start Button */}
      <button
        className={`${styles.startBtn} ${startMenuOpen ? styles.startBtnActive : ''}`}
        onClick={handleStartClick}
      >
        <span className={styles.startFlags}>
          <span className={styles.flagTL} />
          <span className={styles.flagTR} />
          <span className={styles.flagBL} />
          <span className={styles.flagBR} />
        </span>
        <span className={styles.startText}>Inicio</span>
      </button>

      {/* Separator */}
      <div className={styles.separator} />

      {/* Window buttons */}
      <div className={styles.windowBtns}>
        {openWindows.map(([id, win]) => (
          <button
            key={id}
            className={`${styles.windowBtn} ${!win.isMinimized ? styles.windowBtnActive : ''}`}
            onClick={(e) => handleWindowBtn(e, id)}
          >
            <span className={styles.wBtnIcon}>{WINDOW_ICONS[id]}</span>
            <span className={styles.wBtnText}>{win.title}</span>
          </button>
        ))}
      </div>

      {/* System tray */}
      <div className={styles.tray}>
        <span className={styles.trayIcon}>🔊</span>
        <div className={styles.clock}>{formatTime(time)}</div>
      </div>
    </div>
  );
}
