import app from "../../airtop.app.mjs";

export default {
  key: "airtop-query-page",
  name: "Query Page",
  description: "Extract data or ask questions about page content using AI. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/windows/page-query)",
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
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt to submit about the content in the browser window.",
    },
    followPaginationLinks: {
      propDefinition: [
        app,
        "followPaginationLinks",
      ],
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
      prompt,
      followPaginationLinks,
      costThresholdCredits,
      timeThresholdSeconds,
    } = this;

    const response = await this.app.queryPage({
      $,
      sessionId,
      windowId,
      data: {
        prompt,
        configuration: {
          followPaginationLinks,
          costThresholdCredits,
          timeThresholdSeconds,
        },
      },
    });

    $.export("$summary", "Successfully queried page");
    return response;
  },
};

