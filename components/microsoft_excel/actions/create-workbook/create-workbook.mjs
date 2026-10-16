import microsoftExcel from "../../microsoft_excel.app.mjs";
import { ROOT_FOLDER_ID } from "../../common/constants.mjs";

export default {
  key: "microsoft_excel-create-workbook",
  name: "Create Workbook",
  description: "Create a new, blank Excel workbook (`.xlsx` file) in OneDrive. The new workbook starts with a single default worksheet named `Sheet1`, ready for subsequent actions (e.g. Create Worksheet, Add Row). [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-post-children?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoftExcel,
    folderId: {
      propDefinition: [
        microsoftExcel,
        "folderId",
      ],
      optional: true,
      description: "The folder to create the workbook in. Defaults to the root of your OneDrive when omitted.",
    },
    name: {
      type: "string",
      label: "Workbook Name",
      description: "The file name for the new workbook. The `.xlsx` extension is appended automatically if you don't include it. If a file with the same name already exists, a number is appended (e.g. `Report 1.xlsx`). E.g. `Q3 Sales Report`",
    },
  },
  async run({ $ }) {
    const name = this.name.toLowerCase().endsWith(".xlsx")
      ? this.name
      : `${this.name}.xlsx`;

    const response = await this.microsoftExcel.createItem({
      $,
      folderId: this.folderId || ROOT_FOLDER_ID,
      data: {
        name,
        file: {},
        ["@microsoft.graph.conflictBehavior"]: "rename",
      },
    });

    $.export("$summary", `Successfully created workbook "${response.name}"`);
    return response;
  },
};
