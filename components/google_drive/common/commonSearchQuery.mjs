import { ConfigurationError } from "@pipedream/platform";
import googleDrive from "../google_drive.app.mjs";

export default {
  methods: {
    getQuery(type, folderId) {
      const {
        searchQuery, nameSearchTerm,
      } = this;
      if (!searchQuery && !nameSearchTerm && !type) {
        throw new ConfigurationError("You must specify a search query or name.");
      }
      let q = type
        ? `mimeType = 'application/vnd.google-apps.${type}'`
        : "";
      if (searchQuery) {
        q = (!q || searchQuery.includes(q))
          ? searchQuery
          : `${q} and ${searchQuery}`;
      } else {
        if (nameSearchTerm) {
          const nameQuery = `name contains '${nameSearchTerm}'`;
          q = q
            ? `${q} and ${nameQuery}`
            : nameQuery;
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
