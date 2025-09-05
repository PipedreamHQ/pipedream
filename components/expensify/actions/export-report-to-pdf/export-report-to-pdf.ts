import { defineAction } from "@pipedream/types";
import expensify from "../../app/expensify.app";
import fs from "fs";

export default defineAction({
  key: "expensify-export-report-to-pdf",
  version: "0.0.3",
  name: "Export Report To PDF",
  description: "Export a report to PDF. [See docs here](https://integrations.expensify.com/Integration-Server/doc/#report-exporter)",
  type: "action",
  props: {
    expensify,
    reportId: {
      label: "Report ID",
      description: "The ID of the report to be exported.",
      type: "string",
    },
  },
  async run({ $ }) {
    const fileName = await this.expensify.exportReportToPDF({
      $,
      reportId: this.reportId,
    });

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
