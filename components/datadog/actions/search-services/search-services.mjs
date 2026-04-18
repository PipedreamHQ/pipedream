import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-search-services",
  name: "Search Services",
  description:
    "List services from Datadog's Service Catalog"
    + " with ownership, metadata, and team info. Use"
    + " to discover service names for filtering in"
    + " **Search Logs** (`service:my-app`) or finding"
    + " monitors via **Search Monitors**"
    + " (`tag:service:my-app`). Returns service"
    + " definitions including links, docs, and on-call."
    + " [See the docs](https://docs.datadoghq.com/api/"
    + "latest/service-definition/"
    + "#get-all-service-definitions)",
  version: "1.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    datadog,
    region: {
      propDefinition: [
        datadog,
        "region",
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description:
        "Number of services per page. Default `10`.",
      optional: true,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "Page number (0-indexed).",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.pageSize !== undefined) params["page[size]"] = this.pageSize;
    if (this.pageNumber !== undefined) params["page[number]"] = this.pageNumber;

    const response = await this.datadog.listServices({
      $,
      params,
      region: this.region,
    });

    const count = response?.data?.length ?? 0;
    $.export(
      "$summary",
      `Found ${count} service${count === 1
        ? ""
        : "s"}`,
    );

    return response;
  },
};
