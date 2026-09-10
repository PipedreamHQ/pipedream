import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-job-id-options",
  name: "List Job ID Options",
  description: "Retrieves available job IDs for use with applicant-tracking actions. [See the documentation](https://documentation.bamboohr.com/reference/get-jobs)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
  },
  async run({ $ }) {
    const jobs = await this.bamboohr.listJobs({
      $,
    });
    const options = (jobs ?? []).map((job) => ({
      label: job.title.label,
      value: job.id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
