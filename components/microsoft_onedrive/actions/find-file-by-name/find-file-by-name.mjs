import onedrive from "../../microsoft_onedrive.app.mjs";
import httpRequest from "../../common/httpRequest.mjs";

export default {
  key: "microsoft_onedrive-find-file-by-name",
  name: "Find File by Name",
  description: "Search for a file or folder by name. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_search)",
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
    name: {
      type: "string",
      label: "File Name",
      description: "The name of the file or folder to search for",
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

    const escapedName = this.name.replace(/'/g, "''");
    const encodedName = encodeURIComponent(escapedName);

    const response = await this.httpRequest({
      url: `${drivePath}/search(q='${encodedName}')`,
      useSharedDrive: true,
    });

    let values = response.value.filter(
      ({ name }) => name.toLowerCase().includes(this.name.toLowerCase()),
    );

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
