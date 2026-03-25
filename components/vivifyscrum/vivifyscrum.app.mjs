import { axios } from "@pipedream/platform";
import { ITEM_TYPES } from "./common/constants.mjs";

export default {
  type: "app",
  app: "vivifyscrum",
  propDefinitions: {
    boardCode: {
      type: "string",
      label: "Board Code",
      description: "The VivifyScrum board code. Find it in board settings.",
    },
    itemType: {
      type: "string",
      label: "Item Type",
      description: "The type of the board item",
      options: ITEM_TYPES,
      default: "Story",
    },
    itemHashcode: {
      type: "string",
      label: "Item Hashcode",
      description: "The hashcode (ID) of the board item to edit or delete",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://www.vivifyscrum.com/api/v1";
    },
    _authHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._getBaseUrl()}${path}`,
        headers: this._authHeaders(),
        ...opts,
      });
    },
    createBoardItem(opts = {}) {
      return this._makeRequest({
        path: "/task",
        method: "POST",
        ...opts,
      });
    },
    updateBoardItem(opts = {}) {
      return this._makeRequest({
        path: "/task",
        method: "PUT",
        ...opts,
      });
    },
    deleteBoardItem(opts = {}) {
      return this._makeRequest({
        path: "/task",
        method: "DELETE",
        ...opts,
      });
    },
  },
};
