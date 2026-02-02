import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-list-snapshots",
  name: "List Snapshots",
  description: "Lists snapshots on Daytona. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/snapshot/#list)",
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
      propDefinition: [
        daytona,
        "page",
      ],
    },
    limit: {
      propDefinition: [
        daytona,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.daytona.listSnapshots(this.page, this.limit);
    $.export("$summary", `Successfully retrieved ${response.total} snapshot${response.total === 1
      ? ""
      : "s"}`);
    return response;
  },
};
