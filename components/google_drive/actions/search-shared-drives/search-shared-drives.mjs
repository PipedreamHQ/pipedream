import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-search-shared-drives",
  name: "Search for Shared Drives",
  description: "Search for shared drives with query options. [See the documentation](https://developers.google.com/drive/api/v3/search-shareddrives) for more information",
  version: "0.1.14",
  type: "action",
  props: {
    googleDrive,
    q: {
      type: "string",
      label: "Search Query",
      description:
        "The [shared drives](https://support.google.com/a/users/answer/9310351) search query. See [query terms](https://developers.google.com/drive/api/v3/ref-search-terms#drive_properties) for a list of shard drive-specific query terms.",
    },
    useDomainAdminAccess: {
      propDefinition: [
        googleDrive,
        "useDomainAdminAccess",
      ],
    },
  },
  async run({ $ }) {
    const drives = (
      await this.googleDrive.searchDrives({
        q: this.q,
        useDomainAdminAccess: this.useDomainAdminAccess,
      })
    ).drives;
    $.export("$summary", `Successfully found ${drives.length} shared drives using the search query "${this.q}"`);
    return drives;
  },
};
