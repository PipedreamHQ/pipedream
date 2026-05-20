import browserhub from "../../browserhub.app.mjs";

export default {
  key: "browserhub-list-scraper-id-options",
  name: "List Scraper ID Options",
  description: "Retrieves available options for the Scraper ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    browserhub,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await browserhub.propDefinitions.scraperId.options.call(this.browserhub, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
