import posthog from "../../posthog.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "posthog-update-project-insight",
  name: "Update Project Insight",
  description: "Update an existing insight in a project. [See the documentation](https://posthog.com/docs/api/insights#patch-api-projects-project_id-insights-id)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
    idempotentHint: true,
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
    insightId: {
      propDefinition: [
        posthog,
        "insightId",
        (c) => ({
          projectId: c.projectId,
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
      insightId,
      name,
      derivedName,
      query,
      description,
      tags,
      favorited,
      deleted,
    } = this;

    const insight = await posthog.updateInsight({
      $,
      projectId,
      insightId,
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

    $.export("$summary", `Successfully updated insight with ID ${insightId}`);
    return insight;
  },
};
