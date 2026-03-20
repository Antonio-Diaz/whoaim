import styles from './windows.module.css';

export function ProfileWindow() {
  return (
    <div className={styles.profileOuter}>
      <div className={styles.menubar}>
        <button className={styles.menuItem}>File</button>
        <button className={styles.menuItem}>View</button>
        <button className={styles.menuItem}>Help</button>
      </div>

      <div className={styles.profileInner}>
        <div className={styles.profileBanner}>
          <div className={styles.profileAvatar}>AD</div>
          <div>
            <h2 className={styles.profileName}>Antonio Díaz</h2>
            <p className={styles.profileTitle}>Senior Data Engineer</p>
            <p className={styles.profileLocation}>📍 Veracruz, Mexico</p>
          </div>
        </div>

        <table className={styles.propTable}>
          <tbody>
            <tr>
              <td className={styles.propKey}>Full Name:</td>
              <td>Antonio Díaz</td>
            </tr>
            <tr>
              <td className={styles.propKey}>Current Position:</td>
              <td>Senior Data Engineer</td>
            </tr>
            <tr>
              <td className={styles.propKey}>Company:</td>
              <td>RappiCard México</td>
            </tr>
            <tr>
              <td className={styles.propKey}>Industry:</td>
              <td>Fintech / Financial Services</td>
            </tr>
            <tr>
              <td className={styles.propKey}>Location:</td>
              <td>Veracruz, Mexico</td>
            </tr>
            <tr>
              <td className={styles.propKey}>Experience:</td>
              <td>6+ years (since 2019)</td>
            </tr>
            <tr>
              <td className={styles.propKey}>Specialization:</td>
              <td>Batch and streaming pipelines, fintech</td>
            </tr>
            <tr>
              <td className={styles.propKey}>Languages:</td>
              <td>Spanish (native), English (B2)</td>
            </tr>
            <tr>
              <td className={styles.propKey}>Availability:</td>
              <td>Open to remote opportunities</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.profileSummary}>
          Data engineer with 6+ years building critical production pipelines.
          Specialized in scalable data architectures for fintech. Previous background in
          full-stack development (React Native, Vue.js, Django, Laravel). Currently focused
          on roles at <strong>Palantir Professional Services</strong> and data consulting.
        </div>
      </div>

      <div className={styles.statusBar}>
        <div className={styles.statusPane}>My Computer</div>
        <div className={styles.statusPane}>1 object</div>
      </div>
    </div>
  );
}
