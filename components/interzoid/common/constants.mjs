const CATEGORY_OPTIONS = [
  {
    label: "Company and Organization Names",
    value: "company",
  },
  {
    label: "Individual Names",
    value: "individual",
  },
  {
    label: "Street Addresses",
    value: "address",
  },
];

const SOURCE_OPTIONS = [
  "AWS RDS/Aurora",
  "Snowflake",
  "Azure SQL",
  "Google Cloud SQL",
  "Databricks",
  "PostgreSQL",
  "MySQL",
  "MariaDB",
  "Parquet",
  "CSV",
  "TSV",
  "Excel",
];

export default {
  CATEGORY_OPTIONS,
  SOURCE_OPTIONS,
};
