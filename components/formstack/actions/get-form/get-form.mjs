import formstack from "../../formstack.app.mjs";

export default {
  type: "action",
  key: "formstack-get-form",
  name: "Get Form",
  description: "Get the details of the specified form. [See docs here](https://formstack.readme.io/docs/form-id-get)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    formstack,
    formId: {
      propDefinition: [
        formstack,
        "formId",
      ],
    },
  },
  async run({ $ }) {
    const { formId } = this;

    const response = await this.formstack.getForm({
      formId,
      $,
    });

    $.export("$summary", "Successfully retrieved form");

    return response;
  },
};
