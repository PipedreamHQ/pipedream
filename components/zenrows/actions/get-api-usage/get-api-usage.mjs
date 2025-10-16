import app from "../../zenrows.app.mjs";

export default {
  name: "Get API Usage",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "zenrows-get-api-usage",
  description: "Get Zenrows API usage. [See the documentation](https://www.zenrows.com/docs#usage-curl)",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getAPIUsage({
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved API usage \`${response.api_credit_usage} / ${response.api_credit_limit}\` credits`);
    }

    return response;
  },
};
