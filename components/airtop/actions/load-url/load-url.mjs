import app from "../../airtop.app.mjs";

export default {
  key: "airtop-load-url",
  name: "Load URL",
  description: "Navigate a browser window to a specific URL. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/windows/load-url)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sessionId: {
      propDefinition: [
        app,
        "sessionId",
      ],
    },
    windowId: {
      propDefinition: [
        app,
        "windowId",
        ({ sessionId }) => ({
          sessionId,
        }),
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to navigate to (e.g. `https://www.pipedream.com`)",
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
      windowId,
      url,
      waitUntil,
      waitUntilTimeoutSeconds,
    } = this;

    const response = await this.app.loadUrl({
      $,
      sessionId,
      windowId,
      data: {
        url,
        waitUntil,
        waitUntilTimeoutSeconds,
      },
    });

    $.export("$summary", `Successfully navigated to ${url}`);
    return response;
  },
};

