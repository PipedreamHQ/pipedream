import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-delete-form",
  name: "Delete Form",
  description: "Permanently delete a form or resource from Form.io. Use **List Forms** to find the form ID. This is irreversible. [See the documentation](https://apidocs.form.io/#1e1a35ef-1456-4dd0-9b4e-62416759a73d).",
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
    formId: {
      propDefinition: [
        formIo,
        "formId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.formIo.deleteForm({
      $,
      formId: this.formId,
    });

    $.export("$summary", `Deleted form ${this.formId}`);
    return response;
  },
};
