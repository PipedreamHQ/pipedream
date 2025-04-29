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
  methods: {
    getData() {
      return {};
    },
  },
  async run({ $ }) {
    const dataRow = parseObject(this.row);
    const rows = dataRow
      ? [
        dataRow,
      ]
      : [];

    const response = await this.appsheet.post({
      $,
      tableName: this.tableName,
      data: {
        Action: this.getAction(),
        Rows: rows,
        ...this.getData(),
      },
    });
    console.log("response: ", response);

    $.export("$summary", this.getSummary(response));
    return response;
  },
};
