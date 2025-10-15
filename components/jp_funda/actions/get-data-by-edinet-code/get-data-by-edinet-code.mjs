import jpFunda from "../../jp_funda.app.mjs";

export default {
  key: "jp_funda-get-data-by-edinet-code",
  name: "Get Data By EDINET Code",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Returns the most recent and annual securities report data for the past few years. [See the documentation](https://www.jp-funda.com/docs/#edinet%E3%82%B3%E3%83%BC%E3%83%89%E3%81%A7%E3%83%87%E3%83%BC%E3%82%BF%E5%8F%96%E5%BE%97-edinet%E3%82%B3%E3%83%BC%E3%83%89%E3%81%A7%E5%85%A8%E3%81%A6%E3%81%AE%E6%9C%89%E4%BE%A1%E8%A8%BC%E5%88%B8%E5%A0%B1%E5%91%8A%E6%9B%B8%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E5%8F%96%E5%BE%97-get)",
  type: "action",
  props: {
    jpFunda,
    edinetCode: {
      type: "string",
      label: "EDINET Code",
      description: "Enter the EDINET code.",
    },
  },
  async run({ $ }) {
    const {
      jpFunda,
      edinetCode,
    } = this;

    const response = await jpFunda.getDataByEdinetCode({
      $,
      edinetCode,
    });

    $.export("$summary", `The data of the EDINET code ${edinetCode} were successfully fetched!`);
    return response;
  },
};
