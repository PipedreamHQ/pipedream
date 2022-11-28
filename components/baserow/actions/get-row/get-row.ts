import { defineAction } from "@pipedream/types";
import baserow from "../../app/baserow";
import { DOCS_LINK } from "../../common/constants";
import { Row } from "../../common/types";
import common from "../common";

export default defineAction({
  ...common,
  name: "Get Row",
  description:
    `Get a single row [See docs here](${DOCS_LINK})`,
  key: "baserow-get-row",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    rowId: {
      propDefinition: [
        baserow,
        "rowId",
      ],
    },
    userFieldNames: {
      propDefinition: [
        baserow,
        "userFieldNames",
      ],
    },
  },
  async run({ $ }) {
    const {
      tableId, rowId,
    } = this;
    const params  = {
      $,
      tableId,
      rowId,
      params: {
        ...(this.userFieldNames
          ? {
            user_field_names: true,
          }
          : undefined),
      },
    };

    const response: Row = await this.baserow.getRow(params);

    $.export("$summary", `Obtained info for row ${rowId} successfully`);

    return response;
  },
});
