import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-status-id-options",
  name: "List Status ID Options",
  description: "Retrieves available application status IDs for use with applicant-tracking actions. [See the documentation](https://documentation.bamboohr.com/reference/get-statuses)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    bamboohr,
  },
  async run({ $ }) {
    const statuses = await this.bamboohr.listStatuses({
      $,
    });
    const options = (statuses ?? []).map((status) => ({
      label: status.name,
      value: status.id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
