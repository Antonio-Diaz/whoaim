import styles from './windows.module.css';

const CV_TEXT = `====================================================
  ANTONIO DÍAZ — SENIOR DATA ENGINEER
====================================================
Veracruz, Mexico | antonio@example.com
github.com/antonio-diaz | linkedin.com/in/antoniodiaz
====================================================

PROFESSIONAL PROFILE
------------------
Data engineer with 6+ years of experience
building production pipelines for the
fintech sector. Expert in batch and streaming
architectures at scale. Previous background in full-stack development.
Focused on roles at Palantir Professional Services.


WORK EXPERIENCE
-------------------

Senior Data Engineer — RappiCard México
2022 – Present | Fintech / Financial Services

  • Designed and implemented critical data pipelines
    for credit, collections, and fraud detection
    processing millions of daily transactions.

  • Migrated 40+ legacy pandas/SQL pipelines to
    PySpark on AWS EMR, reducing execution time
    by 70% and costs by 45%.

  • Orchestration of 200+ DAGs in Apache Airflow
    with SLA monitoring and contextual alerts.

  • Implemented data lake architecture on S3
    with optimized partitioning and catalog on
    AWS Glue; 60% reduction in Redshift query costs.

  • Collaborated with Data Science teams to
    deploy credit scoring models in production
    (feature engineering + serving).

  Stack: Python, PySpark, Apache Airflow, AWS
         (S3, EMR, Glue, Redshift, Lambda,
         DynamoDB), SQL, PostgreSQL, Docker


Data Engineer — Kimetrics
2021 – 2022 | CPG / Retail Analytics

  • Developed ETL solutions for point-of-sale
    analysis (trade marketing) for Fortune 500
    clients in mass consumption sector.

  • Implemented transformations with dbt on
    Snowflake; established testing and
    documentation standards for data team.

  • Integration of heterogeneous sources (REST
    APIs, FTP, relational databases) in
    automated pipelines with Airflow.

  Stack: Python, dbt, Snowflake, GCP,
         BigQuery, Apache Airflow


Full Stack Developer — GoNet
2019 – 2021 | Logistics / Retail

  • Developed web and mobile applications for
    clients in logistics and retail sectors.

  • Cross-platform mobile applications with
    React Native (iOS + Android).

  • Frontend with Vue.js, backend with Django and
    Laravel. Integrations with payment APIs and
    third-party services.

  Stack: React Native, Vue.js, Django, Laravel,
         MySQL, PostgreSQL, Redis


EDUCATION
---------
Bachelor's in Computer Systems Engineering
Veracruz Institute of Technology — 2015–2019
Professional credential: in process


CERTIFICATIONS
---------------
  ✓ AWS Certified Data Analytics – Specialty (2023)
  ✓ Apache Airflow Fundamentals — Astronomer (2022)
  ✓ dbt Certified Developer (2022)
  ✓ HashiCorp Terraform Associate (2023)


TECHNICAL SKILLS
---------------------

  Big Data / Streaming:
    Apache Spark / PySpark, Apache Kafka,
    Apache Airflow, dbt, Dagster,
    Apache Flink (basics)

  Cloud & Infrastructure:
    AWS: S3, EMR, Glue, Redshift, Lambda,
         DynamoDB, CloudWatch
    GCP: BigQuery, Dataflow, Cloud Storage
    Docker, Kubernetes, Terraform
    CI/CD: GitHub Actions, Jenkins

  Languages:
    Python (advanced), SQL (advanced),
    Scala (intermediate), Bash (intermediate)

  Databases:
    PostgreSQL, MySQL, Snowflake,
    Amazon Redshift, DynamoDB, Redis

  Data Platforms:
    Palantir Foundry (in progress),
    Databricks, dbt Cloud, Astronomer

  Development (past):
    React Native, Vue.js, React,
    Django, Laravel, FastAPI


LANGUAGES
-------
  Spanish: Native
  English: B2 — Professional Working Proficiency


====================================================
  Available for remote roles and relocation
====================================================`;

export function CurriculumWindow() {
  return (
    <div className={styles.notepadOuter}>
      <div className={styles.menubar}>
        <button className={styles.menuItem}>File</button>
        <button className={styles.menuItem}>Edit</button>
        <button className={styles.menuItem}>Format</button>
        <button className={styles.menuItem}>View</button>
        <button className={styles.menuItem}>Help</button>
      </div>

      <div className={styles.notepadContent}>
        <pre className={styles.notepadText}>{CV_TEXT}</pre>
      </div>
    </div>
  );
}
