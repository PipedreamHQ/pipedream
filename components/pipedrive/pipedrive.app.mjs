import pipedrive from "pipedrive";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pipedrive",
  propDefinitions: {
    content: {
      type: "string",
      label: "Content",
      description: "The content of the note in HTML format. Subject to sanitization on the back-end.",
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "ID of the user who will be marked as the owner of this deal. If omitted, the authorized user ID will be used.",
      optional: true,
      async options() {
        const { data: users } = await this.getUsers();
        return users.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    personId: {
      type: "integer",
      label: "Person ID",
      description: "ID of the person this deal will be associated with",
      optional: true,
      async options({ prevContext }) {
        const {
          moreItemsInCollection,
          start,
        } = prevContext;

        if (moreItemsInCollection === false) {
          return [];
        }

        const {
          data: persons,
          additional_data: additionalData,
        } = await this.getPersons({
          start,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        const options = persons.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));

        return {
          options,
          context: {
            moreItemsInCollection: additionalData.pagination.more_items_in_collection,
            start: additionalData.pagination.next_start,
          },
        };
      },
    },
    organizationId: {
      type: "integer",
      label: "Organization ID",
      description: "ID of the organization this deal will be associated with",
      optional: true,
      async options({ prevContext }) {
        const {
          moreItemsInCollection,
          start,
        } = prevContext;

        if (moreItemsInCollection === false) {
          return [];
        }

        const {
          data: organizations,
          additional_data: additionalData,
        } = await this.getOrganizations({
          start,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        const options = organizations.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));

        return {
          options,
          context: {
            moreItemsInCollection: additionalData.pagination.more_items_in_collection,
            start: additionalData.pagination.next_start,
          },
        };
      },
    },
    pinnedToDealFlag: {
      type: "boolean",
      label: "Pinned To Deal Flag",
      description: "If set, the results are filtered by note to deal pinning state (deal_id is also required)",
      default: false,
    },
    pinnedToOrgFlag: {
      type: "boolean",
      label: "Pinned To Organization Flag",
      description: "If set, the results are filtered by note to organization pinning state (org_id is also required)",
      default: false,
    },
    pinnedToPersonFlag: {
      type: "boolean",
      label: "Pinned To Person Flag",
      description: "If set, the results are filtered by note to person pinning state (person_id is also required)",
      default: false,
    },
    probability: {
      type: "integer",
      label: "Probability",
      description: "Deal success probability percentage. Used/shown only when `deal_probability` for the pipeline of the deal is enabled.",
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
      description: "Visibility of the deal. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.",
      optional: true,
      options: constants.VISIBLE_TO_OPTIONS,
    },
    addTime: {
      type: "string",
      label: "Add Time",
      description: "Optional creation date & time of the deal in UTC. Requires admin user API token. Format: `YYYY-MM-DD HH:MM:SS`",
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
      description: "ID of the stage this deal will be placed in a pipeline (note that you can't supply the ID of the pipeline as this will be assigned automatically based on `stage_id`). If omitted, the deal will be placed in the first stage of the default pipeline. Get the `stage_id` from [here](https://developers.pipedrive.com/docs/api/v1/#!/Stages/get_stages).",
      optional: true,
      async options() {
        const { data: stages } = await this.getStages();
        return stages.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
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
      description: "Pagination start. Note that the pagination is based on main results and does not include related items when using `search_for_related_items` parameter.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Items shown per page.",
      optional: true,
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "ID of the deal this activity will be associated with",
      optional: true,
      async options({ prevContext }) {
        const {
          moreItemsInCollection,
          start,
        } = prevContext;

        if (moreItemsInCollection === false) {
          return [];
        }

        const {
          data: deals,
          additional_data: additionalData,
        } = await this.getDeals({
          start,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        const options = deals?.map(({
          id, title,
        }) => ({
          label: title,
          value: id,
        }));

        return {
          options,
          context: {
            moreItemsInCollection: additionalData.pagination.more_items_in_collection,
            start: additionalData.pagination.next_start,
          },
        };
      },
    },
  },
  methods: {
    setupToken() {
      const client = new pipedrive.ApiClient();
      const oauth2 = client.authentications.oauth2;
      oauth2.accessToken = this.$auth.oauth_access_token;
      oauth2.refreshToken = this.$auth.oauth_refresh_token;
      oauth2.clientId = this.$auth.oauth_client_id;
      return client;
    },
    api(className) {
      const client = this.setupToken();
      return new pipedrive[className](client);
    },
    buildOpts(property, opts) {
      return pipedrive[property].constructFromObject(opts);
    },
    async addActivity(opts = {}) {
      const [
        className,
        addProperty,
      ] = constants.API.ACTIVITIES;
      try {
        return this.api(className).addActivity(this.buildOpts(addProperty, opts));
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    },
    addDeal(opts = {}) {
      const [
        className,
        addProperty,
      ] = constants.API.DEALS;
      return this.api(className).addDeal(this.buildOpts(addProperty, opts));
    },
    updateDeal(opts = {}) {
      const {
        dealId,
        ...otherOpts
      } = opts;
      const [
        className,,
        updateProperty,
      ] = constants.API.DEALS;
      return this.api(className).updateDeal(dealId, this.buildOpts(updateProperty, otherOpts));
    },
    async addNote(opts = {}) {
      const [
        className,
      ] = constants.API.NOTES;
      return this.api(className).addNote(opts);
    },
    async addOrganization(opts = {}) {
      const [
        className,
        addProperty,
      ] = constants.API.ORGANIZATIONS;
      return this.api(className).addOrganization(this.buildOpts(addProperty, opts));
    },
    addPerson(opts = {}) {
      const [
        className,
      ] = constants.API.PERSONS;
      return this.api(className).addPerson(opts);
    },
    searchPersons(opts = {}) {
      const {
        term,
        ...otherOpts
      } = opts;
      const [
        className,
      ] = constants.API.PERSONS;
      return this.api(className).searchPersons(term, otherOpts);
    },
    addFilter(opts = {}) {
      const [
        className,
        addProperty,
      ] = constants.API.FILTERS;
      return this.api(className).addFilter(this.buildOpts(addProperty, opts));
    },
    updateFilter(opts = {}) {
      const {
        filterId,
        ...otherOpts
      } = opts;
      const [
        className,,
        updateProperty,
      ] = constants.API.FILTERS;
      return this.api(className).updateFilter(filterId, this.buildOpts(updateProperty, otherOpts));
    },
    deleteFilter(filterId) {
      const [
        className,
      ] = constants.API.FILTERS;
      return this.api(className).deleteFilter(filterId);
    },
    getDeals(opts = {}) {
      const [
        className,
      ] = constants.API.DEALS;
      return this.api(className).getDeals(opts);
    },
    getPersons(opts = {}) {
      const [
        className,
      ] = constants.API.PERSONS;
      return this.api(className).getPersons(opts);
    },
    async getLeads(opts) {
      const [
        className,
      ] = constants.API.LEADS;
      return this.api(className).getLeads(opts);
    },
    async getUsers(opts) {
      const [
        className,
      ] = constants.API.USERS;
      return this.api(className).getUsers(opts);
    },
    getActivityTypes(opts) {
      const [
        className,
      ] = constants.API.ACTIVITY_TYPES;
      return this.api(className).getActivityTypes(opts);
    },
    getOrganizations(opts = {}) {
      const [
        className,
      ] = constants.API.ORGANIZATIONS;
      return this.api(className).getOrganizations(opts);
    },
    getStages(opts) {
      const [
        className,
      ] = constants.API.STAGES;
      return this.api(className).getStages(opts);
    },
    getDealFields(opts = {}) {
      const [
        className,
      ] = constants.API.DEAL_FIELDS;
      return this.api(className).getDealFields(opts);
    },
    getPersonFields(opts = {}) {
      const [
        className,
      ] = constants.API.PERSON_FIELDS;
      return this.api(className).getPersonFields(opts);
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      limit = constants.DEFAULT_PAGE_LIMIT,
      max = constants.DEFAULT_MAX_ITEMS,
    }) {
      let start = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            limit,
            start,
          });

        const nextResources = response?.data || [];
        start = response?.additional_data?.pagination?.next_start;

        if (!nextResources.length) {
          console.log("No more records to fetch.");
          return;
        }

        for (const resource of nextResources) {
          resourcesCount += 1;
          yield resource;
        }

        if (!start || resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
