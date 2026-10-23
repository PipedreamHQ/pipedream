import weinc from "../../weinc.app.mjs";

export default {
  key: "weinc-create-project",
  name: "Create Project",
  description: "Creates a new website project for a client. [See the documentation](https://my.we.inc/api/v1/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    weinc,
    clientEmail: {
      propDefinition: [
        weinc,
        "clientEmail",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the project",
      optional: true,
    },
    templateId: {
      propDefinition: [
        weinc,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.weinc.createProject({
      $,
      data: {
        client_email: this.clientEmail,
        name: this.name,
        description: this.description,
        template_id: this.templateId,
      },
    });
    $.export("$summary", `Successfully created project "${this.name}"`);
    return response;
  },
};
