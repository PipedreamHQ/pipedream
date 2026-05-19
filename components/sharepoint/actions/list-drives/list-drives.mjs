import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-list-drives",
  name: "List Drives",
  description: "List the drives available within a Microsoft Sharepoint site. [See the documentation](https://learn.microsoft.com/en-us/graph/api/drive-list?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    select: {
      propDefinition: [
        sharepoint,
        "select",
      ],
    },
    maxResults: {
      propDefinition: [
        sharepoint,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const drives = [];
    let count = 0;

    const results = this.sharepoint.paginate({
      fn: this.sharepoint.listSiteDrives,
      args: {
        $,
        siteId: this.siteId,
        params: {
          select: this.select,
        },
      },
    });

    for await (const drive of results) {
      drives.push(drive);
      count++;
      if (this.maxResults && count >= this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully listed ${count} drive${count === 1
      ? ""
      : "s"}`);

    return drives;
  },
};
