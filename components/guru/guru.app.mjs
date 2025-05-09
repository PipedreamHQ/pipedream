import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "guru",
  propDefinitions: {
    cardTitle: {
      type: "string",
      label: "Card Title",
      description: "The title of the card to create",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the card to create",
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The group ID for ownership of the card",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID for ownership of the card",
      optional: true,
    },
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The ID of the card",
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The ID of the tag",
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder to export to PDF",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getguru.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createCard({
      cardTitle, content, groupId, userId, ...opts
    }) {
      const data = {
        content,
        title: cardTitle,
      };
      if (groupId) data.groupId = groupId;
      if (userId) data.userId = userId;

      return this._makeRequest({
        method: "POST",
        path: "/cards/extended",
        data,
        ...opts,
      });
    },
    async linkTagToCard({
      cardId, tagId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/cards/${cardId}/tags/${tagId}`,
        ...opts,
      });
    },
    async exportFolderToPdf({
      folderId, ...opts
    }) {
      const response = await this._makeRequest({
        path: `/folders/${folderId}/pdf`,
        responseType: "arraybuffer",
        ...opts,
      });
      const filePath = `/tmp/folder-${folderId}.pdf`;
      require("fs").writeFileSync(filePath, response);
      return filePath;
    },
    async emitAlertReadEvent(alertId, ...opts) {
      const eventType = "alert-read";
      // Emit the alert-read event logic here
      return this._makeRequest({
        path: `/alerts/${alertId}/read`,
        method: "POST",
        ...opts,
      });
    },
    async emitCardCreatedEvent(cardId, ...opts) {
      const eventType = "card-created";
      // Emit the card-created event logic here
      return this._makeRequest({
        path: `/cards/${cardId}`,
        method: "GET",
        ...opts,
      });
    },
    async emitCardUpdatedEvent(cardId, ...opts) {
      const eventType = "card-updated";
      // Emit the card-updated event logic here
      return this._makeRequest({
        path: `/cards/${cardId}`,
        method: "PATCH",
        ...opts,
      });
    },
  },
};
