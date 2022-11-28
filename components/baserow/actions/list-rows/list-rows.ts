import { defineAction } from "@pipedream/types";
import { ListRowsParams } from "../../common/types";
import common from "../common";

export default defineAction({
  ...common,
  name: "List Rows",
  description:
    "List a table's rows [See docs here](https://baserow.io/api-docs)",
  key: "baserow-list-rows",
  version: "0.0.1",
  type: "action",
  async run({ $ }) {
    const { tableId } = this;
    const params: ListRowsParams = {
      $,
      tableId,
    };

    const response: object[] = await this.baserow.listRows(params);

    $.export("$summary", `Listed ${response.length} rows successfully`);

    return response;
  },
});
