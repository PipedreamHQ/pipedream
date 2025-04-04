import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-list-folders",
  name: "List Folders",
  description: "Retrieves a list of all folders in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-mailfolders)",
  version: "0.0.2",
  type: "action",
  props: {
    microsoftOutlook,
  },
  async run({ $ }) {
    const { value } = await this.microsoftOutlook.listFolders({
      $,
    });
    $.export("$summary", `Successfully retrieved ${value.length} folder${value.length != 1
      ? "s"
      : ""}.`);
    return value;
  },
};
