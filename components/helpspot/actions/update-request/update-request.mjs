import helpspot from "../../helpspot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "helpspot-update-request",
  name: "Update Request",
  description: "Updates an existing user request. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=163)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    helpspot,
    xRequestId: {
      propDefinition: [
        helpspot,
        "xRequestId",
      ],
    },
    note: {
      propDefinition: [
        helpspot,
        "note",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      xRequestId: this.xRequestId,
      note: this.note,
    };
    const response = await this.helpspot.updateRequest(params);
    $.export("$summary", `Successfully updated request with ID ${this.xRequestId}`);
    return response;
  },
};
