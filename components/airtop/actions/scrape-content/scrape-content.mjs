import app from "../../airtop.app.mjs";

export default {
  key: "airtop-scrape-content",
  name: "Scrape Content",
  description: "Scrape structured content from a web page using AI. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/windows/scrape-content)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    clientRequestId: {
      type: "string",
      label: "Client Request ID",
      description: "Optional client-provided request identifier",
      optional: true,
    },
    costThresholdCredits: {
      propDefinition: [
        app,
        "costThresholdCredits",
      ],
    },
    timeThresholdSeconds: {
      propDefinition: [
        app,
        "timeThresholdSeconds",
      ],
    },
  },
  async run({ $ }) {
    const {
      sessionId,
      windowId,
      clientRequestId,
      costThresholdCredits,
      timeThresholdSeconds,
    } = this;

    const response = await this.app.scrapeContent({
      $,
      sessionId,
      windowId,
      data: {
        clientRequestId,
        costThresholdCredits,
        timeThresholdSeconds,
      },
    });

    $.export("$summary", "Successfully scraped content from the page");
    return response;
  },
};

