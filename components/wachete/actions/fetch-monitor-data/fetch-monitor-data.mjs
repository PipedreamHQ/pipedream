import wachete from "../../wachete.app.mjs";

export default {
  key: "wachete-fetch-monitor-data",
  name: "Fetch Monitor Data",
  description: "Retrieves data from a monitored website or web pages. [See the documentation(https://api.wachete.com/swagger/ui/index/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wachete,
    folderId: {
      propDefinition: [
        wachete,
        "folderId",
      ],
    },
    wachetId: {
      propDefinition: [
        wachete,
        "wachetId",
        (c) => ({
          parentId: c.folderId,
        }),
      ],
    },
    from: {
      type: "string",
      label: "From",
      description: "Time interval from in ISO format. If not provided from interval is unlimited.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "Time interval to in ISO format. If not provided to interval is unlimited.",
      optional: true,
    },
    returnDiff: {
      type: "boolean",
      label: "Return Diff",
      description: "Return also diff with previous value",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = this.wachete.paginate({
      resourceFn: this.wachete.getMonitorData,
      args: {
        $,
        id: this.wachetId,
        params: {
          from: this.from,
          to: this.to,
          returnDiff: this.returnDiff,
        },
        max: this.maxResults,
      },
    });

    const results = [];
    for await (const item of data) {
      results.push(item);
    }

    $.export("$summary", `Successfully retrieved ${results.length} data item${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
