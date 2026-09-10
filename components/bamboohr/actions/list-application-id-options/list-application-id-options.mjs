import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-application-id-options",
  name: "List Application ID Options",
  description: "Retrieves available application IDs for use with applicant-tracking actions. [See the documentation](https://documentation.bamboohr.com/reference/get-applications)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    page: {
      type: "integer",
      label: "Page",
      description: "0-based page index; `0` returns the first page, `1` returns the second page, etc.",
      min: 0,
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const { applications } = await this.bamboohr.listApplications({
      $,
      params: {
        page: this.page + 1,
      },
    });
    const options = (applications ?? []).map((application) => ({
      label: `${application.applicant.firstName} ${application.applicant.lastName}`,
      value: application.id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
