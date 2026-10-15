import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-initiative",
  name: "Create Initiative",
  description: "Create a new initiative in Linear to track a cross-team strategic goal. Initiatives group multiple projects toward a shared objective. Use **List Users** to find a valid owner ID. Example: `initiativeName: \"Q4 Platform Upgrade\"`, `status: \"Active\"`, `targetDate: \"2024-12-31\"` → returns `{success: true, initiative: {id: \"ini_01abc\", name: \"Q4 Platform Upgrade\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=initiativeCreate)",
  version: "1.0.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    initiativeName: {
      type: "string",
      label: "Name",
      description: "The name of the initiative. Example: `Q4 Platform Upgrade`.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the initiative",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the initiative in markdown format",
      optional: true,
    },
    status: {
      propDefinition: [
        linearApp,
        "initiativeStatus",
      ],
    },
    color: {
      type: "string",
      label: "Color",
      description: "The color of the initiative",
      optional: true,
    },
    targetDate: {
      propDefinition: [
        linearApp,
        "targetDate",
      ],
    },
    ownerId: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
      label: "Owner",
      description: "The user to assign to the initiative",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.createInitiative({
      name: this.initiativeName,
      description: this.description,
      content: this.content,
      status: this.status,
      color: this.color,
      targetDate: this.targetDate,
      ownerId: this.ownerId,
    });

    $.export("$summary", `Successfully created initiative with ID ${response._initiative.id}`);

    return response;
  },
};
