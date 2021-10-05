/* eslint-disable no-unused-vars */
import common from "../common.mjs";

export default {
  ...common,
  key: "typeform-duplicate-form",
  name: "Duplicate a Form",
  description: "Duplicates an existing form in your Typeform account with a different `title`. [See the docs here](https://developer.typeform.com/create/reference/create-form/)",
  type: "action",
  version: "0.0.1",
  async run({ $ }) {
    const formResponse =
      await this.typeform.getForm({
        $,
        formId: this.formId,
      });

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

    return await this.typeform.createForm({
      $,
      data,
    });
  },
};
