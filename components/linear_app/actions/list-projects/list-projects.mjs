import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-list-projects",
  name: "List Projects",
  description: "List projects in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectConnection?query=projects).",
  type: "action",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const variables = utils.buildVariables(this.after, {
      filter: {
        accessibleTeams: {
          id: {
            eq: this.teamId,
          },
        },
      },
      orderBy: this.orderBy,
      limit: this.first,
    });

    const {
      nodes, pageInfo,
    } = await this.linearApp.listProjects(variables);

    $.export("$summary", `Found ${nodes.length} projects`);

    return {
      nodes,
      pageInfo,
    };
  },
};
