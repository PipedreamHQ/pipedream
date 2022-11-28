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
  props: {
    ...common.props,
    userFieldNames: {
      label: "User Field Names",
      description:
        "If **true**, field names returned will be the actual names of the fields. Otherwise, all returned field names will be `field_` followed by the id of the field. For example `field_1` refers to the field with an id of 1.",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const { tableId } = this;
    const params: ListRowsParams = {
      $,
      tableId,
      params: {
        ...(this.userFieldNames ? { userFieldNames: true } : undefined),
      },
    };

    const response: object[] = await this.baserow.listRows(params);

    $.export("$summary", `Listed ${response.length} rows successfully`);

    return response;
  },
});
