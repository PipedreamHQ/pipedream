import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-update-initiative",
  name: "Update Initiative",
  description: "Update an initiative in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=initiativeupdate)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: true,
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
