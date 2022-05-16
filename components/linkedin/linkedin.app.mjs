import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "linkedin",
  propDefinitions: {
    text: {
      type: "string",
      label: "Text",
      description: "Text to be posted on LinkedIn timeline",
    },
    organizationId: {
      type: "string",
      label: "Organization Id",
      description: "ID of the organization that will author the post",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the post",
      options: [
        {
          label: "Text/URL",
          value: "NONE",
        },
        {
          label: "Article",
          value: "ARTICLE",
        },
      ],
      optional: false,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Visibility restrictions on content",
      options: [
        {
          label: "Connections",
          value: "CONNECTIONS",
        },
        {
          label: "Public",
          value: "PUBLIC",
        },
        {
          label: "Logged in",
          value: "LOGGED_IN",
        },
      ],
      optional: false,
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "Id of the post that will be deleted",
      optional: false,
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "X-Restli-Protocol-Version": "2.0.0",
      };
    },
    async _makeRequest(customConfig) {
      const {
        $,
        url,
        path,
        method,
        params,
        data,
        ...otherConfig
      } =
        customConfig;

      const BASE_URL = constants.BASE_URL;

      const config = {
        method,
        url: url || `${BASE_URL}${constants.VERSION_PATH}${path}`,
        headers: this._getHeaders(),
        params,
        data,
        ...otherConfig,
      };

      return axios($ || this, config);
    },
    async createPost({
      $,
      orgId = null,
      type,
      text,
      originalUrl,
      thumbnail,
      title,
    }) {
      const data = {
        author: `urn:li:${orgId
          ? "organization"
          : "person"}:${
          orgId || this.$auth.oauth_uid
        }`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text,
            },
            shareMediaCategory: type,
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };
      if (type === "ARTICLE") {
        data.specificContent["com.linkedin.ugc.ShareContent"].media = [
          {
            description: {
              text: "description test",
            },
            originalUrl: originalUrl,
            status: "READY",
            thumbnails: [
              {
                url: thumbnail,
              },
            ],
            title: {
              text: title,
            },
          },
        ];
      }

      return await this._makeRequest({
        $,
        method: "POST",
        path: "/ugcPosts",
        data,
      });
    },
    async deletePost({
      $, postId,
    }) {
      return await this._makeRequest({
        $,
        method: "DELETE",
        path: `/shares/${postId}`,
      });
    },
  },
};
