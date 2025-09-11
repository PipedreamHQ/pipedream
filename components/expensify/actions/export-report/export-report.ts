import { defineAction } from "@pipedream/types";
import expensify from "../../app/expensify.app";
import fs from "fs";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import qs from "qs";

export default defineAction({
  key: "expensify-export-report",
  name: "Export Report",
  description: "Export Expensify reports to a file (csv, xls, xlsx, txt, pdf, json, xml). [See the documentation](https://integrations.expensify.com/Integration-Server/doc/#report-exporter)",
  version: "0.0.1",
  type: "action",
  props: {
    expensify,
    reportIds: {
      type: "string[]",
      label: "Report IDs",
      description: "The IDs of the reports to be exported. Required if `startDate` or `approvedAfter` are not specified.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the report. Format: YYYY-MM-DD. Required if `reportIds` or `approvedAfter ` are not specified.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the report. Format: YYYY-MM-DD. Conditionally required, if either `startDate` or `approvedAfter` is more than one year ago.",
      optional: true,
    },
    approvedAfter: {
      type: "string",
      label: "Approved After",
      description: "Filters out all reports approved before the given date, whichever occurred last (inclusive). Required if `reportIds` or `startDate` are not specified",
      optional: true,
    },
    fileExtension: {
      type: "string",
      label: "File Extension",
      description: "Specifies the format of the generated report",
      options: [
        "csv",
        "xls",
        "xlsx",
        "txt",
        "pdf",
        "json",
        "xml",
      ],
    },
    markedAsExported: {
      type: "string",
      label: "Marked as Exported Label (Filter)",
      description: "Filters out reports that have already been exported with that label",
      optional: true,
    },
    reportStates: {
      type: "string[]",
      label: "Report States",
      description: "Only the reports matching the specified status(es) will be exported",
      options: [
        "OPEN",
        "SUBMITTED",
        "APPROVED",
        "REIMBURSED",
        "ARCHIVED",
      ],
      optional: true,
    },
    employeeEmail: {
      type: "string",
      label: "Employee Email",
      description: "Export reports for the specified employee email",
      optional: true,
    },
    policyIds: {
      propDefinition: [
        expensify,
        "policyExportIds",
      ],
    },
    fileBaseName: {
      type: "string",
      label: "File Base Name",
      description: "The base name of the file to be exported",
      optional: true,
    },
    includeFullPageReceiptsPdf: {
      type: "boolean",
      label: "Include Full Page Receipts PDF",
      description: "Specifies whether generated PDFs should include full page receipts. This parameter is used only if fileExtension contains pdf.",
      optional: true,
    },
    emailRecipients: {
      type: "string[]",
      label: "Email Recipients",
      description: "People to email at the end of the export",
      optional: true,
    },
    markAsExported: {
      type: "string",
      label: "Mark as Exported",
      description: "Mark the reports as exported with the given label",
      optional: true,
    },
    templatePath: {
      type: "string",
      label: "Template Path",
      description: "The path in the /tmp directory to the template to use for the export. Required if `fileExtension` is `csv`, `txt`, `json`, or `xml`.",
      optional: true,
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "Maximum number of reports to export",
      optional: true,
    },
    test: {
      type: "boolean",
      label: "Test Mode",
      description: "If set to true, actions defined in `onFinish` (i.e. email, markAsExported) will not be executed",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    if (!this.reportIds && !this.startDate && !this.approvedAfter) {
      throw new ConfigurationError("At least one of `reportIds`, `startDate`, or `approvedAfter` must be specified");
    }

    if ([
      "csv",
      "txt",
      "json",
      "xml",
    ].includes(this.fileExtension) && !this.templatePath) {
      throw new ConfigurationError(`Template path is required for file extension: ${this.fileExtension}`);
    }

    const onFinish = [];
    if (this.emailRecipients) {
      onFinish.push({
        actionName: "email",
        recipients: this.emailRecipients.join(","),
      });
    }

    if (this.markAsExported) {
      onFinish.push({
        actionName: "markAsExported",
        label: this.markAsExported,
      });
    }

    const data = {
      type: "file",
      credentials: {
        partnerUserID: this.expensify._partnerUserId(),
        partnerUserSecret: this.expensify._partnerUserSecret(),
      },
      onReceive: {
        immediateResponse: [
          "returnRandomFileName",
        ],
      },
      inputSettings: {
        type: "combinedReportData",
        filters: {
          reportIDList: this.reportIds
            ? this.reportIds.join(",")
            : undefined,
          startDate: this.startDate,
          endDate: this.endDate,
          approvedAfter: this.approvedAfter,
          markedAsExported: this.markedAsExported,
          policyIDList: this.policyIds
            ? this.policyIds.join(",")
            : undefined,
        },
        reportState: this.reportStates
          ? this.reportStates.join(",")
          : undefined,
        employeeEmail: this.employeeEmail,
        limit: this.limit,
      },
      outputSettings: {
        fileExtension: this.fileExtension,
        fileBasename: this.fileBaseName,
        includeFullPageReceiptsPdf: this.includeFullPageReceiptsPdf,
      },
      onFinish,
      test: this.test,
    };

    let fileName;
    const args = {
      method: "post",
      url: `${this.expensify._apiUrl()}`,
    };

    if (!this.templatePath) {
      fileName = await axios($, {
        ...args,
        data: qs.stringify({
          requestJobDescription: JSON.stringify(data),
          template: "default",
        }),
      });
    } else {
      fileName = await axios($, {
        ...args,
        data: qs.stringify({
          requestJobDescription: JSON.stringify(data),
          template: fs.readFileSync(this.templatePath.includes("tmp/")
            ? this.templatePath
            : `/tmp/${this.templatePath}`, "utf8"),
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    }

    const fileBuffer = await this.expensify.downloadFile({
      $,
      fileName,
    });

    const path = `/tmp/${fileName}`;

    await fs.writeFileSync(path, fileBuffer);

    if (fileBuffer) {
      $.export("$summary", `Successfully exported report in ${path}`);
    }

    return path;
  },
});
