import voluum from "../../voluum.app.mjs";

export default {
  key: "voluum-list-shared-reports",
  name: "List Shared Reports",
  description: "Retrieves a list of shared reports. [See the API documentation](https://developers.voluum.com/#!/Shared32reports/get_shared_report)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    voluum,
  },
  async run({ $ }) {
    const { sharedReports } = await this.voluum.listSharedReports({
      $,
    });

    $.export("$summary", `Successfully retrieved ${sharedReports.length} shared report${sharedReports.length === 1
      ? ""
      : "s"}.`);
    return sharedReports;
  },
};
