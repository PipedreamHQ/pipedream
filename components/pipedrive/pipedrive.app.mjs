import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pipedrive",
  propDefinitions: {
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "Your company name as registered in Pipedrive, which becomes part of Pipedrive API base url.",
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "ID of the user who will be marked as the owner of this deal. If omitted, the authorized user ID will be used.",
      optional: true,
    },
    personId: {
      type: "integer",
      label: "Person ID",
      description: "ID of the person this deal will be associated with",
      optional: true,
    },
    organizationId: {
      type: "integer",
      label: "Organization ID",
      description: "ID of the organization this deal will be associated with",
      optional: true,
    },
    probability: {
      type: "integer",
      label: "Probability",
      description: "Deal success probability percentage. Used/shown only when deal_probability for the pipeline of the deal is enabled.",
      optional: true,
    },
    lostReason: {
      type: "string",
      label: "Lost Reason",
      description: "Optional message about why the deal was lost (to be used when status=lost)",
      optional: true,
    },
    visibleTo: {
      type: "string",
      label: "Visible To",
      description: "Visibility of the deal. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.\n1 - Owner & followers (private)\n3 - Entire company (shared)",
      optional: true,
      options: constants.VISIBLE_TO_OPTIONS,
    },
    addTime: {
      type: "string",
      label: "Add Time",
      description: "Optional creation date & time of the deal in UTC. Requires admin user API token. Format: YYYY-MM-DD HH:MM:SS",
      optional: true,
    },
    ownerId: {
      type: "integer",
      label: "Owner ID",
      description: "ID of the user who will be marked as the owner of this organization. When omitted, the authorized user ID will be used.",
      optional: true,
    },
    dealTitle: {
      type: "string",
      label: "Title",
      description: "Deal title",
    },
    dealValue: {
      type: "string",
      label: "Value",
      description: "Value of the deal. If omitted, value will be set to 0.",
      optional: true,
    },
    dealCurrency: {
      type: "string",
      label: "Currency",
      description: "Currency of the deal. Accepts a 3-character currency code. If omitted, currency will be set to the default currency of the authorized user.",
      optional: true,
    },
    stageId: {
      type: "integer",
      label: "Stage ID",
      description: "ID of the stage this deal will be placed in a pipeline (note that you can't supply the ID of the pipeline as this will be assigned automatically based on stage_id). If omitted, the deal will be placed in the first stage of the default pipeline. Get the `stage_id` from [here](https://developers.pipedrive.com/docs/api/v1/#!/Stages/get_stages). Getting all stages requires a pipeline_id, pipelines can be obtained from [here](https://developers.pipedrive.com/docs/api/v1/#!/Pipelines/get_pipelines)",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "open = Open, won = Won, lost = Lost, deleted = Deleted. If omitted, status will be set to open.",
      optional: true,
      options: constants.STATUS_OPTIONS,
    },
    start: {
      type: "integer",
      label: "Pagination start",
      description: "Pagination start. Note that the pagination is based on main results and does not include related items when using search_for_related_items parameter.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Items shown per page.",
      optional: true,
    },
  },
  methods: {
    getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    buildUrl({
      companyDomain, path,
    }) {
      const baseUrl =
        constants.BASE_URL.replace(constants.COMPANY_DOMAIN_PLACEHOLDER, companyDomain);
      return `${baseUrl}${path}`;
    },
    async makeRequest(customConfig) {
      const {
        $,
        companyDomain,
        path,
        url,
        ...otherConfig
      } = customConfig;

      const config = {
        url: url ?? this.buildUrl({
          companyDomain,
          path,
        }),
        headers: this.getHeaders(),
        ...otherConfig,
      };

      return axios($, config);
    },
    async createActivity({
      $, companyDomain, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/activities",
        companyDomain,
        data,
      });
    },
    async createDeal({
      $, companyDomain, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/deals",
        companyDomain,
        data,
      });
    },
    async updateDeal({
      $, companyDomain, dealId, data,
    }) {
      return this.makeRequest({
        $,
        method: "put",
        path: `/deals/${dealId}`,
        companyDomain,
        data,
      });
    },
    async createOrganization({
      $, companyDomain, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/organizations",
        companyDomain,
        data,
      });
    },
    async createPerson({
      $, companyDomain, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/persons",
        companyDomain,
        data,
      });
    },
    async searchPersons({
      $, companyDomain, params,
    }) {
      return this.makeRequest({
        $,
        path: "/persons/search",
        companyDomain,
        params,
      });
    },
  },
};
