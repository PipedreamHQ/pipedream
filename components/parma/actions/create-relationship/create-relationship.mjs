import parma from "../../parma.app.mjs";

export default {
  key: "parma-create-relationship",
  name: "Create Relationship",
  description: "Creates a new relationship in Parma. [See the documentation](https://developers.parma.ai/api-docs/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    parma,
    name: {
      propDefinition: [
        parma,
        "name",
      ],
    },
    type: {
      propDefinition: [
        parma,
        "relationshipType",
      ],
      optional: true,
    },
    groupIds: {
      propDefinition: [
        parma,
        "groupIds",
      ],
    },
    about: {
      type: "string",
      label: "About",
      description: "The context of the relationship.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.parma.createRelationship({
      $,
      data: {
        name: this.name,
        type: this.type,
        group_ids: this.groupIds,
        about: this.about,
      },
    });

    $.export("$summary", `Successfully created relationship with Id: ${response.data.id}`);
    return response;
  },
};
