import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-get-role",
  name: "Get Role",
  description: "Retrieve a single role by its ID from the Form.io project. Use **List Roles** to find the role ID. [See the documentation](https://apidocs.form.io/#df393393-6262-4c3a-8a5d-d3abb3182409).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.formIo.getRole({
      $,
      roleId: this.roleId,
    });

    $.export("$summary", `Retrieved role "${response.title}" (${response._id})`);
    return response;
  },
};
