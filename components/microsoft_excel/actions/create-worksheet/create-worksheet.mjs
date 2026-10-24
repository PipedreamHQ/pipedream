import microsoftExcel from "../../microsoft_excel.app.mjs";
import { ROOT_FOLDER_ID } from "../../common/constants.mjs";

export default {
  key: "microsoft_excel-create-worksheet",
  name: "Create Worksheet",
  description: "Add a new worksheet (tab) to an existing Excel workbook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/worksheetcollection-add?view=graph-rest-1.0&tabs=http)",
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
      description: "Optional. Only narrows the **Workbook** list below to one folder — it is NOT needed to add the worksheet. If you already have the workbook's item ID (e.g. from **Create Workbook**), skip this and pass it directly as **Workbook**. Use **List Folder ID Options** to find a folder ID (the `value` field). E.g. `01BYE5RZ6QN3ZWBTRWFNG2FOD7ONP4JLHU`",
    },
    sheetId: {
      propDefinition: [
        microsoftExcel,
        "sheetId",
        ({ folderId }) => ({
          folderId: folderId || ROOT_FOLDER_ID,
        }),
      ],
      label: "Workbook",
      description: "The workbook to add the worksheet to — its OneDrive drive-item ID. Pass an ID you already have (e.g. the `id` returned by **Create Workbook**); no folder needed. E.g. `01BYE5RZ6QN3ZWBTRWFNG2FOD7ONP4JLHU`",
    },
    name: {
      type: "string",
      label: "Worksheet Name",
      description: "The name for the new worksheet (tab). Must be unique within the workbook and 31 characters or fewer. If omitted, Excel assigns a default name (e.g. `Sheet2`). E.g. `Q3 Results`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.microsoftExcel.addWorksheet({
      $,
      sheetId: this.sheetId,
      data: this.name
        ? {
          name: this.name,
        }
        : {},
    });

    $.export("$summary", `Successfully created worksheet "${response.name}"`);
    return response;
  },
};
