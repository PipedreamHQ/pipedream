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
      async options({ page }) {
        const { elements } = await this.getOrganizations(page);

        const responseArray = [];
        for (let item of elements) {
          const orgId = item.organization.split(":")[3];
          const orgData = await this.getOrganization(orgId);

          responseArray.push({
            label: orgData.localizedName,
            value: orgId,
          });
        }
        return responseArray;
      },
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the post",
      options: constants.TYPES,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Visibility restrictions on content",
      options: constants.VISIBILITIES,
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "Id of the post that will be deleted",
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "X-Restli-Protocol-Version": "2.0.0",
      };
    },
    async _makeRequest({
      $, url, path, ...otherConfig
    }) {
      const BASE_URL = constants.BASE_URL;

      const config = {
        url: url || `${BASE_URL}${constants.VERSION_PATH}${path}`,
        headers: this._getHeaders(),
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
      visibility,
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
          "com.linkedin.ugc.MemberNetworkVisibility": visibility,
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

      return this._makeRequest({
        $,
        method: "POST",
        path: "/ugcPosts",
        data,
      });
    },
    async getOrganizations(page) {
      return this._makeRequest({
        method: "GET",
        path: `/organizationAcls?q=roleAssignee&count=5&start=${page * 5}`,
      });
    },
    async getOrganization(organizationId) {
      return this._makeRequest({
        method: "GET",
        path: `/organizations/${organizationId}`,
      });
    },
    async deletePost({
      $, postId,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/shares/${postId}`,
      });
    },
  },
};
