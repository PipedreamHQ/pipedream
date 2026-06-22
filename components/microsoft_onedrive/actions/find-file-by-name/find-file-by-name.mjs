import onedrive from "../../microsoft_onedrive.app.mjs";
import httpRequest from "../../common/httpRequest.mjs";

export default {
  key: "microsoft_onedrive-find-file-by-name",
  name: "Find File by Name",
  description: "Find a file or folder by a case-insensitive name match across a OneDrive drive. Defaults to the authenticated user's personal drive; select a **Drive** to target a different one. Paginates through all result pages before matching. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-search?view=graph-rest-1.0&tabs=http)",
  version: "0.1.0",
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
    },
    name: {
      type: "string",
      label: "File Name",
      description: "The file name (or partial name) to match. Matching is case-insensitive and applied across all paginated results (e.g. `cegesautoflotta.xlsx`).",
    },
    excludeFolders: {
      propDefinition: [
        onedrive,
        "excludeFolders",
      ],
      description: "When `true`, folder items are excluded from the results and only files are returned.",
    },
  },
  methods: {
    httpRequest,
  },
  async run({ $ }) {
    const drivePath = this.onedrive._getDrivePath(this.drive);

    const escapedName = this.name.replace(/'/g, "''");
    const encodedName = encodeURIComponent(escapedName);

    let currentUrl = `${drivePath}/search(q='${encodedName}')`;

    let allValues = [];
    while (currentUrl) {
      const response = await this.httpRequest({
        $,
        url: currentUrl,
        useSharedDrive: true,
      });
      allValues = allValues.concat(response.value ?? []);
      currentUrl = response["@odata.nextLink"];
    }

    let values = allValues.filter(
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

    $.export("$summary", `Found ${values.length} matching ${type}`);

    return values;
  },
};
