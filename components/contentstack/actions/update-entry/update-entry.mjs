import contentstack from "../../contentstack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "contentstack-update-entry",
  name: "Update Entry",
  description: "Updates an existing Contentstack entry. [See the documentation](https://www.contentstack.com/docs/developers/apis/content-management-api#update-an-entry).",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    contentstack,
    stackId: {
      propDefinition: [
        "contentstack",
        "stackId",
      ],
    },
    contentTypeUid: {
      propDefinition: [
        "contentstack",
        "contentTypeUid",
      ],
    },
    entryUid: {
      propDefinition: [
        "contentstack",
        "entryUid",
      ],
    },
    fieldsToUpdate: {
      propDefinition: [
        "contentstack",
        "fieldsToUpdate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentstack.updateEntry({
      data: this.fieldsToUpdate
        ? this.fieldsToUpdate.reduce((acc, field) => {
          const parsedField = JSON.parse(field);
          return {
            ...acc,
            ...parsedField,
          };
        }, {})
        : {},
    });
    $.export("$summary", `Entry ${this.entryUid} updated successfully`);
    return response;
  },
};
