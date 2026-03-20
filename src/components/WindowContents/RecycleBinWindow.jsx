import styles from './windows.module.css';

export function RecycleBinWindow() {
  return (
    <div className={styles.recycleOuter}>
      <div className={styles.menubar}>
        <button className={styles.menuItem}>File</button>
        <button className={styles.menuItem}>Edit</button>
        <button className={styles.menuItem}>View</button>
        <button className={styles.menuItem}>Help</button>
      </div>

      <div className={styles.toolbar}>
        <button className={styles.toolBtn} disabled>
          🗑️ Empty Recycle Bin
        </button>
      </div>

      <div className={styles.recycleBody}>
        <div className={styles.recycleIcon}>🗑️</div>
        <p className={styles.recycleMsg}>
          This recycle bin is empty.
        </p>
        <p className={styles.recycleMsg2}>
          (Just like my recruiter inbox... for now.)
        </p>
      </div>

      <div className={styles.statusBar}>
        <div className={styles.statusPane}>0 objects</div>
        <div className={styles.statusPane}>0 bytes</div>
      </div>
    </div>
  );
}
