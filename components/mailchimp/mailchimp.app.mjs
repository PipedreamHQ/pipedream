import mailchimp from "@mailchimp/mailchimp_marketing";
import { axios } from "@pipedream/platform";
import retry from "async-retry";
import constants from "./sources/constants.mjs";
import rootConstants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mailchimp",
  propDefinitions: {
    listId: {
      type: "string",
      label: "Audience List Id",
      description: "The unique ID of the audience list you'd like to watch for events",
      useQuery: true,
      async options({ page }) {
        const count = constants.PAGE_SIZE;
        const offset = count * page;
        const audienceLists = await this.getAudienceLists({
          count,
          offset,
        });
        return audienceLists.map((audienceList) => ({
          label: audienceList.name,
          value: audienceList.id,
        }));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The unique ID of the campaign",
      useQuery: true,
      async options({ page }) {
        const count = constants.PAGE_SIZE;
        const offset = count * page;
        const campaigns = await this.getCampaignsByCreationDate({
          count,
          offset,
        });
        return campaigns.map((campaign) => {
          const lsdIdx = campaign.long_archive_url.lastIndexOf("/");
          const campaignName = lsdIdx > 0
            ? campaign.long_archive_url.substring(lsdIdx + 1)
            : "";
          const label = `Campaign ID/Name from URL (if any): ${campaign.id}/${campaignName}`;
          return {
            label,
            value: campaign.id,
          };
        });
      },
    },
    includeTransactional: {
      type: "boolean",
      label: "Include subscribers from Mailchimp Transactional?",
      description:
        "If set to `true`, it will include subscribers from Mailchimp Marketing and Mailchimp Transactional, formerly Mandrill.  When set to `false`, it will include subscribers from Mailchimp Marketing only.",
      default: false,
    },
    storeId: {
      type: "string",
      label: "Store Id",
      description: "The unique ID of the store",
      useQuery: true,
      async options({ page }) {
        const count = constants.PAGE_SIZE;
        const config = {
          count,
          offset: count * page,
        };
        const storeResults = await this.getAllStores(config);
        return storeResults.stores.map((store) => ({
          label: store.name,
          value: store.id,
        }));
      },
    },
    linkId: {
      type: "string",
      label: "Campaign Link",
      description: "The campaign link to track for clicks",
      async options(opts) {
        const links = await this.getCampaignClickDetails(opts.campaignId);
        if (!links.urls_clicked.length) {
          throw new Error("No link data available for the selected campaignId");
        }
        return links.urls_clicked.map((link) => ({
          label: link.url,
          value: link.id,
        }));
      },
    },
    segmentId: {
      type: "string",
      label: "Segment/Tag Id",
      description: "The unique ID of the segment or tag you'd like to watch for new subscribers",
      useQuery: true,
      async options(opts) {
        const count = constants.PAGE_SIZE;
        const offset = count * opts.page;
        const config = {
          count,
          offset,
        };
        const segmentsResults = await this.getAllAudienceSegments(
          opts.listId,
          config,
        );
        return segmentsResults.segments.map((segment) => ({
          label: `${segment.name}`,
          value: segment.id,
        }));
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
      optional: true,
    },
    excludeFields: {
      type: "string[]",
      label: "Exclude Fields",
      description: "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      max: constants.PAGE_SIZE,
      min: 1,
      default: 10,
      description: "The number of records to return.",
    },
    subscriberHash: {
      type: "string",
      label: "Subscriber",
      description: "The MD5 hash of the lowercase version of the list member's email address.",
      useQuery: true,
      async options(opts) {
        const count = constants.PAGE_SIZE;
        const offset = count * opts.page;
        const config = {
          count,
          offset,
        };
        const result = await this.getAllMembers(
          opts.listId,
          config,
        );

        return result.members.map((member) => ({
          label: `${member.full_name}`,
          value: member.id,
        }));
      },
    },
  },
  methods: {
    _auths() {
      return this.$auth;
    },
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _isRetriableStatusCode(statusCode) {
      [
        408,
        429,
        500,
      ].includes(statusCode);
    },
    _server() {
      return this.$auth.dc;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getUrl(path) {
      const {
        BASE_URL,
        HTTP_PROTOCOL,
        VERSION_PATH,
      } = rootConstants;
      return `${HTTP_PROTOCOL}${this._server()}.${BASE_URL}${VERSION_PATH}${path}`;
    },
    _campaignPath(campaignId = null) {
      return `/campaigns/${campaignId || ""}`;
    },
    _listPath(listId = null) {
      return `/lists/${listId || ""}`;
    },
    _segmentMemberPath(listId, segmentId, subscriberHash = null) {
      return `${this._listPath(listId)}/segments/${segmentId}/members/${subscriberHash || ""}`;
    },
    _listMemberPath(listId, subscriberHash) {
      return `${this._listPath(listId)}/members/${subscriberHash}`;
    },
    async _makeRequest(args = {}) {
      const {
        $,
        method = "get",
        path,
        params,
        data,
      } = args;
      const config = {
        method,
        url: this._getUrl(path),
        headers: this._getHeaders(),
        params,
        data,
      };
      return axios($ ?? this, config);
    },
    api() {
      mailchimp.setConfig({
        accessToken: this._authToken(),
        server: this._server(),
      });
      return mailchimp;
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const { status = 500 } = err;
          if (!this._isRetriableStatusCode(status)) {
            bail(`
              Unexpected error (status code: ${status}):
              ${JSON.stringify(err.response)}
            `);
          }

          throw err;
        }
      }, retryOpts);
    },
    statusIsSent(status) {
      return "sent" === status;
    },
    /**
     * Create a webhook on the specified Audience List.
     * @param {String} listId - The unique ID that identifies the Audience List you would like to
     * create a webhook on.
     * @param {Object} config - An object representing the configuration options for this method.
     * @returns {_links: array, events: object, id: string, list_id: string, sources: object, url:
     * string} Object with array of links for the webhook manipulation through the Mailchimp API,
     * an object with flags of the Mailchimp Marketing indicates the events being watched for, an
     * unique ID of the webhook, the unique ID which identifies the Audience List where the webhook
     * was created, a `sources` object indicating whether the sources for the event are an admin
     * user, an audience subscriber, or via the API, the URL registered for the webhook event.
     */
    async createWebhook(listId, config) {
      const mailchimp = this.api();
      const { id } = await this._withRetries(() =>
        mailchimp.lists.createListWebhook(listId, config));
      return id;
    },
    /**
     * Deletes a webhook on the specified Audience List.
     * @param {String} listId - The unique ID that identifies the Audience List containing the
     * webhook to delete.
     * @param {String} webhookId - The unique ID of the webhook you'd like to delete.
     * @returns {} - This method returns an empty object.
     */
    async deleteWebhook(listId, webhookId) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.lists.deleteListWebhook(listId, webhookId));
    },
    /**
     * Gets a campaign's send or create time.
     * @param {String} campaign - The campaign object to get its timestamp.
     * @param {String} status - The status of the campaign. This is checked whether to return the
     * created or sent timestamp. Defaults to "sent".
     * @returns {} - This method returns an empty object.
     */
    getCampaignTimestamp(campaign, status = "sent") {
      return status === "sent"
        ? campaign.send_time
        : campaign.create_time;
    },
    /**
     * Gets the audience lists under the connected Mailchimp account.
     * @param {Object} config - An object representing the configuration options for this method.
     * @returns {lists: array, total_items: integer, constraints: object, _links: object } An
     * array with the information of the audience `lists` returned, `total_items` with the total
     * count of the audience list collection, `constraints` object with possible limitations when
     * quering this endpoint, and `_links` array of links for audience list manipulation through
     * the Mailchimp API.
     */
    async getAudienceLists(config) {
      const mailchimp = this.api();
      const { lists = [] } = await this._withRetries(() =>
        mailchimp.lists.getAllLists({
          ...config,
          sortField: "date_created",
          sortDir: "ASC",
        }));
      return lists;
    },
    /**
     * Gets the marketing campaigns under the connected Mailchimp account.
     * @param {Object} config - An object representing the configuration options for this method.
     * @returns An array of campaign objects, each with all the details of a campaign.
     * For details of a campaing object, expand
     * [List Campaigns](https://mailchimp.com/developer/marketing/api/campaigns/list-campaigns/)
     * and see the sample response at the Mailchimp Marketing API documentation.
     */
    async getCampaigns(config) {
      const mailchimp = this.api();
      const { campaigns = [] } = await this._withRetries(() => mailchimp.campaigns.list(config));
      return campaigns;
    },
    /**
     * Gets the marketing campaigns under the connected Mailchimp account, ordered by
     * creation date.
     * @param {Object} opts={} - Options to customize request against Get Campaigns Mailchimp API.
     * @param {Integer} opts.count - For pagination, the number of records to return on each page.
     * Default value and maximum is 1000.
     * @param {Integer} opts.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @param {Date} opts.startDateTime - Restrict response to marketing campaigns sent before
     * the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} opts.endDateTime - Restrict response to marketing campaigns sent since the
     * set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns An array of campaign objects, each with all the details of a campaign.
     * For details of a campaing object, expand
     * [List Campaigns](https://mailchimp.com/developer/marketing/api/campaigns/list-campaigns/)
     * and see the sample response at the Mailchimp Marketing API documentation.
     */
    getCampaignsByCreationDate({
      startDateTime = new Date(0),
      endDateTime = new Date(),
      count = constants.PAGE_SIZE,
      offset = 0,
    }) {
      const config = {
        sinceCreateTime: startDateTime,
        beforeCreateTime: endDateTime,
        count,
        offset,
        sortField: "create_time",
        sortDir: "ASC",
      };
      return this.getCampaigns(config);
    },
    /**
     * Gets the marketing campaigns under the connected Mailchimp account, ordered by sent date.
     * @param {Object} opts={} - Options to customize request against Get Campaigns Mailchimp API.
     * @param {Integer} opts.count - For pagination, the number of records to return on each page.
     * Default value and maximum is 1000.
     * @param {Integer} opts.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @param {Date} opts.startDateTime - Restrict response to marketing campaigns sent before
     * the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} opts.endDateTime - Restrict response to marketing campaigns sent since the
     * set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns An array of campaign objects, each with all the details of a campaign.
     * For details of a campaing object, expand
     * [List Campaigns](https://mailchimp.com/developer/marketing/api/campaigns/list-campaigns/)
     * and see the sample response at the Mailchimp Marketing API documentation.
     */
    getCampaignsBySentDate({
      startDateTime = new Date(0),
      endDateTime = new Date(),
      count = constants.PAGE_SIZE,
      offset = 0,
    }) {
      const config = {
        sinceSendTime: startDateTime,
        beforeSendTime: endDateTime,
        count,
        offset,
        sortField: "send_time",
        sortDir: "ASC",
      };
      return this.getCampaigns(config);
    },
    /**
     * Gets the subscribers added to a given audience list segment or tag under the connected
     * Mailchimp account.
     * @param {String} listId - The unique ID that identifies the Audience List associated to
     * the segment or tag to look for subscribers.
     * @param {String} segmentId - The unique ID that identifies the Audience List segment or
     * tag to look for subscribers.
     * @param {Object} config - An object representing the configuration options for this method.
     * @returns {members: array, total_items: integer, _links: object } An array with the
     * subscribers information  (`members`) returned, `total_items` with the total count of the
     * subscribers collection, and `_links` array of links for segment or tag subscribers
     * manipulation through the Mailchimp API.
     */
    async getSegmentMembersList(listId, segmentId, config) {
      const mailchimp = this.api();
      const { members = [] } = await this._withRetries(() =>
        mailchimp.lists.getSegmentMembersList(listId, segmentId, config));
      return members;
    },
    /**
     * Gets segments and tags of the specified Audience List under the connected Mailchimp account.
     * @param {String} listId - The unique ID for the Audience list.
     * @param {Object} config - An object representing the configuration options for this method.
     * @returns {store_id: string, customers: array, total_items: integer, _links: object }
     * `store_id` with the unique ID of the Ecommerce Store being queried, an array with the
     * information of the `customers` returned, `total_items` with the total count of the customers
     * collection, and `_links` array of links for customer manipulation through the Mailchimp API.
     */
    async getAllAudienceSegments(listId, config) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.lists.listSegments(listId, config));
    },
    async getAllMembers(listId, config) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.lists.getListMembersInfo(listId, config));
    },
    /**
     * Gets a list with information about Facebook ads (outreach).
     * @param {Object} config - An object representing the configuration options for this method.
     * @returns {facebook_ads: array, total_items: integer, _links: object }
     * An array with the information of the `facebook_ads` returned, `total_items`
     * with the total count of the facebook_ads (the outreach) collection,
     * and `_links` a list of link types and descriptions for the API schema documents.
     */
    async getAllFacebookAds(config) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.facebookAds.list(config));
    },
    /**
     * Gets files in the File Manager under the connected Mailchimp account.
     * @param {String} fileType - "image" or "file", or "all"
     * @param {Object} config - An object representing the configuration options for this method.
     * @returns {files: array, total_file_size: integer, total_items: integer, _links: object } An
     * array with the information of the `files` returned, `total_file_size` with the total size of
     * all File Manager files in bytes, `total_items` with the total count of the files
     * collection, and `_links` array of links for file manipulation through the Mailchimp API.
     */
    async *getFileStream(fileType = "all", config) {
      let offset = 0;
      const type = fileType === "all"
        ? null
        : fileType;
      const opts = {
        offset,
        type,
        ...config,
      };
      do {
        opts.offset = offset;
        const { files = [] } = await this._withRetries(
          () => this.api().fileManager.files(opts),
        );
        if (files.length === 0) {
          return;
        }
        for (const file of files) {
          yield file;
        }
        offset += files.length;
      } while (true);
    },
    /**
     * Get information about all stores in the Mailchimp account.
     * @param {Object} config - An object representing the configuration options for this method.
     * @returns {stores: array, total_file_size: integer, total_items: integer, _links: object } An
     * array with the information of the `stores` returned, `total_items` with the total count of
     * the stores collection, and `_links` array of link types and descriptions for the API schema
     * documents.
     */
    async getAllStores(config) {
      return await this._withRetries(() =>
        this.api().ecommerce.stores(config));
    },
    /**
     * Gets orders in the specified Mailchimp connected account's Ecommerce Store.
     * @param {String} storeId - The unique ID of the Ecommerce Store you'd like to get
     * orders from.
     * @param {Object} config - An object representing the configuration options for this method.
     * @returns {store_id: string, orders: array, total_items: integer, _links: object } `store_id`
     * with the unique ID of the Ecommerce Store if specified (not present otherwise), an array
     * with the information of the `orders` returned, `total_items` with the total count of the
     * orders collection, and `_links` array of links for order manipulation through the Mailchimp
     * API.
     */
    async *getOrderStream(storeId, config) {
      let offset = config.offset;
      config.campaignId = config.campaignId === ""
        ? null
        : config.campaignId;
      config.outreachId = config.outreachId === ""
        ? null
        : config.outreachId;
      config.customerId = config.customerId === ""
        ? null
        : config.customerId;
      config.hasOutreach = config.hasOutreach === "Both"
        ? null
        : config.hasOutreach;
      do {
        const opts = {
          ...config,
          offset,
        };
        const { orders = [] } = await this._withRetries(
          () => this.api().ecommerce.getStoreOrders(storeId, opts),
        );
        if (orders.length === 0) {
          return;
        }
        for (const order of orders) {
          yield order;
        }
        offset += orders.length;
      } while (true);
    },
    /**
     * Returns a stream of customers belonging to a specific store ID
     *
     * @param {string} storeId the e-commerce store ID
     * @param {number} [pageSize=100] an optional parameter that specifies how
     * many customers are retrieved per API call to Mailchimp. Useful when
     * dealing with a frequently changing customer base, or to minimize API
     * calls and limits.
     * @yields a customer object, as specified by the [Mailchimp
     * API](https://mailchimp.com/developer/marketing/docs/e-commerce/#customers)
     */
    async *getAllStoreCustomers(storeId, pageSize = 100) {
      let offset = 0;
      do {
        const { customers = [] } = await this._withRetries(
          () => this.api().ecommerce.getAllStoreCustomers(storeId, {
            count: pageSize,
            offset,
          }),
        );
        if (customers.length === 0) {
          return;
        }
        for (const customer of customers) {
          yield customer;
        }
        offset += customers.length;
      } while (true);
    },
    /**
     * Gets the Click Report for the given campaign under the connected Mailchimp account.
     * @param {String} campaignId - The unique ID of the campaign you want the clicks report of.
     * @returns An object with all the details of a report object with campaigns's click details.
     * For details of the report, expand
     * [Click Reports](https://mailchimp.com/developer/marketing/api/click-reports/list-campaign-details/)
     * and see the sample response at the Mailchimp Marketing API documentation.
     */
    async getCampaignClickDetails(campaignId) {
      return await this._withRetries(() => this.api().reports.getCampaignClickDetails(campaignId));
    },
    /**
     * Gets the Click Report for the given campaign and link under the connected Mailchimp account.
     * @param {String} campaignId - The unique ID of the campaign related to the link you'd like to
     * get click details report of.
     * @param {String} linkId - The unique ID of the link you'd like to get click details report of.
     * @returns An object with all the details of a report object with campaign link's click
     * details. For details of the report, expand
     * [Click Reports](https://mailchimp.com/developer/marketing/api/click-reports/get-campaign-link-details/)
     * and see the sample response at the Mailchimp Marketing API documentation.
     */
    async getCampaignClickDetailsForLink(campaignId, linkId) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.reports.getCampaignClickDetailsForLink(campaignId, linkId));
    },
    /**
     * Gets information about all available segments for the specified Audience List in
     * the connected Mailchimp account.
     * @param {String} listId - The unique ID that identifies the Audience List you'd like to
     * watch for new or updated segments.
     * @param {Object} config - An object representing the configuration options for this method.
     * @returns {segments: array, list_id: integer, total_items: integer, _links: object } An
     * array with the information representing the list's `segments`, `list_id` for the id of the
     * Audience list, `total_items` with the total count of the segments
     * collection, and `_links` array of links for segment manipulation through the Mailchimp API.
     */
    async getAudienceSegments(
      listId,
      config,
    ) {
      return await this._withRetries(() => this.api().lists.listSegments(listId, config));
    },
    /**
     * Gets information about all available segments by created date for the specified
     * Audience List in the connected Mailchimp account.
     * @param {String} listId - The unique ID that identifies the Audience List you'd like to
     * watch for new created segments.
     * @param {Object} config - An object representing the configuration options for this method.
     * @param {Integer} config.count - For pagination, the number of records to return on each page.
     * Default value 0,  maximum value 1000.
     * @param {Integer} config.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @param {Date} config.startDateTime - Restrict response to marketing campaigns created before
     * the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} config.endDateTime - Restrict response to marketing campaigns created since the
     * set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns {segments: array, list_id: integer, total_items: integer, _links: object } An
     * array with the information representing the list's `segments`, `list_id` for the id of the
     * Audience list, `total_items` with the total count of the segments
     * collection, and `_links` array of links for segment manipulation through the Mailchimp API.
     */
    async getAudienceSegmentsByCreatedDate(
      listId,
      {
        startDateTime = new Date(0),
        endDateTime = new Date(),
        count = constants.PAGE_SIZE,
        offset = 0,
      },
    ) {
      const config = {
        sinceCreatedAt: startDateTime,
        beforeCreatedAt: endDateTime,
        count,
        offset,
      };
      const { segments = [] } = await this._withRetries(() =>
        this.api().lists.listSegments(listId, config));
      return segments;
    },
    /**
     * Gets information about all available segments by updated date for the specified
     * Audience List in the connected Mailchimp account.
     * @param {String} listId - The unique ID that identifies the Audience List you'd like to
     * watch for updated segments.
     * @param {Object} config - An object representing the configuration options for this method.
     * @param {Integer} config.count - For pagination, the number of records to return on each page.
     * Default value 0,  maximum value 1000.
     * @param {Integer} config.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @param {Date} config.startDateTime - Restrict response to marketing campaigns updated before
     * the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} config.endDateTime - Restrict response to marketing campaigns updated since the
     * set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns {segments: array, list_id: integer, total_items: integer, _links: object } An
     * array with the information representing the list's `segments`, `list_id` for the id of the
     * Audience list, `total_items` with the total count of the segments
     * collection, and `_links` array of links for segment manipulation through the Mailchimp API.
     */
    async getAudienceSegmentsByUpdatedDate(
      listId,
      {
        startDateTime = new Date(0),
        endDateTime = new Date(),
        count = constants.PAGE_SIZE,
        offset = 0,
      },
    ) {
      const config = {
        sinceUpdatedAt: startDateTime,
        beforeUpdatedAt: endDateTime,
        count,
        offset,
      };
      const { segments = [] } = await this._withRetries(() =>
        this.api().lists.listSegments(listId, config));
      return segments;
    },
    async listCampaignOpenDetails(campaignId) {
      return await this._withRetries(() => this.api().reports.getCampaignOpenDetails(campaignId));
    },
    async searchCampaign($, params) {
      return this._makeRequest({
        $,
        params,
        path: "/search-campaigns",
      });
    },
    async getCampaign($, {
      campaignId, ...params
    }) {
      return this._makeRequest({
        $,
        params,
        path: this._campaignPath(campaignId),
      });
    },
    async getCampaignReport($, {
      campaignId, ...params
    }) {
      return this._makeRequest({
        $,
        params,
        path: `/reports/${campaignId}`,
      });
    },
    async updateCampaign($, {
      campaignId, ...data
    }) {
      return this._makeRequest({
        $,
        data,
        path: this._campaignPath(campaignId),
        method: "patch",
      });
    },
    async createCampaign($, data) {
      return this._makeRequest({
        $,
        data,
        path: this._campaignPath(),
        method: "post",
      });
    },
    async editCampaignTemplate($, {
      campaignId, ...data
    }) {
      return this._makeRequest({
        $,
        data,
        path: `${this._campaignPath(campaignId)}/content`,
        method: "put",
      });
    },
    async deleteCampaign($, campaignId) {
      return this._makeRequest({
        $,
        path: this._campaignPath(campaignId),
        method: "delete",
      });
    },
    async sendCampaign($, campaignId) {
      return this._makeRequest({
        $,
        path: `${this._campaignPath(campaignId)}/actions/send`,
        method: "post",
      });
    },
    async searchLists($, params) {
      return this._makeRequest({
        $,
        path: "/lists",
        params,
      });
    },
    async searchMembers($, params) {
      return this._makeRequest({
        $,
        path: "/search-members",
        params,
      });
    },
    async getList($, {
      listId, ...params
    }) {
      return this._makeRequest({
        $,
        path: this._listPath(listId),
        params,
      });
    },
    async createList($, data) {
      return this._makeRequest({
        $,
        path: "/lists",
        data,
        method: "post",
      });
    },
    async updateList($, {
      listId, ...data
    }) {
      return this._makeRequest({
        $,
        path: this._listPath(listId),
        data,
        method: "patch",
      });
    },
    async deleteList($, listId) {
      return this._makeRequest({
        $,
        path: this._listPath(listId),
        method: "delete",
      });
    },
    async listSegmentMembers($, {
      listId, segmentId, ...params
    }) {
      return this._makeRequest({
        $,
        path: this._segmentMemberPath(listId, segmentId),
        params,
      });
    },
    async addSegmentMember($, {
      listId, segmentId, ...data
    }) {
      return this._makeRequest({
        $,
        path: this._segmentMemberPath(listId, segmentId),
        data,
        method: "post",
      });
    },
    async removeSegmentMember($, {
      listId, segmentId, subscriberHash,
    }) {
      return this._makeRequest({
        $,
        path: this._segmentMemberPath(listId, segmentId, subscriberHash),
        method: "delete",
      });
    },
    async getListActivities($, {
      listId, ...params
    }) {
      return this._makeRequest({
        $,
        path: `${this._listPath(listId)}/activity`,
        params,
      });
    },
    async getListMemberActivities($, {
      listId, subscriberHash, ...params
    }) {
      return this._makeRequest({
        $,
        path: `${this._listMemberPath(listId, subscriberHash)}/activity`,
        params,
      });
    },
    async archiveListMember($, {
      listId, subscriberHash,
    }) {
      return this._makeRequest({
        $,
        path: this._listMemberPath(listId, subscriberHash),
        method: "delete",
      });
    },
    async getListMemberTags($, {
      listId, subscriberHash, ...params
    }) {
      return this._makeRequest({
        $,
        path: `${this._listMemberPath(listId, subscriberHash)}/tags`,
        params,
      });
    },
    async addRemoveListMemberTags($, {
      listId, subscriberHash, ...data
    }) {
      return this._makeRequest({
        $,
        path: `${this._listMemberPath(listId, subscriberHash)}/tags`,
        data,
        method: "post",
      });
    },
    async deleteListMember($, {
      listId, subscriberHash,
    }) {
      return this._makeRequest({
        $,
        path: `${this._listMemberPath(listId, subscriberHash)}/actions/delete-permanent`,
        method: "post",
      });
    },
    async addNoteToListMember($, {
      listId, subscriberHash, ...data
    }) {
      return this._makeRequest({
        $,
        path: `${this._listMemberPath(listId, subscriberHash)}/notes`,
        method: "post",
        data,
      });
    },
    async addOrUpdateListMember($, {
      listId, subscriberHash, data, params,
    }) {
      return this._makeRequest({
        $,
        path: this._listMemberPath(listId, subscriberHash),
        method: "put",
        data,
        params,
      });
    },
  },
};
