import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-delete-role",
  name: "Delete Role",
  description: "Permanently delete a role from the Form.io project. Use **List Roles** to find the role ID. This is irreversible. [See the documentation](https://apidocs.form.io/#df393393-6262-4c3a-8a5d-d3abb3182409).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
  },
  async run({ $ }) {
    const response = await this.formIo.deleteRole({
      $,
      roleId: this.roleId,
    });

    $.export("$summary", `Deleted role ${this.roleId}`);
    return response;
  },
};
