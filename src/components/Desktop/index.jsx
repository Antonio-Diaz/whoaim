import { useCallback } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { Window } from '../Window';
import { Taskbar } from '../Taskbar';
import { StartMenu } from '../StartMenu';
import { ProfileWindow } from '../WindowContents/ProfileWindow';
import { CurriculumWindow } from '../WindowContents/CurriculumWindow';
import { ProjectsWindow } from '../WindowContents/ProjectsWindow';
import { SkillsWindow } from '../WindowContents/SkillsWindow';
import { ContactWindow } from '../WindowContents/ContactWindow';
import { RecycleBinWindow } from '../WindowContents/RecycleBinWindow';
import { sounds } from '../../utils/sounds';
import styles from './Desktop.module.css';

const DESKTOP_ICONS = [
  { id: 'profile',    icon: '🖥️', label: 'My Computer' },
  { id: 'curriculum', icon: '📄', label: 'Curriculum.txt' },
  { id: 'projects',   icon: '💼', label: 'Projects' },
  { id: 'skills',     icon: '🛠️', label: 'Skills' },
  { id: 'contact',    icon: '📬', label: 'Contact' },
  { id: 'recycle',    icon: '🗑️', label: 'Recycle Bin' },
];

const WINDOW_CONTENT = {
  profile:    <ProfileWindow />,
  curriculum: <CurriculumWindow />,
  projects:   <ProjectsWindow />,
  skills:     <SkillsWindow />,
  contact:    <ContactWindow />,
  recycle:    <RecycleBinWindow />,
};

export function Desktop() {
  const { openWindow, closeStartMenu, startMenuOpen, windows } = useWindowStore();

  const handleIconDoubleClick = useCallback((id) => {
    sounds.open();
    openWindow(id);
  }, [openWindow]);

  const handleDesktopClick = useCallback(() => {
    if (startMenuOpen) closeStartMenu();
  }, [startMenuOpen, closeStartMenu]);

  return (
    <div className={styles.desktop} onClick={handleDesktopClick}>
      {/* Desktop icons */}
      <div className={styles.iconColumn}>
        {DESKTOP_ICONS.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon.icon}
            label={icon.label}
            onDoubleClick={() => handleIconDoubleClick(icon.id)}
          />
        ))}
      </div>

      {/* Window layer */}
      <div className={styles.windowLayer}>
        {Object.keys(windows).map((id) => (
          <Window key={id} id={id}>
            {WINDOW_CONTENT[id]}
          </Window>
        ))}
      </div>

      {/* Start Menu */}
      {startMenuOpen && <StartMenu />}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}

function DesktopIcon({ icon, label, onDoubleClick }) {
  return (
    <div className={styles.icon} onDoubleClick={onDoubleClick}>
      <div className={styles.iconGlyph}>{icon}</div>
      <div className={styles.iconLabel}>{label}</div>
    </div>
  );
}
