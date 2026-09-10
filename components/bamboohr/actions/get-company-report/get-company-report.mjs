import bamboohr from "../../bamboohr.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bamboohr-get-company-report",
  name: "Get Company Report",
  description: "Get a saved company report by ID (GET /reports/{id}). Report IDs are company-specific. In JSON, returns `{title, fields, employees}`. [See the documentation](https://documentation.bamboohr.com/reference/get-company-report)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    reportId: {
      propDefinition: [
        bamboohr,
        "reportId",
      ],
    },
    format: {
      type: "string",
      label: "Format",
      description: "Output format (case-insensitive). One of `json`, `xml`, `csv`, `xls`, `pdf` (default `json`).",
      options: constants.REPORT_FORMATS,
      optional: true,
    },
    fd: {
      type: "boolean",
      label: "Filter Duplicates",
      description: "Apply duplicate-row filtering.",
      optional: true,
    },
    onlyCurrent: {
      type: "boolean",
      label: "Only Current",
      description: "When true (default), limits to current employees.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.getCompanyReport({
      $,
      reportId: this.reportId,
      params: {
        format: this.format || "json",
        fd: this.fd,
        onlyCurrent: this.onlyCurrent,
      },
    });
    $.export("$summary", `Retrieved report ${this.reportId}`);
    return response;
  },
};
