import acymailing from "../../acymailing.app.mjs";

export default {
  key: "acymailing-list-list-ids-options",
  name: "List List Ids Options",
  description: "Retrieves available options for the List Ids field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    acymailing,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await acymailing.propDefinitions.listIds.options
      .call(this.acymailing, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
