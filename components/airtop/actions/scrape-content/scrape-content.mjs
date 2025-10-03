import app from "../../airtop.app.mjs";

export default {
  key: "airtop-scrape-content",
  name: "Scrape Content",
  description: "Scrape structured content from a web page using AI. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/windows/scrape-content)",
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
      label: "Scraping Prompt",
      description: "Natural language prompt describing what content to scrape. For example: 'Scrape all article titles and publication dates' or 'Extract contact information from this page'",
    },
    followPaginationLinks: {
      type: "boolean",
      label: "Follow Pagination Links",
      description: "Automatically navigate through paginated content to scrape data from multiple pages",
      optional: true,
      default: false,
    },
    costThresholdCredits: {
      type: "integer",
      label: "Cost Threshold (Credits)",
      description: "Maximum credits to spend on this operation before cancellation. Set to 0 to disable (not recommended).",
      optional: true,
    },
    timeThresholdSeconds: {
      type: "integer",
      label: "Time Threshold (Seconds)",
      description: "Maximum time in seconds before the operation is cancelled. Set to 0 to disable (not recommended).",
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

    const response = await this.app.scrapeContent({
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

    let summary = "Successfully scraped content";
    if (creditsUsed) {
      summary += ` (${creditsUsed} credits used)`;
    }

    $.export("$summary", summary);
    return response;
  },
};

