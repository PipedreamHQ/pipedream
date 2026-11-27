import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-list-drive-id-options",
  name: "List Drive ID Options",
  description: "List the SharePoint document libraries the connected account can use as the **Drive ID** in other Microsoft Excel actions, one per library of each site the account follows. Returns `{ label, value }` pairs, where `label` is `Site / Library` and `value` is the drive ID. Use it when a workbook is stored in a SharePoint site rather than your own OneDrive. Returns an empty list when the account cannot list sites (this needs the `Sites.Read.All` permission); the drive ID can then be entered by hand. [See the documentation](https://learn.microsoft.com/en-us/graph/api/drive-list?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftExcel,
  },
  async run({ $ }) {
    const options = await this.microsoftExcel.listDriveOptions();
    $.export("$summary", `Successfully retrieved ${options.length} drive${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
