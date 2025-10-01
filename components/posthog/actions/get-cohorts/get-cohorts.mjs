import posthog from "../../posthog.app.mjs";

export default {
  key: "posthog-get-cohorts",
  name: "Get Cohorts",
  description: "Retrieve a list of cohorts. [See the documentation](https://posthog.com/docs/api/cohorts#get-api-projects-project_id-cohorts)",
  version: "0.0.2",
  type: "action",
  props: {
    posthog,
    organizationId: {
      propDefinition: [
        posthog,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        posthog,
        "projectId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
    maxResults: {
      propDefinition: [
        posthog,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const cohorts = await this.posthog.iterateResults({
      fn: this.posthog.listCohorts,
      args: {
        $,
        projectId: this.projectId,
        max: this.maxResults,
      },
    });
    $.export("$summary", `Successfully retrieved ${cohorts.length} cohort${cohorts.length === 1
      ? ""
      : "s"}`);
    return cohorts;
  },
};
