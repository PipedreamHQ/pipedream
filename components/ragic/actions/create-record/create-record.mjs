import ragic from "../../ragic.app.mjs";

const docLink = "https://www.ragic.com/intl/en/doc-api/15/Creating-a-New-Entry";

export default {
  key: "ragic-create-record",
  name: "Create Record",
  description: `Creates a record. [See the docs.](${docLink})`,
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    sheetId: {
      propDefinition: [
        ragic,
        "sheet",
        (c) => ({
          tab: c.tab,
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
      tab,
      sheetId,
      record,
    } = this;
    const response = await this.ragic.createRecord({
      tab,
      sheetId,
      record,
    });
    $.export("$summary", "Created record successfully");
    return response;
  },
};
