import elasticSecurity from "../../elastic_security.app.mjs";

export default {
  key: "elastic_security-search-alerts",
  name: "Search Alerts",
  description: "Search Elastic Security detection alerts (signals) via POST /api/detection_engine/signals/search using raw Elasticsearch Query DSL."
    + " Use this to find alert IDs before running **Update Alert Status**, or to investigate alert volume/details for a case."
    + " Returns the raw Elasticsearch search response with a `hits.hits` array; each hit's `_id` is the signal ID and `_source` holds the alert's full ECS document."
    + " Example: calling with `query: {\"bool\":{\"filter\":[{\"term\":{\"kibana.alert.workflow_status\":\"open\"}}]}}` and `size: 5` returns `{ hits: { total: { value: 12 }, hits: [{ _id: \"abc123\", _source: { \"@timestamp\": \"...\", \"kibana.alert.workflow_status\": \"open\", \"host.name\": \"...\" } }, ...] } }`."
    + " Omit `query` to match all alerts. `_source` always holds the full ECS document; use `fields` to additionally get a compact, array-valued view of just the fields you need (under each hit's `fields` key) without parsing the full document yourself."
    + " [See the documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-searchalerts)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
    query: {
      type: "object",
      label: "Query",
      description: "Elasticsearch Query DSL object. Example: `{\"bool\":{\"filter\":[{\"term\":{\"kibana.alert.workflow_status\":\"open\"}}]}}`. Omit to match all alerts.",
      optional: true,
    },
    size: {
      type: "integer",
      label: "Size",
      description: "Maximum number of alerts to return per call. Minimum 0. Defaults to 10. To paginate beyond this limit, increase **From** by **Size** on successive calls (e.g. Size=100, From=0 for page 1; From=100 for page 2).",
      optional: true,
      min: 0,
      max: 100,
    },
    from: {
      type: "integer",
      label: "From",
      description: "Zero-based offset of the first alert to return, used for pagination. For example, set **Size** to 100 and **From** to 100 to fetch the second page of results. Defaults to 0.",
      optional: true,
      min: 0,
    },
    sort: {
      type: "object",
      label: "Sort",
      description: "Elasticsearch sort clause as an object mapping field name to `asc`/`desc` (or a sort options object). Example: `{\"@timestamp\":\"desc\"}`. Add more keys to sort by multiple fields.",
      optional: true,
    },
    trackTotalHits: {
      type: "boolean",
      label: "Track Total Hits",
      description: "Whether to return an accurate total hit count instead of a bounded estimate.",
      optional: true,
    },
    fields: {
      propDefinition: [
        elasticSecurity,
        "fields",
      ],
      description: "Request these specific fields via Elasticsearch's native field retrieval, e.g. `[\"@timestamp\", \"kibana.alert.workflow_status\", \"host.name\"]` — returned under each hit's `fields` key (each value as an array), alongside the unchanged full `_source` document. Useful for reading known field values without parsing all of `_source`."
        + " Common fields: `@timestamp`, `kibana.alert.workflow_status`, `kibana.alert.rule.name`, `host.name`, `user.name`, `event.category`.",
    },
  },
  async run({ $ }) {
    const response = await this.elasticSecurity.searchAlerts({
      $,
      data: {
        query: this.query,
        size: this.size,
        from: this.from,
        sort: this.sort,
        track_total_hits: this.trackTotalHits,
        fields: this.fields?.length
          ? this.fields
          : undefined,
      },
    });
    const total = response?.hits?.total?.value ?? response?.hits?.hits?.length ?? 0;
    $.export("$summary", `Found ${total} alert(s)`);
    return response;
  },
};
