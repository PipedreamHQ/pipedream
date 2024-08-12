import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rentman",
  propDefinitions: {
    itemType: {
      type: "string",
      label: "Item Type",
      description: "The type of item",
      options: [
        "appointment",
        "contact person",
        "contact",
        "costs",
        "availability",
        "payment",
        "equipment rental request",
        "project rental request",
        "stock adjustment",
      ],
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The ID of the item",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file",
    },
    fileContent: {
      type: "string",
      label: "File Content",
      description: "The content of the file",
    },
    appointmentDetails: {
      type: "object",
      label: "Appointment Details",
      description: "Details of the appointment",
      properties: {
        name: {
          type: "string",
          label: "Name",
        },
        start: {
          type: "string",
          label: "Start",
          description: "Start time in ISO format",
        },
        end: {
          type: "string",
          label: "End",
          description: "End time in ISO format",
        },
        color: {
          type: "string",
          label: "Color",
        },
        location: {
          type: "string",
          label: "Location",
        },
        remark: {
          type: "string",
          label: "Remark",
        },
        isPublic: {
          type: "boolean",
          label: "Is Public",
        },
        isPlannable: {
          type: "boolean",
          label: "Is Plannable",
        },
      },
    },
    // Add other item type specific prop definitions here
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.rentman.net";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
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
    async emitFileUploadedUpdated() {
      return this._makeRequest({
        method: "POST",
        path: "/files",
        data: {
          name: this.fileName,
          content: this.fileContent,
        },
      });
    },
    async emitItemCreated({ itemType }) {
      return this._makeRequest({
        method: "POST",
        path: `/items/${itemType}`,
        data: {
          type: itemType,
        },
      });
    },
    async createNewItem(opts = {}) {
      const {
        itemType, ...data
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: `/items/${itemType}`,
        data,
      });
    },
    async updateItemDetails(opts = {}) {
      const {
        itemType, itemId, ...data
      } = opts;
      return this._makeRequest({
        method: "PUT",
        path: `/items/${itemType}/${itemId}`,
        data,
      });
    },
    async searchItem(opts = {}) {
      const {
        itemType, itemId,
      } = opts;
      return this._makeRequest({
        method: "GET",
        path: `/items/${itemType}/${itemId}`,
      });
    },
  },
};
