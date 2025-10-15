import jpFunda from "../../jp_funda.app.mjs";

export default {
  key: "jp_funda-get-data-by-security-code",
  name: "Get Data By Security Code",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Returns the latest and past years of securities report data. [See the documentation](https://www.jp-funda.com/docs/#%E8%A8%BC%E5%88%B8%E3%82%B3%E3%83%BC%E3%83%89%E3%81%A7%E3%83%87%E3%83%BC%E3%82%BF%E5%8F%96%E5%BE%97)",
  type: "action",
  props: {
    jpFunda,
    securityCode: {
      type: "string",
      label: "Security Code",
      description: "Enter the security code.",
    },
  },
  async run({ $ }) {
    const {
      jpFunda,
      securityCode,
    } = this;

    const response = await jpFunda.getDataBySecurityCode({
      $,
      securityCode,
    });

    $.export("$summary", `The data of the security code ${securityCode} were successfully fetched!`);
    return response;
  },
};
