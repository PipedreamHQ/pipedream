import status_hero from "../../status_hero.app.mjs";

export default {
  key: "status_hero-list-member-id-options",
  name: "List Member Id Options",
  description: "Retrieves available options for the Member Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    status_hero,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await status_hero.propDefinitions.memberId.options.call(this.status_hero, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
