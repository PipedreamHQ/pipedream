import { defineAction } from "@pipedream/types";
import baserow from "../../app/baserow.app";
import { DOCS_LINK } from "../../common/constants";
import { DeleteRowParams } from "../../common/types";
import common from "../common";

export default defineAction({
  ...common,
  name: "Delete Row",
  description:
    `Delete a row [See docs here](${DOCS_LINK})`,
  key: "baserow-delete-row",
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
  },
  async run({ $ }) {
    const {
      tableId, rowId,
    } = this;

    const params: DeleteRowParams  = {
      $,
      tableId,
      rowId,
    };

    const response = await this.baserow.deleteRow(params);

    $.export("$summary", `Deleted row ${rowId} successfully`);

    return response;
  },
});
