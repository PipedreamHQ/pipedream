import utils from "../../common/utils.mjs";
import app from "../../grist.app.mjs";

export default {
  key: "grist-add-records",
  name: "Add Records",
  description: "Appends new records to a chosen table in Grist. [See the documentation](https://support.getgrist.com/api/#tag/records/operation/addRecords)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    docId: {
      propDefinition: [
        app,
        "docId",
      ],
    },
    tableId: {
      propDefinition: [
        app,
        "tableId",
        ({ docId }) => ({
          docId,
        }),
      ],
    },
    records: {
      propDefinition: [
        app,
        "records",
      ],
    },
    noParse: {
      propDefinition: [
        app,
        "noParse",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      docId,
      tableId,
      noParse,
      records,
    } = this;

    const response = await app.addRecords({
      $,
      docId,
      tableId,
      params: {
        noparse: noParse,
      },
      data: {
        records: utils.parseArray(records),
      },
    });

    $.export("$summary", `Successfully added \`${response.records.length}\` record(s) to the table.`);
    return response;
  },
};
