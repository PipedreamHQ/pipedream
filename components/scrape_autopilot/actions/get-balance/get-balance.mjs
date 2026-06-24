import scrapeAutopilot from "../../scrape_autopilot.app.mjs";

export default {
  name: "Get Balance",
  description: "Check your Scrape Autopilot credit balance to keep cost-efficient scraping workflows under control.",
  key: "scrape_autopilot-get-balance",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    scrapeAutopilot,
  },
  async run({ $ }) {
    const data = await this.scrapeAutopilot.getBalance({
      $,
    });

    $.export("$summary", `Credit balance: ${data.credits}`);
    return data;
  },
};
