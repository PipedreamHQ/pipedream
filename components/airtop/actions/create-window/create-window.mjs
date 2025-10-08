import app from "../../airtop.app.mjs";

export default {
  key: "airtop-create-window",
  name: "Create Window",
  description: "Create a new browser window in an active session. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/windows/create)",
  version: "0.0.2",
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
      description: "Optional URL to navigate to immediately after creating the window.",
      optional: true,
      default: "https://www.pipedream.com",
    },
    screenResolution: {
      type: "string",
      label: "Screen Resolution",
      description: "Affects the live view configuration. By default, a live view will fill the parent frame when initially loaded. This parameter can be used to configure fixed dimensions (e.g. `1280x720`).",
      optional: true,
      default: "1280x720",
    },
    waitUntil: {
      propDefinition: [
        app,
        "waitUntil",
      ],
    },
    waitUntilTimeoutSeconds: {
      propDefinition: [
        app,
        "waitUntilTimeoutSeconds",
      ],
    },
  },
  async run({ $ }) {
    const {
      sessionId,
      url,
      screenResolution,
      waitUntil,
      waitUntilTimeoutSeconds,
    } = this;

    const response = await this.app.createWindow({
      $,
      sessionId,
      data: {
        url,
        screenResolution,
        waitUntil,
        waitUntilTimeoutSeconds,
      },
    });

    $.export("$summary", `Successfully created window ${response.windowId}`);
    return response;
  },
};

