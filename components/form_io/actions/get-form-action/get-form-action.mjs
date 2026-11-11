import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-get-form-action",
  name: "Get Form Action",
  description: "Retrieve a single action attached to a Form.io form. Use **List Form Actions** to find the action ID. [See the documentation](https://apidocs.form.io/#72821b94-cc96-41b4-b271-cb5d9e9261cd).",
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

    const response = await this.formIo.getFormAction({
      $,
      formId,
      actionId,
    });

    $.export("$summary", `Retrieved form action "${response.title}" (${response._id})`);
    return response;
  },
};
