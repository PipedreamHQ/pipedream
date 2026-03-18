import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-list-folders",
  name: "List Folders",
  description: "Retrieves a list of all folders in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-mailfolders)",
  version: "0.0.19",
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
    includeSubfolders: {
      type: "boolean",
      label: "Include Subfolders",
      description: "If `true`, the list of folders will include subfolders",
      optional: true,
      default: false,
    },
    includeHiddenFolders: {
      type: "boolean",
      label: "Include Hidden Folders",
      description: "If `true`, the list of folders will include hidden folders",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    let folders = [];
    if (this.includeSubfolders) {
      folders = await this.microsoftOutlook.listAllFolders({
        params: {
          $top: this.maxResults,
          includeHiddenFolders: this.includeHiddenFolders,
        },
      });
      if (folders.length > this.maxResults) {
        folders = folders.slice(0, this.maxResults);
      }
    } else {
      const items = this.microsoftOutlook.paginate({
        fn: this.microsoftOutlook.listFolders,
        args: {
          $,
          params: {
            includeHiddenFolders: this.includeHiddenFolders,
          },
        },
        max: this.maxResults,
      });
      for await (const item of items) {
        folders.push(item);
      }
    }

    $.export("$summary", `Successfully retrieved ${folders.length} folder${folders.length != 1
      ? "s"
      : ""}.`);
    return folders;
  },
};
