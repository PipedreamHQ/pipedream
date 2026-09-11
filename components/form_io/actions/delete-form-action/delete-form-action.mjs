import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-delete-form-action",
  name: "Delete Form Action",
  description: "Permanently remove an action attached to a Form.io form. Use **List Form Actions** to find the action ID. This is irreversible. [See the documentation](https://apidocs.form.io/#994dc489-e530-4920-9389-813ba2ac9005).",
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
    actionId: {
      propDefinition: [
        formIo,
        "actionId",
      ],
    },
  },
  async run({ $ }) {
    const {
      formId,
      actionId,
    } = this;

    const response = await this.formIo.deleteFormAction({
      $,
      formId,
      actionId,
    });

    $.export("$summary", `Deleted form action ${actionId}`);
    return response;
  },
};
