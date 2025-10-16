import { defineAction } from "@pipedream/types";
import baserow from "../../app/baserow.app";
import { DOCS_LINK } from "../../common/constants";
import {
  CreateRowParams, Row,
} from "../../common/types";
import common from "../common";

export default defineAction({
  ...common,
  name: "Create Row",
  description: `Create a row [See docs here](${DOCS_LINK})`,
  key: "baserow-create-row",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    rowData: {
      propDefinition: [
        baserow,
        "rowData",
      ],
    },
  },
  async run({ $ }) {
    const {
      rowData, tableId,
    } = this;

    const params: CreateRowParams = {
      $,
      tableId,
      params: {
        user_field_names: true,
      },
      data: rowData,
    };

    const response: Row = await this.baserow.createRow(params);

    $.export("$summary", `Created row ${response.id} successfully`);

    return response;
  },
});
