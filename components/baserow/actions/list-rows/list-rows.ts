import { defineAction } from "@pipedream/types";
import { DOCS_LINK } from "../../common/constants";
import {
  ListRowsParams, Row,
} from "../../common/types";
import common from "../common";

export default defineAction({
  ...common,
  name: "List Rows",
  description:
    `List a table's rows [See docs here](${DOCS_LINK})`,
  key: "baserow-list-rows",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  async run({ $ }) {
    const { tableId } = this;

    const params: ListRowsParams = {
      $,
      tableId,
      params: {
        user_field_names: true,
      },
    };

    const response: Row[] = await this.baserow.listRows(params);

    $.export("$summary", `Listed ${response.length} rows successfully`);

    return response;
  },
});
