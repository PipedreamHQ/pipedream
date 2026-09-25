import anyapi from "../../anyapi.app.mjs";
import { parseInput } from "../../common/utils.mjs";

export default {
  key: "anyapi-run-api",
  name: "Run API",
  description: "Run one API from the AnyAPI catalog and get its normalized output, the number of result rows, and the USD charged. Find the API with **Search APIs**, read its input schema with **Get API**, then run it here. [See the documentation](https://getanyapi.com/docs/quickstart)",
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
      description: "The API's input, matching the `inputSchema` returned by the **Get API** action. For example, `reddit.search` takes `{ \"query\": \"pipedream\" }`. Each value is matched to the type that schema declares before the request is sent, so a numeric id stays text where the schema asks for text.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { inputSchema } = await this.anyapi.getApi({
      $,
      sku: this.sku,
    });

    const response = await this.anyapi.runApi({
      $,
      sku: this.sku,
      data: parseInput(this.input, inputSchema) ?? {},
    });

    $.export("$summary", `Ran \`${this.sku}\` for $${response.costUsd}`);
    return response;
  },
};
