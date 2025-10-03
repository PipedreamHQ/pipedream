import app from "../../airtop.app.mjs";

export default {
  key: "airtop-create-window",
  name: "Create Window",
  description: "Create a new browser window in an active session. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/windows/create)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    sessionId: {
      propDefinition: [
        app,
        "sessionId",
      ],
    },
    url: {
      type: "string",
      label: "Initial URL",
      description: "Optional URL to navigate to immediately after creating the window",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      sessionId,
      url,
    } = this;

    const response = await this.app.createWindow({
      $,
      sessionId,
      data: {
        url,
      },
    });

    const windowId = response.data?.id;

    $.export("$summary", `Successfully created window \`${windowId}\` in session \`${sessionId}\``);
    return response;
  },
};

