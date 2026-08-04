import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  LAYOUT_MODES,
  VERSION_PATH,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "workflowy",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The main text of the node.",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Optional note (secondary text) for the node.",
      optional: true,
    },
    layoutMode: {
      type: "string",
      label: "Layout Mode",
      description: "Optional display mode for the node. One of: `bullets`, `todo`, `h1`, `h2`, `h3`, `code-block`, `quote-block`.",
      options: LAYOUT_MODES,
      optional: true,
    },
  },
  methods: {
    _makeRequest({
      $ = this, method = "GET", path, params, data,
    }) {
      return axios($, {
        method,
        url: `${BASE_URL}${VERSION_PATH}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        params,
        data,
      });
    },
    createNode({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/nodes",
        data,
      });
    },
    updateNode({
      $, nodeId, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/nodes/${nodeId}`,
        data,
      });
    },
    exportNodes({ $ }) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/nodes-export",
      });
    },
  },
};
