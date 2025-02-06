import { parseObject } from "../../common/utils.mjs";
import appsheet from "../../google_appsheet.app.mjs";

export default {
  props: {
    appsheet,
    tableName: {
      propDefinition: [
        appsheet,
        "tableName",
      ],
    },
    row: {
      propDefinition: [
        appsheet,
        "row",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.appsheet.post({
      $,
      tableName: this.tableName,
      data: {
        Action: this.getAction(),
        Rows: [
          parseObject(this.row),
        ],
      },
    });
    $.export("$summary", this.getSummary(response));
    return response;
  },
};
