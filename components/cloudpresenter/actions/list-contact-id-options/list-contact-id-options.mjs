import cloudpresenter from "../../cloudpresenter.app.mjs";

export default {
  key: "cloudpresenter-list-contact-id-options",
  name: "List Contact UUID Options",
  description: "Retrieves available options for the Contact UUID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cloudpresenter,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await cloudpresenter.propDefinitions.contactId.options
      .call(this.cloudpresenter, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
