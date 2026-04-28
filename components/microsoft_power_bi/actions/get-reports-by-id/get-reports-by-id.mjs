import microsoftPowerBi from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-get-reports-by-id",
  name: "Get Report by id",
  description: "Retrieve metadata for a single Power BI report by ID. Uses My workspace by default; set Workspace (Group) ID for a specific workspace. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/get-report)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftPowerBi,
    groupId: {
      type: "string",
      label: "Workspace (Group) ID",
      description: "Workspace group ID (GUID), e.g. `f089354e-8366-4e18-aea3-4cb4a3a50b48`. Omit to target My workspace.",
      optional: true,
      async options() {
        const groups = await this.microsoftPowerBi.listGroups();
        return groups?.map?.(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) ?? [];
      },
    },
    reportId: {
      type: "string",
      label: "Report ID",
      description: "Power BI report ID (GUID), e.g. `2f1f6a59-1b2c-4d84-9d89-4c27f8a3c111`. Set **Workspace (Group) ID** to scope options to one workspace.",
      async options() {
        const reports = await this.microsoftPowerBi.listReports({
          groupId: this.groupId || undefined,
        });
        return reports?.map?.(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) ?? [];
      },
    },
  },
  async run({ $ }) {
    const report = await this.microsoftPowerBi.getReport({
      $,
      reportId: this.reportId,
      groupId: this.groupId,
    });
    $.export("$summary", `Retrieved report "${report.name}" (${report.id})`);
    return report;
  },
};
