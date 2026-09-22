import salesmsg from "../../salesmsg.app.mjs";

export default {
  key: "salesmsg-list-contact-id-options",
  name: "List Contact Id Options",
  description: "Retrieves available options for the Contact Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    salesmsg,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await salesmsg.propDefinitions.contactId.options.call(this.salesmsg, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
