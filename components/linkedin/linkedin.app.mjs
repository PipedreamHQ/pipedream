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
        for (const item of elements) {
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
    startYear: {
      type: "string",
      label: "Start Year",
      description: "The inclusive start year range of analytics.\nThis action query is set to 1st January, as the day and month of the start range of the analytics.",
    },
    timeGranularity: {
      type: "string",
      label: "Time Granularity",
      description: "Time granularity of results. Valid enum values:\n\n* ALL - Results grouped into a single result across the entire time range of the report.\n* DAILY - Results grouped by day.\n* MONTHLY - Results grouped by month.\n* YEARLY - Results grouped by year.",
      options: constants.TIME_GRANULARITY_OPTIONS,
    },
    pivot: {
      type: "string",
      label: "Pivot",
      description: "Pivot of results, by which each report data point is grouped. The following enum values are supported:\n* COMPANY - Group results by advertiser's company.\n* ACCOUNT - Group results by account.\n* SHARE - Group results by sponsored share.\n* CAMPAIGN - Group results by campaign.\n* CREATIVE - Group results by creative.\n* CAMPAIGN_GROUP - Group results by campaign group.\n* CONVERSION - Group results by conversion.\n* CONVERSATION_NODE - The element row in the conversation will be the information for each individual node of the conversation tree.\n* CONVERSATION_NODE_OPTION_INDEX - Used `actionClicks` are deaggregated and reported at the Node Button level. The second value of the `pivot_values` will be the index of the button in the node.\n* SERVING_LOCATION - Group results by serving location, onsite or offsite.\n* CARD_INDEX - Group results by the index of where a card appears in a carousel ad creative. Metrics are based on the index of the card at the time when the user's action (impression, click, etc.) happened on the creative (Carousel creatives only).\n* MEMBER_COMPANY_SIZE - Group results by member company size.\n* MEMBER_INDUSTRY - Group results by member industry.\n* MEMBER_SENIORITY - Group results by member seniority.\n* MEMBER_JOB_TITLE - Group results by member job title.\n* MEMBER_JOB_FUNCTION - Group results by member job function.\n* MEMBER_COUNTRY_V2 - Group results by member country.\n* MEMBER_REGION_V2 - Group results by member region.\n* MEMBER_COMPANY - Group results by member company.",
      options: constants.PIVOT_OPTIONS,
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Linkedin-Version": constants.VERSION_HEADER,
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
    async deletePost(postId, args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/posts/${postId}`,
        ...args,
      });
    },
    async createComment(urnToComment, args = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/socialActions/${urnToComment}/comments`,
        ...args,
      });
    },
    async createLikeOnShare(parentUrn, args = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/socialActions/${parentUrn}/likes`,
        ...args,
      });
    },
    async getAdAccount(adAccountId, args = {}) {
      return this._makeRequest({
        path: `/adAccounts/${adAccountId}`,
        ...args,
      });
    },
    async getCurrentMemberProfile(args = {}) {
      return this._makeRequest({
        path: "/me",
        ...args,
      });
    },
    async getMemberProfile(personId, args = {}) {
      return this._makeRequest({
        path: `people/(id:${personId})`,
        ...args,
      });
    },
    async getMultipleMemberProfiles(args = {}) {
      return this._makeRequest({
        path: "/people",
        ...args,
      });
    },
    async getAccessControl(args = {}) {
      return this._makeRequest({
        path: "/organizationAcls",
        ...args,
      });
    },
    async createShare(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/shares",
        ...args,
      });
    },
    async queryAnaltyics(query, args = {} ) {
      return this._makeRequest({
        path: `/adAnalytics?q=analytics${query}`,
        ...args,
      });
    },
    async getComments(urn, args = {}) {
      return this._makeRequest({
        path: `/socialActions/${urn}/comments`,
        ...args,
      });
    },
    async searchOrganizations(query, args = {}) {
      return this._makeRequest({
        path: `/organizations?q=analytics${query}`,
        ...args,
      });
    },
  },
};
