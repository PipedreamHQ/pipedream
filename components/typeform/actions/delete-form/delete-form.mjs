import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  key: "typeform-delete-form",
  name: "Delete Form",
  description: "Select the a form to be deleted. [See the docs here](https://developer.typeform.com/create/reference/delete-form/).",
  type: "action",
  version: "0.0.1",
  methods: common.methods,
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

    try {
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

    } catch (error) {
      const message =
        error.response?.status === 404
          ? "Form not found. Please enter the ID again."
          : error;
      throw new Error(message);
    }
  },
};
