import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-list-snapshot-id-options",
  name: "List Snapshot ID Options",
  description: "Retrieves available options for the Snapshot ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    daytona,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await daytona.propDefinitions.snapshotId.options.call(this.daytona, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
