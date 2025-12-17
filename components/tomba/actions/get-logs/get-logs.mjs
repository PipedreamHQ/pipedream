import app from "../../tomba.app.mjs";

export default {
  key: "tomba-get-logs",
  name: "Get Logs",
  description:
    "Retrieve API request logs for your account with pagination support. [See the documentation](https://docs.tomba.io/api/account#retrieve-api-logs)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const offset = (this.page - 1) * this.limit;

    const response = await this.app.getLogs({
      $,
      limit: this.limit,
      offset,
    });

    $.export(
      "$summary",
      `Successfully retrieved ${response.data?.length || 0} API logs`,
    );
    return response;
  },
};
