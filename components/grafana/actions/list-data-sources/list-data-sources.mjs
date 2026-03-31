// vandelay-test-dr
import grafana from "../../grafana.app.mjs";

export default {
  key: "grafana-list-data-sources",
  name: "List Data Sources",
  description:
    "List all configured data sources (Prometheus, Loki,"
    + " InfluxDB, MySQL, etc.), their types, and UIDs."
    + " Use the data source UID with **Query Data Source** to"
    + " execute queries."
    + " The `type` field indicates what query language to use"
    + " (e.g., `prometheus` → PromQL, `loki` → LogQL,"
    + " `mysql` → SQL).",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    grafana,
  },
  async run({ $ }) {
    const datasources = await this.grafana.listDatasources($);

    const count = Array.isArray(datasources)
      ? datasources.length
      : 0;

    const results = Array.isArray(datasources)
      ? datasources.map((ds) => ({
        uid: ds.uid,
        name: ds.name,
        type: ds.type,
        url: ds.url,
        database: ds.database,
        isDefault: ds.isDefault,
        readOnly: ds.readOnly,
      }))
      : datasources;

    $.export(
      "$summary",
      `Found ${count} data source${count === 1
        ? ""
        : "s"}`,
    );

    return results;
  },
};
