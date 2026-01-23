import httpRequest from "../../common/httpRequest.mjs";
import onedrive from "../../microsoft_onedrive.app.mjs";

export default {
  key: "microsoft_onedrive-search-files",
  name: "Search Files",
  description: "Search for files and folders in Microsoft OneDrive. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-search)",
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
    const response = await this.httpRequest({
      url: `/root/search(q='${this.q}')`,
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
    $.export("$summary", `Found ${values.length} matching ${type}`);
    return values;
  },
};
