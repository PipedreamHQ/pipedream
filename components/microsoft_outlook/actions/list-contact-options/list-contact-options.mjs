import microsoft_outlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-list-contact-options",
  name: "List Contact Options",
  description: "Retrieves available options for the Contact field.",
  version: "0.0.5",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoft_outlook,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await microsoft_outlook.propDefinitions.contact.options
      .call(this.microsoft_outlook, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
