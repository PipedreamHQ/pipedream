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
    sheet: {
      propDefinition: [
        ragic,
        "sheet",
      ],
    },
    category: {
      propDefinition: [
        ragic,
        "category",
        (c) => ({
          sheet: c.sheet,
        }),
      ],
    },
    recordId: {
      propDefinition: [
        ragic,
        "recordId",
        (c) => ({
          sheet: c.sheet,
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
      sheet,
      category,
      recordId,
      record,
    } = this;
    const response = await this.ragic.updateRecord({
      sheet,
      categoryId: category.value,
      recordId,
      record,
    });
    $.export("$summary", "Updated record successfully");
    return response;
  },
};
