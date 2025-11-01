import app from "../../pipedream.app.mjs";

export default {
  key: "pipedream-get-app",
  name: "Get App",
  description: "Get details for a specific Pipedream app. [See the documentation](https://pipedream.com/docs/rest-api/api-reference/apps/get-an-app)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
    idempotentHint: true,
  },
  type: "action",
  props: {
    app,
    appId: {
      propDefinition: [
        app,
        "appId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      appId,
    } = this;

    const response = await app.getApp({
      $,
      appId,
    });

    $.export("$summary", `Successfully retrieved app with ID \`${response.data.id}\``);
    return response;
  },
};
