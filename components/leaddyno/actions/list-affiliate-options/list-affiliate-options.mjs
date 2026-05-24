import leaddyno from "../../leaddyno.app.mjs";

export default {
  key: "leaddyno-list-affiliate-options",
  name: "List Affiliate Options",
  description: "Retrieves available options for the Affiliate field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    leaddyno,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await leaddyno.propDefinitions.affiliate.options.call(this.leaddyno, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
