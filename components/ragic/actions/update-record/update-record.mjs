import ragic from "../../ragic.app.mjs";

const docLink = "https://www.ragic.com/intl/en/doc-api/16/Modifying-an-Entry";

export default {
  key: "ragic-update-record",
  name: "Update Record",
  description: `Updates a record. [See the docs.](${docLink})`,
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ragic,
    tab: {
      propDefinition: [
        ragic,
        "tab",
      ],
    },
    sheet: {
      propDefinition: [
        ragic,
        "sheet",
        (c) => ({
          tab: c.tab,
        }),
      ],
    },
    recordId: {
      propDefinition: [
        ragic,
        "recordId",
        (c) => ({
          tab: c.tab,
          sheet: c.sheet,
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
      tab,
      sheet,
      recordId,
      record,
    } = this;
    const response = await this.ragic.updateRecord({
      tab,
      sheetId: sheet.value,
      recordId,
      record,
    });
    $.export("$summary", "Updated record successfully");
    return response;
  },
};
