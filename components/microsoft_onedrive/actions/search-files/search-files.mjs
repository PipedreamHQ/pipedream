import httpRequest from "../../common/httpRequest.mjs";
import onedrive from "../../microsoft_onedrive.app.mjs";

export default {
  key: "microsoft_onedrive-search-files",
  name: "Search Files",
  description: "Search for files and folders in Microsoft OneDrive. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-search)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    onedrive,
    drive: {
      propDefinition: [
        onedrive,
        "drive",
      ],
      description: "The drive to search. Defaults to the connected account's personal OneDrive. To search a different drive, pass that drive's ID here (you can get it from the **List My Drives** action).",
    },
    q: {
      type: "string",
      label: "Search Query",
      description: "The query text used to search for items. Values may be matched across several fields including filename, metadata, and file content",
    },
    excludeFolders: {
      propDefinition: [
        onedrive,
        "excludeFolders",
      ],
    },
  },
  methods: {
    httpRequest,
  },
  async run({ $ }) {
    const drivePath = this.onedrive._getDrivePath(this.drive);

    const escapedQ = this.q.replace(/'/g, "''");
    const encodedQ = encodeURIComponent(escapedQ);

    const response = await this.httpRequest({
      url: `${drivePath}/root/search(q='${encodedQ}')`,
      useSharedDrive: true,
    });

    let values = response.value;

    if (this.excludeFolders) {
      values = values.filter(({ folder }) => !folder);
    }

    const plural = values.length === 1
      ? ""
      : "s";

    const type = this.excludeFolders
      ? `file${plural}`
      : `file${plural} and/or folder${plural}`;

    const scope = this.drive
      ? `drive ${this.drive}`
      : "your personal OneDrive";

    $.export("$summary", `Found ${values.length} matching ${type} in ${scope}`);

    return values;
  },
};
