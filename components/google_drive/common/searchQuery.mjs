import googleDrive from "../../google_drive.app.mjs";

export default {
  methods: {
    getQuery(type, folderId) {
      let q = `mimeType = 'application/vnd.google-apps.${type}'`;
      if (this.searchQuery) {
        q = this.searchQuery.includes(q)
          ? this.searchQuery
          : `${q} and ${this.searchQuery}`;
      } else {
        if (this.nameSearchTerm) {
          q = `${q} and name contains '${this.nameSearchTerm}'`;
        }
        if (folderId) {
          q = `${q} and "${folderId}" in parents`;
        }
      }
      return q.trim();
    },
  },
  props: {
    nameSearchTerm: {
      propDefinition: [
        googleDrive,
        "fileNameSearchTerm",
      ],
    },
    searchQuery: {
      propDefinition: [
        googleDrive,
        "searchQuery",
      ],
      description:
        "Search for a file with a query. [See the documentation](https://developers.google.com/drive/api/guides/ref-search-terms) for more information. If specified, `Search Name` and `Parent Folder` will be ignored.",
    },
  },
};
