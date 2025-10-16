import posthog from "../../posthog.app.mjs";

export default {
  key: "posthog-get-surveys",
  name: "Get Surveys",
  description: "Retrieve a list of surveys. [See the documentation](https://posthog.com/docs/api/surveys#get-api-projects-project_id-surveys)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    search: {
      type: "string",
      label: "Search",
      description: "Enter a search term to filter results",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        posthog,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const surveys = await this.posthog.iterateResults({
      fn: this.posthog.listSurveys,
      args: {
        $,
        projectId: this.projectId,
        params: {
          search: this.search,
        },
        max: this.maxResults,
      },
    });
    $.export("$summary", `Successfully retrieved ${surveys.length} survey${surveys.length === 1
      ? ""
      : "s"}`);
    return surveys;
  },
};
