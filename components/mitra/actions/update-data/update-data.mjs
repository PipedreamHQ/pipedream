import app from "../../mitra.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "mitra-update-data",
  name: "Update Data",
  description: "Updates one or more records in a table.",
  version: "0.0.1",
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
    updateData({
      tableName, ...args
    } = {}) {
      return this.app.put({
        tableName,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateData,
      tableName,
      records,
    } = this;

    const response = await updateData({
      $,
      tableName,
      data: utils.parseArray(records),
    });

    $.export("$summary", "Successfully updated records into the Mitra database.");
    return response;
  },
};
