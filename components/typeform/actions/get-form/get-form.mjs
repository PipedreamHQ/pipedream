import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  key: "typeform-get-form",
  name: "Get a Form",
  description: "Select a specific form to get the data. [See the docs here](https://developer.typeform.com/create/reference/retrieve-form/)",
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
    try {
      return await this.typeform.getForm({
        $,
        formId: this.formId,
      });

    } catch (error) {
      throw new Error(error);
    }
  },
};
