import { useState, useCallback } from 'react';
import styles from './windows.module.css';

const PROJECTS = [
  {
    id: 'foundry',
    name: 'foundry-pipeline-kit',
    description:
      'Utility framework for Apache Spark on Palantir Foundry. Provides abstractions for Pipeline Builders, reusable transforms, and dataset testing helpers. Reduces boilerplate in Palantir Professional Services projects by ~60%.',
    tech: 'Python, PySpark, Palantir Foundry',
    status: 'Active development',
    year: '2024',
  },
  {
    id: 'airflow',
    name: 'airflow-alert-manager',
    description:
      'Apache Airflow plugin for enriched contextual alerts. Native integration with Slack and PagerDuty. Includes automatic failure classification by category (infrastructure, data, business logic) and attaches relevant runbooks to each alert.',
    tech: 'Python, Apache Airflow, Slack API, PagerDuty API',
    status: 'Public on GitHub',
    year: '2023',
  },
  {
    id: 'catalog',
    name: 'fintech-data-catalog',
    description:
      'Internal data catalog with automatic pipeline lineage. Extracts metadata from Airflow and Dagster, generates interactive lineage graphs, and exposes REST API for team-based queries. Deployed in production internally at RappiCard.',
    tech: 'Python, Dagster, FastAPI, PostgreSQL, React',
    status: 'Production (internal)',
    year: '2023',
  },
  {
    id: 'credit',
    name: 'rappicard-credit-engine',
    description:
      'Data processing layer for real-time credit scoring engine. Feature engineering pipeline with Apache Kafka and PySpark Structured Streaming. Processes 500K+ events per hour with p99 latency < 200ms.',
    tech: 'PySpark, Apache Kafka, AWS EMR, Python, Redis',
    status: 'Production',
    year: '2022',
  },
  {
    id: 'dbt',
    name: 'dbt-snowflake-template',
    description:
      'Enterprise dbt template for Snowflake projects. Includes layered structure (staging / intermediate / marts), audit macros, generic tests, and auto-generated documentation. Used as foundation at Kimetrics.',
    tech: 'dbt, Snowflake, SQL, Python',
    status: 'Public on GitHub',
    year: '2022',
  },
];

export function ProjectsWindow() {
  const [selected, setSelected] = useState(null);

  const handleSelect = useCallback((id) => {
    setSelected((prev) => (prev === id ? null : id));
  }, []);

  const selectedProject = PROJECTS.find((p) => p.id === selected);

  return (
    <div className={styles.explorerOuter}>
      <div className={styles.menubar}>
        <button className={styles.menuItem}>File</button>
        <button className={styles.menuItem}>Edit</button>
        <button className={styles.menuItem}>View</button>
        <button className={styles.menuItem}>Favorites</button>
        <button className={styles.menuItem}>Tools</button>
        <button className={styles.menuItem}>Help</button>
      </div>

      <div className={styles.toolbar}>
        <button className={styles.toolBtn}>← Back</button>
        <button className={styles.toolBtn}>→ Forward</button>
        <button className={styles.toolBtn}>↑ Up</button>
      </div>

      <div className={styles.explorerAddressBar}>
        <span className={styles.explorerAddressLabel}>Address:</span>
        <input
          readOnly
          className={styles.explorerAddressInput}
          value="C:\Users\Antonio\My Documents\Projects"
        />
      </div>

      <div className={styles.explorerBody}>
        {/* Sidebar */}
        <div className={styles.explorerSidebar}>
          <div className={styles.sidebarSection}>File Tasks</div>
          <span className={styles.sidebarLink}>📂 New Folder</span>
          <span className={styles.sidebarLink}>🌐 Publish</span>
          <span className={styles.sidebarLink}>📧 Share</span>

          <div className={styles.sidebarSection} style={{ marginTop: 10 }}>Other Places</div>
          <span className={styles.sidebarLink}>🖥️ My Computer</span>
          <span className={styles.sidebarLink}>📬 Contact</span>
          <span className={styles.sidebarLink}>🐙 GitHub</span>

          <div className={styles.sidebarSection} style={{ marginTop: 10 }}>Details</div>
          <div style={{ fontSize: 10, color: '#555' }}>
            {PROJECTS.length} projects<br />
            {selected ? `Selected: ${selectedProject?.name}` : 'Nothing selected'}
          </div>
        </div>

        {/* Main area */}
        <div className={styles.explorerMain}>
          <div className={styles.fileGrid}>
            {PROJECTS.map((p) => (
              <div
                key={p.id}
                className={`${styles.fileItem} ${selected === p.id ? styles.fileSelected : ''}`}
                onClick={() => handleSelect(p.id)}
              >
                <span className={styles.fileIcon}>📁</span>
                <span className={styles.fileLabel}>{p.name}</span>
              </div>
            ))}
          </div>

          {selectedProject && (
            <div className={styles.detailPanel}>
              <div className={styles.detailTitle}>{selectedProject.name}</div>
              <div className={styles.detailRow}>
                <strong>Status:</strong> {selectedProject.status} &nbsp;|&nbsp;
                <strong>Year:</strong> {selectedProject.year}
              </div>
              <div className={styles.detailRow}>
                <strong>Stack:</strong> {selectedProject.tech}
              </div>
              <div className={styles.detailDesc}>{selectedProject.description}</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.statusBar}>
        <div className={styles.statusPane}>{PROJECTS.length} objects</div>
        <div className={styles.statusPane}>
          {selected ? `Selected: ${selectedProject?.name}` : 'No objects selected'}
        </div>
      </div>
    </div>
  );
}
