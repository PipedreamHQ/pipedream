import logProps from "../common/log-props.mjs";

export default {
  key: "datadog-list-logs",
  name: "List Logs",
  description:
    "Get a list of logs matching a filter query."
    + " Uses the GET endpoint with a higher rate limit"
    + " (3600/hr vs 300/hr)."
    + " [See the docs](https://docs.datadoghq.com/api/latest/"
    + "logs/#get-a-list-of-logs)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: logProps,
  async run({ $ }) {
    const params = {
      "filter[query]": this.query,
    };
    if (this.from) params["filter[from]"] = this.from;
    if (this.to) params["filter[to]"] = this.to;
    if (this.indexes?.length) {
      params["filter[indexes]"] = this.indexes.join(",");
    }
    if (this.sort) params.sort = this.sort;
    if (this.limit) params["page[limit]"] = this.limit;

    const response = await this.datadog.listLogs({
      $,
      params,
      region: this.region,
    });

    const count = response?.data?.length ?? 0;
    $.export(
      "$summary",
      `Found ${count} log${count === 1
        ? ""
        : "s"} matching query`,
    );

    return response;
  },
};
