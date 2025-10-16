import { axios as axiosPD } from "@pipedream/platform";
import axios from "axios";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

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
    adAccountId: {
      type: "string",
      label: "Ad Account Id",
      description: "Sponsored ad account id to match results by",
      async options({ page }) {
        const count = 10;
        const params = {
          count,
          start: count * page,
        };
        const { elements } = await this.searchAdAccounts({
          params,
        });
        return elements?.map((element) => ({
          label: element.name,
          value: element.id,
        }));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign Id",
      description: "Sponsored campaign account id to match results by",
      async options({ page }) {
        const count = 10;
        const params = {
          count,
          start: count * page,
        };
        const { elements } = await this.searchCampaigns({
          params,
        });
        return elements?.map((element) => ({
          label: element.name,
          id: element.id,
        }));
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
      label: "Post Id",
      description: "URN of the post that will be deleted. URN must be either a ugcPostUrn (`urn:li:ugcPost:{id}`) or shareUrn (`urn:li:share:{id}`). The shareUrn can be found in the post's embed code.",
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
    role: {
      type: "string",
      label: "Role",
      description: "Limit results to specific roles, such as ADMINISTRATOR or DIRECT_SPONSORED_CONTENT_POSTER.",
      optional: true,
      options: constants.ORGANIZATION_ROLES,
    },
    state: {
      type: "string",
      label: "State",
      description: "Limit results to specific role states, such as APPROVED or REQUESTED.",
      optional: true,
      options: constants.ROLE_STATES,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "Maximum number of results to return",
      optional: true,
      default: 50,
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

      return axiosPD($ || this, {
        url: url || `${BASE_URL}${constants.VERSION_PATH}${path}`,
        headers: this._getHeaders(),
        ...otherConfig,
      });
    },
    async _makeRequestAxios({
      url, path, ...otherConfig
    }) {
      const BASE_URL = constants.BASE_URL;

      return axios({
        url: url || `${BASE_URL}${constants.VERSION_PATH}${path}`,
        headers: this._getHeaders(),
        ...otherConfig,
      });
    },
    createPost(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/posts",
        ...args,
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
        path: `/people/(id:${personId})`,
        ...args,
      });
    },
    async getMultipleMemberProfiles(args = {}) {
      return this._makeRequest({
        path: "/people",
        ...args,
      });
    },
    async getAccessControl({
      strParams, ...args
    }) {
      return this._makeRequestAxios({
        path: `/organizationAcls${strParams
          ? `?${strParams}`
          : ""}`,
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
        path: `/organizations?q=${query}`,
        ...args,
      });
    },
    async searchAdAccounts(args = {}) {
      return this._makeRequest({
        path: "/adAccounts?q=search",
        ...args,
      });
    },
    async searchCampaigns(args = {}) {
      return this._makeRequest({
        path: "/adCampaigns?q=search",
        ...args,
      });
    },
    listPosts(args = {}) {
      return this._makeRequest({
        path: "/posts",
        paramsSerializer: utils.getParamsSerializer(utils.encodeFn),
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      lastDateAt, dateField,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              count: constants.DEFAULT_LIMIT,
              start: page * constants.DEFAULT_LIMIT,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const isDateGreater =
            lastDateAt
              && resource[dateField] > lastDateAt;

          if (!lastDateAt || isDateGreater) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
