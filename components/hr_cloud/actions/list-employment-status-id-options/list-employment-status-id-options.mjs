import hr_cloud from "../../hr_cloud.app.mjs";

export default {
  key: "hr_cloud-list-employment-status-id-options",
  name: "List Employment Status ID Options",
  description: "Retrieves available options for the Employment Status ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hr_cloud,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await hr_cloud.propDefinitions.employmentStatusId.options.call(this.hr_cloud, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
