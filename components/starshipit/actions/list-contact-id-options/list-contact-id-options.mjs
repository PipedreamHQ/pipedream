import starshipit from "../../starshipit.app.mjs";

export default {
  key: "starshipit-list-contact-id-options",
  name: "List Destination Options",
  description: "Retrieves available options for the Destination field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    starshipit,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await starshipit.propDefinitions.contactId.options.call(this.starshipit, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
