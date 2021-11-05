import omit from "lodash.omit";
import common from "../common.mjs";

const { typeform } = common.props;

export default {
  ...common,
  key: "typeform-duplicate-form",
  name: "Duplicate a Form",
  description: "Duplicates an existing form in your Typeform account with a different `title`. [See the docs here](https://developer.typeform.com/create/reference/create-form/)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
  },
  async run({ $ }) {
    const formResponse =
      await this.typeform.getForm({
        $,
        formId: this.formId,
      });

    const otherData = omit(formResponse, [
      "id",
      "_links",
      "title",
    ]);

    const dataStr = JSON.stringify(otherData);
    const idFields = /"id":"\w+",?/g;
    const dataWithoutIdsStr = dataStr.replace(idFields, "");
    const dataWithoutIds = JSON.parse(dataWithoutIdsStr);

    const data = {
      title: `${formResponse.title} (copy)`,
      ...dataWithoutIds,
    };

    return await this.typeform.createForm({
      $,
      data,
    });
  },
};
