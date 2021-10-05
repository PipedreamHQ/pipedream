import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "typeform-delete-form",
  name: "Delete Form",
  description: "Select the a form to be deleted. [See the docs here](https://developer.typeform.com/create/reference/delete-form/).",
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
      };
    }

    return response;
  },
};
