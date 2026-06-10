import whautomate from "../../whautomate.app.mjs";

export default {
  key: "whautomate-list-contact-tags-options",
  name: "List Contact Tags Options",
  description: "Retrieves available options for the Contact Tags field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    whautomate,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await whautomate.propDefinitions.contactTags.options.call(this.whautomate, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
