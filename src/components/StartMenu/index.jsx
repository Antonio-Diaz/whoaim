import { useCallback } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { sounds } from '../../utils/sounds';
import styles from './StartMenu.module.css';

const MENU_ITEMS = [
  { id: 'profile',    icon: '🖥️', label: 'My Computer' },
  { id: 'curriculum', icon: '📄', label: 'Curriculum.txt' },
  { id: 'projects',   icon: '💼', label: 'Projects' },
  { id: 'skills',     icon: '🛠️', label: 'Skills' },
  { id: 'contact',    icon: '📬', label: 'Contact' },
  { id: 'recycle',    icon: '🗑️', label: 'Recycle Bin' },
];

export function StartMenu() {
  const { openWindow, closeStartMenu } = useWindowStore();

  const handleItem = useCallback((id) => {
    sounds.open();
    openWindow(id);
    closeStartMenu();
  }, [openWindow, closeStartMenu]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div className={styles.menu} onClick={handleClick}>
      {/* User banner */}
      <div className={styles.banner}>
        <div className={styles.avatar}>AD</div>
        <div className={styles.userInfo}>
          <div className={styles.username}>Antonio Díaz</div>
          <div className={styles.userrole}>Senior Data Engineer</div>
        </div>
      </div>

      {/* Items */}
      <div className={styles.items}>
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            className={styles.item}
            onClick={() => handleItem(item.id)}
          >
            <span className={styles.itemIcon}>{item.icon}</span>
            <span className={styles.itemLabel}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom actions */}
      <div className={styles.bottom}>
        <button className={styles.bottomBtn} onClick={closeStartMenu}>
          <span>🔴</span>
          <span>Shut Down</span>
        </button>
      </div>
    </div>
  );
}
