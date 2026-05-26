import constant_contact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-list-list-memberships-options",
  name: "List List Membership Options",
  description: "Retrieves available options for the List Membership field.",
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
    const options = await constant_contact.propDefinitions.listMemberships.options
      .call(this.constant_contact, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
