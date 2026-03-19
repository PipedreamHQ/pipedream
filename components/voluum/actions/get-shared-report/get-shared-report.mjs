import voluum from "../../voluum.app.mjs";

export default {
  key: "voluum-get-shared-report",
  name: "Get Shared Report",
  description: "Retrieves a shared report. [See the API documentation](https://developers.voluum.com/#!/Shared32reports/get_shared_report_id)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    voluum,
    sharedReportId: {
      propDefinition: [
        voluum,
        "sharedReportId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.voluum.getSharedReport({
      $,
      sharedReportId: this.sharedReportId,
    });

    $.export("$summary", `Successfully retrieved shared report with ID ${response.id}`);
    return response;
  },
};
