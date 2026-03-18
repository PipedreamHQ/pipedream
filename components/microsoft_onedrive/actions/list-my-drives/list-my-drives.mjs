import onedrive from "../../microsoft_onedrive.app.mjs";

export default {
  key: "microsoft_onedrive-list-my-drives",
  name: "List My Drives",
  description: "Get the signed-in user's drives. Returns a list of all the drives the user has access to, including the personal OneDrive. [See the documentation](https://learn.microsoft.com/en-us/graph/api/drive-list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    onedrive,
  },
  async run({ $ }) {
    const drives = await this.onedrive.listMyDrives();

    const count = drives.length;
    $.export(
      "$summary",
      `Successfully retrieved ${count} drive${count === 1
        ? ""
        : "s"}`,
    );

    return drives;
  },
};
