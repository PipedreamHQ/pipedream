import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-list-store-id-options",
  name: "List Store Id Options",
  description: "Retrieves available options for the Store Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailchimp,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await mailchimp.propDefinitions.storeId.options.call(this.mailchimp, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
