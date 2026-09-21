import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-get-form",
  name: "Get Form",
  description: "Retrieve a single form or resource by its ID from Form.io. Use **List Forms** to find the form ID. [See the documentation](https://apidocs.form.io/#fc94dbcd-7ac6-4d0f-9824-f7979bb6e67f).",
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
  },
  async run({ $ }) {
    const response = await this.formIo.getForm({
      $,
      formId: this.formId,
    });

    $.export("$summary", `Retrieved form "${response.title}" (${response._id})`);
    return response;
  },
};
