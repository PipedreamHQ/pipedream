import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-update-initiative",
  name: "Update Initiative",
  description: "Update an existing initiative in Linear. All fields are optional; only provided fields are updated. Use **List Initiatives** to find the initiative ID. Example: `initiativeId: \"b2c3d4e5-0000-0000-0000-000000000002\"`, `status: \"Completed\"` → returns `{success: true, initiative: {id: \"b2c3d4e5-...\", name: \"Q4 Platform Upgrade\", status: \"Completed\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=initiativeupdate)",
  version: "0.0.5",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    initiativeId: {
      propDefinition: [
        linearApp,
        "initiativeId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the initiative",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the initiative",
      optional: true,
    },
    status: {
      propDefinition: [
        linearApp,
        "initiativeStatus",
      ],
    },
    targetDate: {
      propDefinition: [
        linearApp,
        "targetDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.updateInitiative(this.initiativeId, {
      name: this.name,
      description: this.description,
      status: this.status,
      targetDate: this.targetDate,
    });

    $.export("$summary", `Successfully updated initiative with ID ${response._initiative.id}`);

    return response;
  },
};
