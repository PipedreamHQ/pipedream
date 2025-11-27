import helpScout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-list-tags",
  name: "List Tags",
  description: "Lists all tags in Help Scout. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/tags/list/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    helpScout,
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return. Defaults to 1.",
      default: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.helpScout.listTags({
      $,
      params: {
        page: this.page,
      },
    });
    const length = response?._embedded?.tags?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${length} tag${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
