import app from "../../airtop.app.mjs";

export default {
  key: "airtop-query-page",
  name: "Query Page",
  description: "Extract data or ask questions about page content using AI. Submit a natural language prompt to query the content of a browser window. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/windows/page-query)",
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
      description: "Natural language prompt to submit about the page content. For example: 'Extract all product names and prices' or 'Is the user logged in?'",
    },
    followPaginationLinks: {
      type: "boolean",
      label: "Follow Pagination Links",
      description: "Make a best effort attempt to load more content items than are originally displayed on the page by following pagination links, clicking controls to load more content, or utilizing infinite scrolling. This can be more costly but may be necessary for sites requiring additional interaction.",
      optional: true,
      default: false,
    },
    costThresholdCredits: {
      type: "integer",
      label: "Cost Threshold (Credits)",
      description: "A credit threshold that, once exceeded, will cause the operation to be cancelled. This is not a hard limit but checked periodically. Set to 0 to disable (not recommended).",
      optional: true,
    },
    timeThresholdSeconds: {
      type: "integer",
      label: "Time Threshold (Seconds)",
      description: "A time threshold that, once exceeded, will cause the operation to be cancelled. This is checked periodically. Set to 0 to disable (not recommended).",
      optional: true,
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

    const creditsUsed = response.meta?.usage?.credits;

    let summary = "Successfully queried page";
    if (creditsUsed) {
      summary += ` (${creditsUsed} credits used)`;
    }

    $.export("$summary", summary);
    return response;
  },
};

