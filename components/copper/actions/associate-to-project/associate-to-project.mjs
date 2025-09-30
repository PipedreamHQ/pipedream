import copper from "../../copper.app.mjs";

export default {
  key: "copper-associate-to-project",
  name: "Associate to Project",
  description: "Relates an existing project with an existing CRM object. [See the documentation](https://developer.copper.com/related-items/relate-an-existing-record-to-an-entity.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    copper,
    projectId: {
      propDefinition: [
        copper,
        "objectId",
        () => ({
          objectType: "projects",
        }),
      ],
      label: "Project ID",
      description: "The ID of the project you wish to relate",
    },
    objectType: {
      propDefinition: [
        copper,
        "objectType",
      ],
    },
    objectId: {
      propDefinition: [
        copper,
        "objectId",
        (c) => ({
          objectType: c.objectType,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.copper.relateProjectToCrmObject({
      $,
      objectType: this.objectType,
      objectId: this.objectId,
      data: {
        resource: {
          id: this.projectId,
          type: "project",
        },
      },
    });
    $.export("$summary", `Successfully associated Project ID ${this.projectId} with CRM ID ${this.objectId}`);
    return response;
  },
};
