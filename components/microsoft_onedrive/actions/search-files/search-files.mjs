import httpRequest from "../../common/httpRequest.mjs";
import onedrive from "../../microsoft_onedrive.app.mjs";
import constants from "../../common/constants.mjs";

const {
  DEFAULT_DRIVE_PATH,
  DRIVES_PATH_PREFIX,
} = constants;

export default {
  key: "microsoft_onedrive-search-files",
  name: "Search Files",
  description: "Search for files and folders across a OneDrive drive. By default searches the authenticated user's personal drive (`/me/drive`). [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-search?view=graph-rest-1.0&tabs=http).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    onedrive,
    q: {
      type: "string",
      label: "Query",
      description: "The search query text (e.g. `cegesautoflotta.xlsx` or a partial name like `cegesautoflotta`).",
    },
    driveId: {
      propDefinition: [
        onedrive,
        "driveId",
      ],
      description: "Optional. The ID of the drive to search. When supplied, the action routes the search through `/drives/{driveId}/root/search(q='...')` (using `useSharedDrive: true`) instead of the default `/me/drive`. Run the **List My Drives** action first to obtain a valid drive ID (e.g. `CA07A40F50E43DD9`). Leave blank to preserve the existing personal-drive search behaviour.",
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
    const drivePath = this.driveId
      ? `${DRIVES_PATH_PREFIX}${this.driveId}/root`
      : DEFAULT_DRIVE_PATH;
    let currentUrl = `${drivePath}/search(q='${encodeURIComponent(this.q)}')`;

    let allValues = [];
    while (currentUrl) {
      const response = await this.httpRequest({
        $,
        url: currentUrl,
        useSharedDrive: !!this.driveId,
      });
      allValues = allValues.concat(response.value ?? []);
      currentUrl = response["@odata.nextLink"] ?? null;
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
