import typeform from "../../typeform.app.mjs";

export default {
  key: "typeform-delete-form",
  name: "Delete Form",
  description: "Select a form to be deleted. [See the docs here](https://developer.typeform.com/create/reference/delete-form/).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    typeform,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
  },
  async run({ $ }) {
    const { formId } = this;

    const response = await this.typeform.deleteForm({
      $,
      formId,
    });

    if (!response) {
      $.export("$summary", `Successfully deleted the form, "${formId}"`);
      return {
        id: formId,
        success: true,
      };
    }

    return response;
  },
};
