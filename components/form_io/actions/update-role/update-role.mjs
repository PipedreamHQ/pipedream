import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-update-role",
  name: "Update Role",
  description: "Update a role in the Form.io project. Only the fields you provide are changed; omitted fields keep their current values. Use **List Roles** to find the role ID. Example: for `roleId` `64f...abc`, set description to `Read-only reviewer` → returns the updated role. [See the documentation](https://apidocs.form.io/#6ad0536d-1927-41c5-b406-956ac736f9e5).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    formIo,
    roleId: {
      propDefinition: [
        formIo,
        "roleId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Updated title of the role.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Updated description of the role.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      roleId,
      title,
      description,
    } = this;

    const response = await this.formIo.updateRole({
      $,
      roleId,
      data: {
        title,
        description,
      },
    });

    $.export("$summary", `Updated role "${response.title}" (${response._id})`);
    return response;
  },
};
