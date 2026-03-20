import { useEffect, useRef, useCallback, useState } from 'react';
import interact from 'interactjs';
import { useWindowStore } from '../../store/windowStore';
import { sounds } from '../../utils/sounds';
import styles from './Window.module.css';
import 'animate.css';

const WINDOW_ICONS = {
  profile:    '🖥️',
  curriculum: '📄',
  projects:   '💼',
  skills:     '🛠️',
  contact:    '📬',
  recycle:    '🗑️',
};

export function Window({ id, children }) {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize } = useWindowStore();
  const win = windows[id];

  const windowRef = useRef(null);
  const posRef = useRef({ x: win.x, y: win.y });
  const sizeRef = useRef({ width: win.width, height: win.height });
  const [isVisible, setIsVisible] = useState(win.isOpen);

  // Sync visibility state
  useEffect(() => {
    if (win.isOpen && !win.isMinimized) {
      setIsVisible(true);
    }
  }, [win.isOpen, win.isMinimized]);

  // Initialize DOM position on open
  useEffect(() => {
    if (!windowRef.current || !win.isOpen || win.isMinimized) return;
    posRef.current = { x: win.x, y: win.y };
    sizeRef.current = { width: win.width, height: win.height };
    if (!win.isMaximized) {
      windowRef.current.style.left = `${win.x}px`;
      windowRef.current.style.top = `${win.y}px`;
      windowRef.current.style.width = `${win.width}px`;
      windowRef.current.style.height = `${win.height}px`;
    }
  }, [win.isOpen, win.isMinimized]); // eslint-disable-line

  // Set up interact.js for drag/resize
  useEffect(() => {
    if (!windowRef.current || !win.isOpen || win.isMinimized || win.isMaximized) return;

    const interactable = interact(windowRef.current)
      .draggable({
        allowFrom: `.${styles.titlebar}`,
        inertia: false,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: false,
          }),
        ],
        listeners: {
          move(event) {
            posRef.current.x += event.dx;
            posRef.current.y += event.dy;
            event.target.style.left = `${posRef.current.x}px`;
            event.target.style.top = `${posRef.current.y}px`;
          },
          end() {
            updateWindowPosition(id, posRef.current.x, posRef.current.y);
          },
        },
      })
      .resizable({
        edges: { right: true, bottom: true, bottomRight: `.${styles.resizeHandle}` },
        modifiers: [
          interact.modifiers.restrictSize({ minWidth: 220, minHeight: 120 }),
        ],
        listeners: {
          move(event) {
            const { width, height } = event.rect;
            sizeRef.current = { width, height };
            event.target.style.width = `${width}px`;
            event.target.style.height = `${height}px`;
          },
          end() {
            updateWindowSize(id, sizeRef.current.width, sizeRef.current.height);
          },
        },
      });

    return () => {
      try { interactable.unset(); } catch (_) {}
    };
  }, [id, win.isOpen, win.isMinimized, win.isMaximized, updateWindowPosition, updateWindowSize]);

  const handleClose = useCallback((e) => {
    e.stopPropagation();
    sounds.close();
    closeWindow(id);
  }, [id, closeWindow]);

  const handleMinimize = useCallback((e) => {
    e.stopPropagation();
    sounds.click();
    minimizeWindow(id);
  }, [id, minimizeWindow]);

  const handleMaximize = useCallback((e) => {
    e.stopPropagation();
    sounds.click();
    maximizeWindow(id);
  }, [id, maximizeWindow]);

  const handleFocus = useCallback(() => {
    focusWindow(id);
  }, [id, focusWindow]);

  if (!win.isOpen || win.isMinimized) return null;

  const maxStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100vw',
    height: 'calc(100vh - 32px)',
    zIndex: win.zIndex,
  };

  const normalStyle = {
    position: 'absolute',
    left: win.x,
    top: win.y,
    width: win.width,
    height: win.height,
    zIndex: win.zIndex,
  };

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}
      style={{
        ...(win.isMaximized ? maxStyle : normalStyle),
        animationDuration: '0.12s',
      }}
      onMouseDown={handleFocus}
    >
      {/* Title bar */}
      <div className={styles.titlebar}>
        <span className={styles.titleIcon}>{WINDOW_ICONS[id]}</span>
        <span className={styles.titleText}>{win.title}</span>
        <div className={styles.controlBtns}>
          <button className={styles.controlBtn} onMouseDown={(e) => e.stopPropagation()} onClick={handleMinimize} title="Minimizar">
            <span className={styles.btnMin}>_</span>
          </button>
          <button className={styles.controlBtn} onMouseDown={(e) => e.stopPropagation()} onClick={handleMaximize} title="Maximizar">
            <span className={styles.btnMax}>□</span>
          </button>
          <button className={`${styles.controlBtn} ${styles.closeBtn}`} onMouseDown={(e) => e.stopPropagation()} onClick={handleClose} title="Cerrar">
            <span className={styles.btnClose}>✕</span>
          </button>
        </div>
      </div>

      {/* Window content */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Resize grip */}
      {!win.isMaximized && <div className={styles.resizeHandle} />}
    </div>
  );
}
