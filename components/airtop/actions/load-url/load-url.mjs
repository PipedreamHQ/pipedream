import app from "../../airtop.app.mjs";

export default {
  key: "airtop-load-url",
  name: "Load URL",
  description: "Navigate a browser window to a specific URL. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/windows/load-url)",
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
      description: "The URL to navigate to (must be a valid URI)",
    },
    waitUntil: {
      type: "string",
      label: "Wait Until",
      description: "Wait until the specified loading event occurs. `load` waits until the page DOM and assets have loaded. `domContentLoaded` waits until the DOM has loaded. `complete` waits until the page and all its iframes have loaded. `noWait` returns immediately.",
      optional: true,
      options: [
        "load",
        "domContentLoaded",
        "complete",
        "noWait",
      ],
      default: "load",
    },
    waitUntilTimeoutSeconds: {
      type: "integer",
      label: "Wait Timeout (Seconds)",
      description: "Maximum time in seconds to wait for the specified loading event. If the timeout is reached, the operation will still succeed but return a warning.",
      optional: true,
      default: 30,
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

