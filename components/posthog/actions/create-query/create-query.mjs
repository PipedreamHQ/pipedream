import posthog from "../../posthog.app.mjs";

export default {
  key: "posthog-create-query",
  name: "Create Query",
  description: "Create a HogQLQuery and return the results. [See the documentation](https://posthog.com/docs/api/queries#creating-a-query)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    query: {
      type: "string",
      label: "Query",
      description: "The query specifying what data to retrieve. Example: `select properties.email from persons where properties.email is not null`",
    },
    name: {
      type: "string",
      label: "Name",
      description: "A name for the query to better identify it in the query_log table",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.posthog.createQuery({
      $,
      projectId: this.projectId,
      data: {
        query: {
          kind: "HogQLQuery",
          query: this.query,
          name: this.name,
        },
      },
    });
    $.export("$summary", "Successfully created and executed query");
    return response;
  },
};
