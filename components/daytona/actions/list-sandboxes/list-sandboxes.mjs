import daytona from "../../daytona.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "daytona-list-sandboxes",
  name: "List Sandboxes",
  description: "Lists sandboxes on Daytona. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/daytona/#list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    daytona,
    labels: {
      type: "object",
      label: "Labels",
      description: "Labels to filter sandboxes by. Example: { 'my-label': 'my-value' }",
      optional: true,
    },
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
    const labels = parseObject(this.labels);
    const response = await this.daytona.listSandboxes(labels, this.page, this.limit);
    $.export("$summary", `Successfully retrieved ${response.items?.length} sandbox${response.items?.length === 1
      ? ""
      : "es"}`);
    return response;
  },
};
