import omit from "lodash.omit";
import typeform from "../../typeform.app.mjs";

export default {
  key: "typeform-duplicate-form",
  name: "Duplicate a Form",
  description: "Duplicates an existing form in your Typeform account and adds \"(copy)\" to the end of the title. [See the docs here](https://developer.typeform.com/create/reference/create-form/)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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

    const resp = await this.typeform.createForm({
      $,
      data,
    });

    $.export("$summary", `Successully created a duplicate form titled, "${resp.title}"`);

    return resp;
  },
};
