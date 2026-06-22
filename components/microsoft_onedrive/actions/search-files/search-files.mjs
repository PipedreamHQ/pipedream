import httpRequest from "../../common/httpRequest.mjs";
import onedrive from "../../microsoft_onedrive.app.mjs";

export default {
  key: "microsoft_onedrive-search-files",
  name: "Search Files",
  description: "Search for files and folders across a OneDrive drive. Defaults to the authenticated user's personal drive; select a **Drive** to target a different one. Paginates through all result pages. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-search?view=graph-rest-1.0&tabs=http)",
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
    },
    q: {
      type: "string",
      label: "Query",
      description: "The search query text (e.g. `cegesautoflotta.xlsx` or a partial name like `cegesautoflotta`).",
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

    const escapedQ = this.q.replace(/'/g, "''");
    const encodedQ = encodeURIComponent(escapedQ);

    let currentUrl = `${drivePath}/root/search(q='${encodedQ}')`;

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

    let values = allValues;
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
