import { setTimeout as sleep } from "timers/promises";
import app from "../../microsoft_power_bi.app.mjs";

const TERMINAL_STATUSES = new Set([
  "Succeeded",
  "Failed",
]);

export default {
  key: "microsoft_power_bi-export-report",
  name: "Export Report",
  description: "Export a Power BI report to a file format such as PDF, PPTX, or PNG. Requires a report ID (use **List Reports** to find it) and defaults to PDF if no format is given."
    + " Pass `workspaceId` (from **List Workspaces**) or `workspaceName` to target a specific workspace, or omit both for My workspace."
    + " Supported `format` values depend on the report type:"
    + " Power BI reports support `PDF`, `PPTX`, `PNG`."
    + " Paginated reports additionally support `CSV`, `XLSX`, `DOCX`, `XML`, `MHTML`."
    + " This API is **Premium-only**: requires the workspace to be backed by Premium capacity, Premium Per User, or Embedded capacity. On shared (free) capacity it returns `FixedCapacityLimitExceeded` / 403."
    + " The export is asynchronous — this tool starts the export, then polls until the job reaches `Succeeded` or `Failed` (or `pollTimeoutSeconds` elapses), then downloads the file and returns it as base64 along with the job metadata."
    + " PNG exports only work for single-page reports. For PPTX/PDF, pass `pages` (array of page names, e.g., `[\"ReportSection\", \"ReportSection1\"]`) to limit the export."
    + " [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/export-to-file-in-group)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    reportId: {
      type: "string",
      label: "Report ID",
      description: "ID of the report to export. Use **List Reports** to find IDs by name.",
    },
    format: {
      type: "string",
      label: "Format",
      description: "Output file format. Defaults to `PDF`. `PDF`/`PPTX`/`PNG` work for Power BI reports (PNG is single-page only). `CSV`/`XLSX`/`DOCX`/`XML`/`MHTML` are only supported for paginated reports.",
      options: [
        "PDF",
        "PPTX",
        "PNG",
        "CSV",
        "XLSX",
        "DOCX",
        "XML",
        "MHTML",
      ],
      optional: true,
      default: "PDF",
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
    workspaceName: {
      propDefinition: [
        app,
        "workspaceName",
      ],
    },
    pages: {
      type: "string[]",
      label: "Pages",
      description: "Optional list of page names to include in the export. Page names are from the report's internal section IDs (e.g., `ReportSection1`), not visible page titles. If omitted, all pages are exported.",
      optional: true,
    },
    pollIntervalSeconds: {
      type: "integer",
      label: "Poll Interval (seconds)",
      description: "How often to poll the export job status. Minimum 1.",
      optional: true,
      default: 5,
    },
    pollTimeoutSeconds: {
      type: "integer",
      label: "Poll Timeout (seconds)",
      description: "Maximum time to wait for the export to complete before returning the in-progress job metadata. Default 300s.",
      optional: true,
      default: 300,
    },
  },
  async run({ $ }) {
    const groupId = await this.app.resolveGroupId({
      $,
      workspaceId: this.workspaceId,
      workspaceName: this.workspaceName,
    });

    const format = this.format ?? "PDF";
    const exportRequest = {
      format,
    };
    if (this.pages?.length) {
      exportRequest.powerBIReportConfiguration = {
        pages: this.pages.map((name) => ({
          pageName: name,
        })),
      };
    }

    const startResponse = await this.app.startReportExport({
      $,
      reportId: this.reportId,
      groupId,
      data: exportRequest,
    });
    const exportId = startResponse.id;

    const pollInterval = Math.max(1, this.pollIntervalSeconds ?? 5) * 1000;
    const timeoutMs = Math.max(pollInterval, (this.pollTimeoutSeconds ?? 300) * 1000);
    const deadline = Date.now() + timeoutMs;

    let status = startResponse;
    while (!TERMINAL_STATUSES.has(status.status) && Date.now() < deadline) {
      await sleep(pollInterval);
      status = await this.app.getReportExportStatus({
        $,
        reportId: this.reportId,
        exportId,
        groupId,
      });
    }

    if (status.status !== "Succeeded") {
      const summary = TERMINAL_STATUSES.has(status.status)
        ? `Report export ${exportId} finished with status ${status.status}`
        : `Report export ${exportId} polling timed out at status ${status.status}`;
      $.export("$summary", summary);
      return {
        exportId,
        status: status.status,
        percentComplete: status.percentComplete,
        error: status.error,
        reportId: this.reportId,
      };
    }

    const fileResponse = await this.app.getReportExportFile({
      $,
      reportId: this.reportId,
      exportId,
      groupId,
    });
    const fileBuffer = Buffer.isBuffer(fileResponse.data)
      ? fileResponse.data
      : Buffer.from(fileResponse.data);
    const base64 = fileBuffer.toString("base64");

    $.export("$summary", `Exported report ${this.reportId} to ${format} (${fileBuffer.length} bytes)`);
    return {
      exportId,
      status: "Succeeded",
      reportId: this.reportId,
      format,
      resourceFileExtension: status.resourceFileExtension,
      resourceLocation: status.resourceLocation,
      fileSizeBytes: fileBuffer.length,
      fileBase64: base64,
    };
  },
};
