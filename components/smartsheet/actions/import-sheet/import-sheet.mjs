import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-import-sheet",
  name: "Import Sheet",
  description:
    "Import a CSV or XLSX file as a new Smartsheet sheet in a workspace or folder."
    + " The file's first row becomes column headers by default (adjust with Header Row Index)."
    + " You must provide either a Workspace ID or Folder ID — the home-level import endpoint is deprecated."
    + " Supported formats: CSV (.csv) and Excel XLSX (.xlsx)."
    + " Use **List Sheets** to verify the sheet was created after import."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/imports/import-sheet-into-workspace)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (e.g., /tmp/data.csv). Supported formats: CSV (.csv) and Excel (.xlsx).",
      format: "file-ref",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
    sheetName: {
      type: "string",
      label: "Sheet Name",
      description: "Name for the imported sheet. Must use ASCII characters.",
    },
    headerRowIndex: {
      type: "integer",
      label: "Header Row Index",
      description: "Zero-based index of the row to use as column headers. Defaults to 0 (first row).",
      optional: true,
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Import into this workspace. Provide either Workspace ID or Folder ID (at least one is required).",
      optional: true,
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Import into this folder. Provide either Workspace ID or Folder ID (at least one is required).",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.workspaceId && !this.folderId) {
      throw new ConfigurationError("Provide either Workspace ID or Folder ID. The home-level import endpoint is deprecated.");
    }
    if (this.workspaceId && this.folderId) {
      throw new ConfigurationError("Provide either Workspace ID or Folder ID, not both.");
    }

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);

    const filename = metadata.name || "import.csv";
    const lower = filename.toLowerCase();
    const xlsxType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    let contentType;
    if (lower.endsWith(".xlsx")) {
      contentType = xlsxType;
    } else if (lower.endsWith(".csv")) {
      contentType = "text/csv";
    } else if (metadata.contentType === xlsxType || metadata.contentType === "application/vnd.ms-excel") {
      contentType = xlsxType;
    } else {
      // URLs without a file extension often serve CSV with a non-CSV Content-Type
      // (e.g., text/html, text/plain). Default to CSV.
      contentType = "text/csv";
    }

    const params = {
      sheetName: this.sheetName,
      ...(this.headerRowIndex !== undefined
        ? {
          headerRowIndex: this.headerRowIndex,
        }
        : {}),
    };

    const requestArgs = {
      $,
      data: stream,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      },
      params,
    };
    const response = await (this.workspaceId
      ? this.smartsheet.importSheetInWorkspace(this.workspaceId, requestArgs)
      : this.smartsheet.importSheetInFolder(this.folderId, requestArgs));

    $.export("$summary", `Imported sheet "${response.result?.name}" (ID: ${response.result?.id})`);
    return response;
  },
};
