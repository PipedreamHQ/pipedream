import ragic from "../../ragic.app.mjs";

const docLink = "https://www.ragic.com/intl/en/doc-api/16/Modifying-an-Entry";

export default {
  key: "ragic-update-record",
  name: "Update Record",
  description: `Updates a record. [See the docs.](${docLink})`,
  version: "0.0.1",
  type: "action",
  props: {
    ragic,
    category: {
      propDefinition: [
        ragic,
        "category",
      ],
    },
    recordId: {
      propDefinition: [
        ragic,
        "recordId",
        (c) => ({
          category: c.category,
        }),
      ],
    },
    record: {
      propDefinition: [
        ragic,
        "record",
      ],
      description: `The record data. [More information here.](${docLink})`,
    },
  },
  async run({ $ }) {
    const {
      category,
      recordId,
      record,
    } = this;
    const response = await this.ragic.updateRecord({
      categoryId: category.value,
      recordId,
      record,
    });
    $.export("$summary", "Updated record successfully");
    return response;
  },
};
