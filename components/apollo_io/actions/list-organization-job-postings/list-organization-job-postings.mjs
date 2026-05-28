import app from "../../apollo_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io-list-organization-job-postings",
  name: "List Organization Job Postings",
  description: "List the open job postings for a specific Apollo organization. Use **Search For Organizations** to find a valid organization ID. [See the documentation](https://docs.apollo.io/reference/organization-jobs-postings)",
  type: "action",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const resourcesStream = this.app.getIterations({
      resourceFn: this.app.listOrganizationJobPostings,
      resourceFnArgs: {
        $,
        organizationId: this.organizationId,
      },
      resourceName: "organization_job_postings",
    });

    const jobPostings = await utils.iterate(resourcesStream);
    $.export("$summary", `Successfully fetched ${jobPostings.length} job postings.`);
    return jobPostings;
  },
};
