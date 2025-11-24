import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-list-folders",
  name: "List Folders",
  description: "Retrieves a list of all folders in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-mailfolders)",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftOutlook,
    maxResults: {
      propDefinition: [
        microsoftOutlook,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const items = this.microsoftOutlook.paginate({
      fn: this.microsoftOutlook.listFolders,
      args: {
        $,
      },
      max: this.maxResults,
    });

    const folders = [];
    for await (const item of items) {
      folders.push(item);
    }

    $.export("$summary", `Successfully retrieved ${folders.length} folder${folders.length != 1
      ? "s"
      : ""}.`);
    return folders;
  },
};
