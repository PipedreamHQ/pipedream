import samsara from "../../samsara.app.mjs";

export default {
  key: "samsara-list-contact-ids-options",
  name: "List Contact Ids Options",
  description: "Retrieves available options for the Contact Ids field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    samsara,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await samsara.propDefinitions.contactIds.options.call(this.samsara, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
