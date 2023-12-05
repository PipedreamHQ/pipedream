import browserhub from "../../browserhub.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "browserhub-run-automation",
  name: "Run Automation",
  description: "Triggers a pre-built automation by providing the scraper ID. [See the documentation](https://developer.browserhub.io/runs/#create-a-run)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    browserhub,
    scraperId: {
      propDefinition: [
        browserhub,
        "scraperId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.browserhub.triggerScraper({
      scraperId: this.scraperId,
    });
    $.export("$summary", `Successfully triggered automation with Scraper ID: ${this.scraperId}`);
    return response;
  },
};
