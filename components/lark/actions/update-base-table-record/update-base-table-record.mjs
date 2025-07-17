import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import lark from "../../lark.app.mjs";

export default {
  key: "lark-update-base-table-record",
  name: "Update Base Table Record",
  description: "Update an existing record in a base table. [See the documentation](https://open.larksuite.com/document/server-docs/docs/bitable-v1/app-table-record/update)",
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
    recordId: {
      propDefinition: [
        lark,
        "recordId",
        ({
          baseToken,
          tableId,
        }) => ({
          baseToken,
          tableId,
        }),
      ],
    },
    fields: {
      propDefinition: [
        lark,
        "fields",
      ],
      description: "The fields to update the record with.",
    },
  },
  async run({ $ }) {
    const response = await this.lark.updateRecord({
      $,
      baseToken: this.baseToken,
      tableId: this.tableId,
      recordId: this.recordId,
      data: {
        fields: parseObject(this.fields),
      },
    });

    if (response.error) {
      throw new ConfigurationError(response.msg);
    }

    $.export("$summary", `Successfully updated record with ID ${this.recordId}`);
    return response;
  },
};
