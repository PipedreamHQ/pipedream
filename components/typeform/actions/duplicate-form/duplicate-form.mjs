/* eslint-disable no-unused-vars */
import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  key: "typeform-duplicate-form",
  name: "Duplicate a Form",
  description: "Duplicates an existing form in your Typeform account with a different `title`. [See the docs here](https://developer.typeform.com/create/reference/create-form/)",
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
    let formResponse;

    try {
      formResponse =
        await this.typeform.getForm({
          $,
          formId: this.formId,
        });

    } catch (error) {
      const message =
        error.response?.status === 404
          ? "Form not found. Please enter the ID again."
          : error;
      throw new Error(message);
    }

    const {
      id,
      _links,
      title,
      ...otherData
    } = formResponse;

    const dataStr = JSON.stringify(otherData);
    const idFields = /"id":"\w+",?/g;
    const dataWithoutIdsStr = dataStr.replace(idFields, "");
    const dataWithoutIds = JSON.parse(dataWithoutIdsStr);

    const data = {
      title: `${title} (copy)`,
      ...dataWithoutIds,
    };

    try {
      return await this.typeform.createForm({
        $,
        data,
      });

    } catch (error) {
      throw new Error(error);
    }
  },
};
