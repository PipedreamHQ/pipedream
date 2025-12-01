import posthog from "../../posthog.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "posthog-create-project-insight",
  name: "Create Project Insight",
  description: "Create a new insight in a project. [See the documentation](https://posthog.com/docs/api/insights#post-api-projects-project_id-insights)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
    idempotentHint: false,
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
    name: {
      type: "string",
      label: "Name",
      description: "Name of the insight",
      optional: true,
    },
    derivedName: {
      type: "string",
      label: "Derived Name",
      description: "Derived name of the insight",
      optional: true,
    },
    query: {
      propDefinition: [
        posthog,
        "query",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the insight",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for the insight",
      optional: true,
    },
    favorited: {
      type: "boolean",
      label: "Favorited",
      description: "Whether the insight is favorited",
      optional: true,
    },
    deleted: {
      type: "boolean",
      label: "Deleted",
      description: "Whether the insight is deleted",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      posthog,
      projectId,
      name,
      derivedName,
      query,
      description,
      tags,
      favorited,
      deleted,
    } = this;

    const insight = await posthog.createInsight({
      $,
      projectId,
      data: {
        name,
        derived_name: derivedName,
        query: utils.parseJson(query),
        description,
        tags: utils.parseJson(tags),
        favorited,
        deleted,
      },
    });

    $.export("$summary", `Successfully created insight${name
      ? ` "${name}"`
      : ""} with ID ${insight.id}`);
    return insight;
  },
};
