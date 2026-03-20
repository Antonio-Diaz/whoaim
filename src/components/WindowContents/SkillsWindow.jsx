import styles from './windows.module.css';

const SKILLS = [
  {
    category: 'Languages',
    items: ['Python (advanced)', 'SQL (advanced)', 'Scala (intermediate)', 'Bash (intermediate)', 'JavaScript (intermediate)'],
  },
  {
    category: 'Big Data & Streaming',
    items: ['Apache Spark / PySpark', 'Apache Kafka', 'Apache Airflow', 'dbt', 'Dagster', 'Apache Flink (basics)'],
  },
  {
    category: 'Cloud — AWS',
    items: ['S3', 'EMR', 'Glue', 'Redshift', 'Lambda', 'DynamoDB', 'CloudWatch', 'Step Functions'],
  },
  {
    category: 'Cloud — GCP',
    items: ['BigQuery', 'Dataflow', 'Cloud Storage', 'Cloud Composer', 'Pub/Sub'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'Snowflake', 'Amazon Redshift', 'DynamoDB', 'Redis'],
  },
  {
    category: 'Data Platforms',
    items: ['Palantir Foundry (in progress)', 'Databricks', 'dbt Cloud', 'Astronomer', 'Great Expectations'],
  },
  {
    category: 'DevOps & Infrastructure',
    items: ['Docker', 'Kubernetes (basics)', 'Terraform', 'GitHub Actions', 'Jenkins', 'Git'],
  },
  {
    category: 'Development (past)',
    items: ['React Native', 'Vue.js', 'React', 'Django', 'Laravel', 'FastAPI'],
  },
];

export function SkillsWindow() {
  return (
    <div className={styles.skillsOuter}>
      <div className={styles.menubar}>
        <button className={styles.menuItem}>File</button>
        <button className={styles.menuItem}>View</button>
        <button className={styles.menuItem}>Help</button>
      </div>

      <div className={styles.skillsHeader}>
        Technical Skills Inventory — Antonio Díaz
      </div>

      <div className={styles.skillsTableWrap}>
        <table className={styles.skillsTable}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Technologies</th>
            </tr>
          </thead>
          <tbody>
            {SKILLS.map((group, i) => (
              <tr key={i} className={i % 2 === 0 ? styles.skillsRowEven : styles.skillsRowOdd}>
                <td className={styles.skillsCat}>{group.category}</td>
                <td>
                  <div className={styles.skillsTagList}>
                    {group.items.map((item, j) => (
                      <span key={j} className={styles.skillsTag}>{item}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.statusBar}>
        <div className={styles.statusPane}>{SKILLS.length} categories</div>
        <div className={styles.statusPane}>
          {SKILLS.reduce((a, g) => a + g.items.length, 0)} technologies
        </div>
      </div>
    </div>
  );
}
