import utils from "../../common/utils.mjs";
import app from "../../mitra.app.mjs";

export default {
  key: "mitra-insert-data",
  name: "Insert Data",
  description: "Inserts one or more records into a table in the Mitra database.",
  version: "0.0.7",
  type: "action",
  props: {
    app,
    tableName: {
      propDefinition: [
        app,
        "tableName",
      ],
    },
    records: {
      propDefinition: [
        app,
        "records",
      ],
    },
  },
  methods: {
    insertData({
      tableName, ...args
    } = {}) {
      return this.app.post({
        tableName,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      insertData,
      tableName,
      records,
    } = this;

    const response = await insertData({
      $,
      tableName,
      data: utils.parseArray(records),
    });

    $.export("$summary", "Successfully inserted records into the Mitra database.");
    return response;
  },
};
