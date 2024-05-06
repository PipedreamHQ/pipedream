import googleDrive from "../../google_drive.app.mjs";

export default {
  methods: {
    getQuery(type, folderId) {
      let q = type
        ? `mimeType = 'application/vnd.google-apps.${type}'`
        : "";
      if (this.searchQuery) {
        q = (!q || this.searchQuery.includes(q))
          ? this.searchQuery
          : `${q} and ${this.searchQuery}`;
      } else {
        if (this.nameSearchTerm) {
          q = q
            ? `${q} and name contains '${this.nameSearchTerm}'`
            : this.nameSearchTerm;
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
    },
  },
};
