import pretix from "../../pretix.app.mjs";

export default {
  key: "pretix-list-organizer-slug-options",
  name: "List Organizer Slug Options",
  description: "Retrieves available options for the Organizer Slug field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pretix,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await pretix.propDefinitions.organizerSlug.options.call(this.pretix, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
