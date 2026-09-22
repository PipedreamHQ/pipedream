import constant_contact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-list-taggings-options",
  name: "List Taggings Options",
  description: "Retrieves available options for the Taggings field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    constant_contact,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await constant_contact.propDefinitions.taggings.options
      .call(this.constant_contact, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
