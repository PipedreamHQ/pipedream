import acelle_mail from "../../acelle_mail.app.mjs";

export default {
  key: "acelle_mail-list-subscriber-id-options",
  name: "List Subscriber ID Options",
  description: "Retrieves available options for the Subscriber ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    acelle_mail,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await acelle_mail.propDefinitions.subscriberId.options
      .call(this.acelle_mail, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
