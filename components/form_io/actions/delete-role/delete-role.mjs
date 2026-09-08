import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-delete-role",
  name: "Delete Role",
  description: "Permanently delete a role from the Form.io project. Obtain the role ID from **List Roles** (it is the role's 24-character hex `_id`, e.g. `64f8a1b2c3d4e5f60718293a`). This is irreversible. [See the documentation](https://apidocs.form.io/#df393393-6262-4c3a-8a5d-d3abb3182409).",
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
