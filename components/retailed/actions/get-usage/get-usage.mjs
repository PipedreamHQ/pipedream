import retailed from "../../retailed.app.mjs";

export default {
  key: "retailed-get-usage",
  name: "Get API Usage",
  description: "Gets the API usage information for the Retailed API. [See the documentation](https://docs.retailed.io/v1/usage)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    retailed,
  },
  async run({ $ }) {
    const response = await this.retailed.getApiUsage({
      $,
    });

    $.export("$summary", `Retrieved API usage information: ${response.remaining} requests remaining under the ${response.plan} plan`);

    return response;
  },
};
