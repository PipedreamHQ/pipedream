import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "typeform-delete-form",
  name: "Delete Form",
  description: "Delete a form and all of the form's responses. [See the docs here](https://developer.typeform.com/create/reference/delete-form/).",
  type: "action",
  version: "0.0.1",
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
      return {
        id: formId,
        success: true,
      },
      // can we pull in the form title here instead of formId?
      $.export("$summary", `🎉 Successfully deleted the form, "${formId}"`);
    }

    return response;
  },
};