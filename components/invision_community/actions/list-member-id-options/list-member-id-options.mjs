import invision_community from "../../invision_community.app.mjs";

export default {
  key: "invision_community-list-member-id-options",
  name: "List Member ID Options",
  description: "Retrieves available options for the Member ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    invision_community,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await invision_community.propDefinitions.memberId.options
      .call(this.invision_community, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
