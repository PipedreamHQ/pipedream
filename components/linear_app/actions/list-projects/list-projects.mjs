import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-list-projects",
  name: "List Projects",
  description: "List projects in Linear, optionally filtered by team. Returns project objects including `id`, `name`, `state`, `priority`, and progress history. Use **Get Teams** to find team IDs. Use the optional `fields` prop to narrow the response when only specific fields are needed (reduces context for large result sets). Example: `teamId: \"9d1c3f7e-...\"` → returns `{nodes: [{id: \"proj_01\", name: \"Mobile App v2\", state: {name: \"In Progress\"}}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectConnection?query=projects).",
  type: "action",
  ai: "optimized",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      optional: true,
      description: "Filter projects by team. Leave this parameter out of the tool call entirely to list projects across all accessible teams — do not pass `\"*\"`, an empty string, or any other placeholder, since only a real team UUID or no value at all are valid. Use **Get Teams** to discover valid team IDs.",
    },
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
    first: {
      type: "integer",
      label: "First",
      description: "The number of projects to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of projects",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned project object. When omitted, the full project payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"name\", \"state\", \"priority\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    // Some models pass a wildcard placeholder like "*" instead of omitting an
    // optional ID filter; treat anything that isn't a real team ID as "no filter".
    const teamId = this.teamId && this.teamId !== "*"
      ? this.teamId
      : undefined;

    const variables = utils.buildVariables(this.after, {
      filter: {
        accessibleTeams: {
          id: {
            eq: teamId,
          },
        },
      },
      orderBy: this.orderBy,
      limit: this.first,
    });

    const {
      nodes, pageInfo,
    } = await this.linearApp.listProjects(variables);

    $.export("$summary", `Found ${nodes.length} project${nodes.length === 1
      ? ""
      : "s"}`);

    if (this.fields?.length) {
      return {
        nodes: nodes.map((project) => {
          const shaped = {};
          for (const field of this.fields) {
            shaped[field] = project[field];
          }
          return shaped;
        }),
        pageInfo,
      };
    }

    return {
      nodes,
      pageInfo,
    };
  },
};
