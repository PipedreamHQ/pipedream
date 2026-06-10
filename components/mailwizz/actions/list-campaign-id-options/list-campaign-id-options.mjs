import mailwizz from "../../mailwizz.app.mjs";

export default {
  key: "mailwizz-list-campaign-id-options",
  name: "List Campaign UID Options",
  description: "Retrieves available options for the Campaign UID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailwizz,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await mailwizz.propDefinitions.campaignId.options.call(this.mailwizz, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
