import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-lookup-job",
  name: "Lookup Job",
  description: "Look up detailed job posting information by job search ID. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    destructiveHint: false,
  },
  props: {
    pubrio,
    jobSearchId: {
      type: "string",
      label: "Job Search ID",
      description: "The job search ID to look up",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.lookupJob({
      $,
      data: {
        job_search_id: this.jobSearchId,
      },
    });
    $.export("$summary", "Successfully looked up job");
    return response;
  },
};
