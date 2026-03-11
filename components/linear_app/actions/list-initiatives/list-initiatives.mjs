import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-initiatives",
  name: "List Initiatives",
  description: "List initiatives in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=initiatives)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    name: {
      type: "string",
      label: "Name",
      description: "Search for initiatives that contain the provided name",
      optional: true,
    },
    status: {
      propDefinition: [
        linearApp,
        "initiativeStatus",
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
      description: "The number of initiatives to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of initiatives",
      optional: true,
    },
  },
  async run({ $ }) {
    const variables = {
      filter: {
        name: {
          contains: this.name,
        },
        status: {
          eq: this.status,
        },
      },
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
    };

    const {
      nodes, pageInfo,
    } = await this.linearApp.listInitiatives(variables);

    $.export("$summary", `Found ${nodes.length} initiatives`);

    return {
      nodes,
      pageInfo,
    };
  },
};
