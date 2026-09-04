import anyapi from "../../anyapi.app.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";

export default {
  key: "anyapi-run-api",
  name: "Run API",
  description: "Run one API from the AnyAPI catalog and get its normalized output, the number of result rows, and the USD charged. Use **Get API** first to read the API's input schema. [See the documentation](https://getanyapi.com/docs/quickstart)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    anyapi,
    sku: {
      propDefinition: [
        anyapi,
        "sku",
      ],
    },
    input: {
      type: "object",
      label: "Input",
      description: "The API's input, matching the `inputSchema` returned by the **Get API** action. For example, `reddit.search` takes `{ \"query\": \"pipedream\" }`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.anyapi.runApi({
      $,
      sku: this.sku,
      data: parseObjectEntries(this.input) ?? {},
    });

    $.export("$summary", `Ran \`${this.sku}\` for $${response.costUsd}`);
    return response;
  },
};
