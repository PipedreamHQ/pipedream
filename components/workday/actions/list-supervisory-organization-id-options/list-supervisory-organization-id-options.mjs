import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-supervisory-organization-id-options",
  name: "List Supervisory Organization ID Options",
  description: "Retrieves available options for the Supervisory Organization ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    workday,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await workday.propDefinitions.supervisoryOrganizationId.options
      .call(this.workday, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
