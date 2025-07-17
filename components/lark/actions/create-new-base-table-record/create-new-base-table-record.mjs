import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import lark from "../../lark.app.mjs";

export default {
  key: "lark-create-new-base-table-record",
  name: "Create New Base Table Record",
  description: "Creates a new record in a Lark base table. [See the documentation](https://open.larksuite.com/document/server-docs/docs/bitable-v1/app-table-record/create)",
  version: "0.0.1",
  type: "action",
  props: {
    lark,
    baseToken: {
      propDefinition: [
        lark,
        "baseToken",
      ],
    },
    tableId: {
      propDefinition: [
        lark,
        "tableId",
        ({ baseToken }) => ({
          baseToken,
        }),
      ],
    },
    fields: {
      propDefinition: [
        lark,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lark.createRecord({
      $,
      baseToken: this.baseToken,
      tableId: this.tableId,
      data: {
        fields: parseObject(this.fields),
      },
    });

    if (response.error) {
      throw new ConfigurationError(response.msg);
    }

    $.export("$summary", `Successfully created a new record in the table with ID ${response.data.record.record_id}`);
    return response;
  },
};
