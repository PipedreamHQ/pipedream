import ragic from "../../ragic.app.mjs";

const docLink = "https://www.ragic.com/intl/en/doc-api/15/Creating-a-New-Entry";

export default {
  key: "ragic-create-record",
  name: "Create Record",
  description: `Creates a record. [See the docs.](${docLink})`,
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
    categoryId: {
      propDefinition: [
        ragic,
        "category",
        (c) => ({
          sheet: c.sheet,
        }),
      ],
      withLabel: false,
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
      categoryId,
      record,
    } = this;
    const response = await this.ragic.createRecord({
      sheet,
      categoryId,
      record,
    });
    $.export("$summary", "Created record successfully");
    return response;
  },
};
