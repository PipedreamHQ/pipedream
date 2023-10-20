import onedesk from "../../onedesk.app.mjs";

export default {
  key: "onedesk-create-project",
  name: "Create Project",
  description: "Creates a project/space. [See the docs](https://www.onedesk.com/developers/#_create_space)",
  version: "0.0.1",
  type: "action",
  props: {
    onedesk,
    type: {
      propDefinition: [
        onedesk,
        "containerType",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the project/space",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the project/space",
      optional: true,
    },
    parentIds: {
      propDefinition: [
        onedesk,
        "parentIds",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.onedesk.createSpace({
      data: {
        containerType: this.type,
        name: this.name,
        description: this.description,
        parentIds: this.parentIds,
      },
      $,
    });

    $.export("$summary", `Successfully created project with ID ${data.id}.`);

    return data;
  },
};
