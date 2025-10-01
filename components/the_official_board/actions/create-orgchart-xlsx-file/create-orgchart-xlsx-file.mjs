import fs from "fs";
import app from "../../the_official_board.app.mjs";

export default {
  key: "the_official_board-create-orgchart-xlsx-file",
  name: "Create Orgchart XLSX File",
  description: "Export organization chart as XLSX file. [See the documentation](https://rest.theofficialboard.com/rest/api/doc/#/Companies/get_export_orgchart_excel)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
      description: "The ID of the company to export orgchart for",
    },
    filename: {
      type: "string",
      label: "Target Filename",
      description: "The filename that will be used to save in /tmp",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.exportOrgchartExcel({
      $,
      params: {
        id: this.companyId,
      },
    });

    const filePath = `/tmp/${this.filename}`;
    fs.writeFileSync(filePath, response);

    $.export("$summary", `Successfully exported orgchart for company with ID ${this.companyId}`);

    return {
      filename: this.filename,
      filePath,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  },
};
