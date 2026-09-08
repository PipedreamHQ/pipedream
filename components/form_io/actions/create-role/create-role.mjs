import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-create-role",
  name: "Create Role",
  description: "Create a role in the Form.io project. Use **List Roles** to review existing roles. Example: title `Reviewer`, description `Can review submissions` → returns the new role with its `_id`. [See the documentation](https://apidocs.form.io/#5123aaee-8a9d-42f0-b46f-0bd73b0477dd).",
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
    title: {
      type: "string",
      label: "Title",
      description: "The title of the role (e.g. `Manager`).",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the role.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      title,
      description,
    } = this;

    const response = await this.formIo.createRole({
      $,
      data: {
        title,
        description,
      },
    });

    $.export("$summary", `Created role "${response.title}" (${response._id})`);
    return response;
  },
};
