import styles from './windows.module.css';

export function ContactWindow() {
  return (
    <div className={styles.outlookOuter}>
      <div className={styles.menubar}>
        <button className={styles.menuItem}>File</button>
        <button className={styles.menuItem}>Edit</button>
        <button className={styles.menuItem}>View</button>
        <button className={styles.menuItem}>Tools</button>
        <button className={styles.menuItem}>Message</button>
        <button className={styles.menuItem}>Help</button>
      </div>

      <div className={styles.toolbar}>
        <button className={styles.toolBtn}>📧 New Message</button>
        <button className={styles.toolBtn}>↩ Reply</button>
        <button className={styles.toolBtn}>↪ Forward</button>
        <button className={styles.toolBtn} disabled>🖨 Print</button>
      </div>

      <div className={styles.outlookBody}>
        {/* Folder sidebar */}
        <div className={styles.outlookLeft}>
          <div style={{ fontWeight: 'bold', padding: '4px', fontSize: 11, color: '#000080', marginBottom: 4 }}>
            Outlook Express
          </div>
          <div className={styles.outlookFolder}>📥 Inbox (0)</div>
          <div className={styles.outlookFolder}>📤 Sent</div>
          <div className={styles.outlookFolder}>📁 Drafts</div>
          <div className={styles.outlookFolder}>🗑️ Deleted</div>
          <div className={styles.outlookFolder}>📇 Contacts</div>
        </div>

        {/* Main content */}
        <div className={styles.outlookRight}>
          <div className={styles.contactCard}>
            <div className={styles.contactHeader}>
              <div className={styles.contactAvatar}>AD</div>
              <div>
                <div className={styles.contactName}>Antonio Díaz</div>
                <div className={styles.contactRole}>Senior Data Engineer · Veracruz, Mexico</div>
              </div>
            </div>

            <table className={styles.contactTable}>
              <tbody>
                <tr>
                  <td className={styles.contactLabel}>📧 Email:</td>
                  <td>
                    <a className={styles.contactLink} href="mailto:antonio@example.com">
                      antonio@example.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className={styles.contactLabel}>💼 LinkedIn:</td>
                  <td>
                    <span className={styles.contactLink}>linkedin.com/in/antoniodiaz</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.contactLabel}>🐙 GitHub:</td>
                  <td>
                    <span className={styles.contactLink}>github.com/antonio-diaz</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.contactLabel}>📍 Location:</td>
                  <td>Veracruz, Mexico (remote available)</td>
                </tr>
                <tr>
                  <td className={styles.contactLabel}>🕐 Timezone:</td>
                  <td>CST (UTC-6) / CDT (UTC-5 summer)</td>
                </tr>
                <tr>
                  <td className={styles.contactLabel}>🗣 Languages:</td>
                  <td>Spanish (native), English (B2)</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.contactNote}>
              ✉️ Open to opportunities at <strong>Palantir Professional Services</strong>,
              Data Engineering and data consulting roles.
              Response guaranteed within 24 business hours.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.statusBar}>
        <div className={styles.statusPane}>Connected</div>
        <div className={styles.statusPane}>0 unread messages</div>
      </div>
    </div>
  );
}
