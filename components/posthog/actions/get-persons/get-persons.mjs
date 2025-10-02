import posthog from "../../posthog.app.mjs";

export default {
  key: "posthog-get-persons",
  name: "Get Persons",
  description: "Retrieve a list of persons. [See the documentation](https://posthog.com/docs/api/persons#get-api-projects-project_id-persons)",
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
    email: {
      type: "string",
      label: "Email",
      description: "Filter persons by email (exact match)",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Search persons, either by email (full text search) or distinct_id (exact match)",
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
    const persons = await this.posthog.iterateResults({
      fn: this.posthog.listPersons,
      args: {
        $,
        projectId: this.projectId,
        params: {
          email: this.email,
          search: this.search,
        },
        max: this.maxResults,
      },
    });
    $.export("$summary", `Successfully retrieved ${persons.length} person${persons.length === 1
      ? ""
      : "s"}`);
    return persons;
  },
};
