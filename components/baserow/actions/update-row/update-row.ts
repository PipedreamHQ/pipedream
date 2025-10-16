import { defineAction } from "@pipedream/types";
import baserow from "../../app/baserow.app";
import { DOCS_LINK } from "../../common/constants";
import {
  UpdateRowParams, Row,
} from "../../common/types";
import common from "../common";

export default defineAction({
  ...common,
  name: "Update Row",
  description: `Update a row [See docs here](${DOCS_LINK})`,
  key: "baserow-update-row",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    rowId: {
      propDefinition: [
        baserow,
        "rowId",
      ],
    },
    rowData: {
      propDefinition: [
        baserow,
        "rowData",
      ],
    },
  },
  async run({ $ }) {
    const {
      rowData, rowId, tableId,
    } = this;

    const params: UpdateRowParams = {
      $,
      rowId,
      tableId,
      params: {
        user_field_names: true,
      },
      data: rowData,
    };

    const response: Row = await this.baserow.updateRow(params);

    $.export("$summary", `Updated row ${response.id} successfully`);

    return response;
  },
});
