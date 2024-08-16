import onedrive from "../../microsoft_onedrive.app.mjs";
import httpRequest from "../../common/httpRequest.mjs";

export default {
  key: "microsoft_onedrive-find-file-by-name",
  name: "Find File by Name",
  description: "Search for a file or folder by name. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_search)",
  version: "0.0.1",
  type: "action",
  props: {
    onedrive,
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
    const response = await this.httpRequest({
      url: `/search(q='${this.name}')`,
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
    $.export("$summary", `Found ${values.length} matching ${type}`);
    return values;
  },
};
