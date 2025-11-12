import browserhub from "../../browserhub.app.mjs";

export default {
  key: "browserhub-run-automation",
  name: "Run Automation",
  description: "Triggers a pre-built automation by providing the scraper ID. [See the documentation](https://developer.browserhub.io/runs/#create-a-run)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserhub,
    scraperId: {
      propDefinition: [
        browserhub,
        "scraperId",
      ],
    },
    rowsLimit: {
      type: "integer",
      label: "Rows Limit",
      description: "Maximum number of extracted rows that want to be modified.",
      optional: true,
    },
    webhookURL: {
      type: "string",
      label: "Webhook URL",
      description: "URL that will be called after the scraper run `status` is **not** `running` anymore.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.browserhub.createRun({
      $,
      data: {
        scraper_id: this.scraperId,
        rows_limit: this.rowsLimit,
        webhook_url: this.webhookURL,
      },
    });
    $.export("$summary", `Successfully triggered automation with Scraper ID: ${response.id}`);
    return response;
  },
};
