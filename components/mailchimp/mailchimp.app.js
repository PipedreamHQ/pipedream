const mailchimp = require("@mailchimp/mailchimp_marketing");
const retry = require("async-retry");
module.exports = {
  type: "app",
  app: "mailchimp",
  propDefinitions: {
    listId: {
      type: "string",
      label: "Audience List Id",
      description:
        "The unique ID of the audience list you'd like to watch for events.",
      useQuery: true,
      async options({ page }) {
        const count = 1000;
        const offset = 1000 * page;
        const audienceListResults =  await this.getAudienceLists({
          count,
          offset,
        });
        return audienceListResults.lists.map((audienceList) => ({
          label: audienceList.name,
          value: audienceList.id,
        }));
      },
    },
    // eslint-disable-next-line pipedream/props-description
    campaignId: {
      type: "string",
      label: "Campaign Id",
      useQuery: true,
      async options({ page }) {
        const count = 1000;
        const offset = 1000 * page;
        const campaignsResults =  await this.getCampaignsByCreationDate({
          count,
          offset,
        });
        return campaignsResults.campaigns.map((campaign) => {
          const lsdIdx = campaign.long_archive_url.lastIndexOf("/");
          const campaignName = lsdIdx > 0
            ? campaign.long_archive_url.substring(lsdIdx + 1)
            : "";
          const label = `Campaign Id/Name from URL (if any): ${campaign.id}/${campaignName}, List Id/Name: ${campaign.recipients.list_id}/${campaign.recipients.list_name}, Subject: ${campaign.settings.subject_line}`;
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
      optional: true,
    },
    // eslint-disable-next-line pipedream/props-description
    storeId: {
      type: "string",
      label: "Store Id",
      useQuery: true,
      async options({ page }) {
        const config = {
          count: 1000,
          offset: 1000 * page,
        };
        const storeResults =  await this.getAllStores(config);
        return storeResults.stores.map((store) => ({
          label: store.name,
          value: store.id,
        }));
      },
    },
    segmentId: {
      type: "string",
      label: "Segment/Tag Id",
      description:
        "The unique ID of the segment or tag you'd like to watch for new subscribers.",
      useQuery: true,
      async options(opts) {
        const count = 1000;
        const offset = 1000 * opts.page;
        const config = {
          count: count,
          offset: offset,
        };
        const segmentsResults =  await this.getAllAudienceSegments(
          opts.listId,
          config,
        );
        return segmentsResults.segments.map((segment) => ({
          label: `${segment.name}`,
          value: segment.id,
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
    _server() {
      return this.$auth.dc;
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
          console.warn(`Temporary error: ${err.message}`);
          throw err;
        }
      }, retryOpts);
    },
    statusIsSent(status) {
      return "status" === status;
    },
    /**
     * Create a webhook on the specified Audience List.
     * @param {String} listId - The unique ID that identifies the Audience List you would like to
     * create a webhook on.
     * @param {String} config.url - URL listening for the webhook event.
     * @param {String} config.events -
     * @param {String} config.sources -
     * @returns {_links: array, events: object, id: string, list_id: string, sources: object, url:
     * string} Object with array of links for the webhook manipulation through the Mailchimp API,
     * an object with flags of the Mailchimp Marketing indicates the events being watched for, an
     * unique ID of the webhoom, the unique ID which identifies the Audience List where the webhoook
     * was created, a `sources` object indicating whether the sources for the event are an admin
     * user, an audience subscriber, or via the API, the URL registered for the webhook event.
     */
    async createWebhook(listId, config) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.lists.createListWebhook(listId, config));
    },
    /**
     * Deletes a webhook on the specified Audience List.
     * @param {String} listId - The unique ID that identifies the Audience List containing the
     * webhook to delete.
     * @param {String} webhookId - The unique ID of the webhook you'd like to delete.
     * @returns {} - This method returns an empty object.
     */
    async deleteWebhook(listId, webhookId) {
      const server = this._server();
      const mailchimp = this.api(server);
      return await this._withRetries(() =>
        mailchimp.lists.deleteListWebhook(listId, webhookId));
    },
    //TODO: document this method
    getDbServiceVariable(variable) {
      return this.db.get(`${variable}`);
    },
    setDbServiceVariable(variable, value) {
      this.db.set(`${variable}`, value);
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
     * Gets the audience lists under the connected Mailchimp acccount.
     * @param {Integer} config.count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @param {Integer} config.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @param {Date} config.beforeDateCreated - Restrict response to audience lists created before
     * the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} config.sinceDateCreated - Restrict response to audience lists created since
     * the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns {lists: array, total_items: integer, constraints: object, _links: object } An
     * array with the information of the audience `lists` returned, `total_items` with the total
     * count of the audience list collection, `constraints` object with possible limitations when
     * quering this endpoint, and `_links` array of links for audience list manipulation through
     * the Mailchimp API.
     */
    async getAudienceLists(config) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.lists.getAllLists({
          ...config,
          sortField: "date_created",
          sortDir: "ASC",
        }));
    },
    /**
     * Gets the marketing campaigns under the connected Mailchimp acccount.
     * @param {Integer} count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @param {Integer} offset - For pagination, this the number of records from a collection to
     * skip. Default value is 0.
     * @param {Date} beforeDate - Restrict response to marketing campaigns created or sent before
     * the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} sinceDate - Restrict response to marketing campaigns created or sent since the
     * set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns An anrray of campaign objects, each with all the details of a campaign. For details of a campaing object,
     * expand [List Campaigns](https://mailchimp.com/developer/marketing/api/campaigns/list-campaigns/)
     * and see the sample response at the Mailchimp Marketing API documentation.
     */
    async getCampaigns(config) {
      const mailchimp = this.api();
      const { campaigns = [] } = await this._withRetries(() => mailchimp.campaigns.list(config));
      return campaigns;
    },
    getCampaignsByCreationDate({
      startDateTime = new Date(0),
      endDateTime = new Date(),
      count = 1000,
      offset = 0,
    }) {
      const config = {
        sinceCreateTime: startDateTime,
        beforeCreateTime: endDateTime,
        count,
        offset,
        sortField: "create_time",
        sortDir: "DESC",
      };
      return this.getCampaigns(config);
    },
    getCampaignsBySentDate({
      startDateTime = new Date(0),
      endDateTime = new Date(),
      count = 1000,
      offset = 0,
    }) {
      const config = {
        sinceSendTime: startDateTime,
        beforeSendTime: endDateTime,
        count,
        offset,
        sortField: "send_time",
        sortDir: "DESC",
      };
      return this.getCampaigns(config);
    },
    /**
     * Gets the subscribers added to a given audience list segment or tag under the connected
     * Mailchimp acccount.
     * @param {String} config.listId - The unique ID that identifies the Audience List associated to
     * the segment or tag to look for subscribers.
     * @param {String} config.segmentId - The unique ID that identifies the Audience List segment or
     * tag to look for subscribers.
     * @param {Integer} config.count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @param {Integer} config.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @param {Boolean} config.includeTransactional - Include transactional members in response.
     * @returns {members: array, total_items: integer, _links: object } An array with the
     * subscribers information  (`members`) returned, `total_items` with the total count of the
     * subscribers collection, and `_links` array of links for segment or tag subscribers
     * manipulation through the Mailchimp API.
     */
    async getSegmentMembersList(listId, segmentId, config) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.lists.getSegmentMembersList(listId, segmentId, config));
    },
    /**
     * Gets segments and tags of the specified Audience List under the connected Mailchimp acccount.
     * @param {String} config.listId - The unique ID for the Audience list.
     * @param {Integer} config.count - For pagination, the number of records to return.
     * Default value is 10. Maximum value is 1000
     * @param {Integer} config.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @param {String} config.type - Limit results based on segment type.
     * @param {Date} config.since_created_at - Restrict response to segments created before the set
     * date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} config.before_created_at - Restrict response to segments  created since the set
     * date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Boolean} config.include_transactional - Include transactional members in  response.
     * @param {Boolean} config.includeCleaned - Include cleaned members in  response.
     * @param {Boolean} config.includeTransactional - Include transactional members in  response.
     * @param {Boolean} config.includeUnsubscribed - Include unsubscribed members in  response.
     * @param {Date} config.before_updated_at - Restrict response to segments updated before the set
     * date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} config.since_updated_at - Restrict response to segments  updated since the set
     * date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
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
    /**
     * Gets a list with information about Facebook ads (outreach).
     * @param {String} config.fields - A comma-separated list of fields
     * to return. Reference parameters sub-objects with dot notation.
     * @param {String} config.exclude_fields - A comma-separated list of
     * fields to exclude. Reference parameters of sub-objects with dot notation.
     * @param {Integer} config.count - For pagination, the number of records to return
     * on each page.
     * Default value is 10. Maximum value is 1000.
     * @param {Integer} config.offset - For pagination, this the number of records
     * from a collection to skip. Default value is 0.
     * @param {String} config.sort_field - Returns files sorted by the specified
     * field. Possible values: "created_at", "updated_at", or "end_time".
     * @param {String} config.sort_dir - Determines the order direction for
     * sorted results. Possible values: "ASC" or "DESC".
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
     * Gets files in the File Manager under the connected Mailchimp acccount.
    * @param {Integer} config.count - For pagination, the number of records to return on each page.
    * Default value is 10. Maximum value is 1000.
     * @param {Integer} config.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.ssaa
     * @param {String} config.type - The file type for the File Manager file, can be "image" or
     * "file". Don't specify for both types.
     * @param {Boolean} config.includeTransactional - Include transactional members in response.
     * @param {Date} config.beforeCreatedAt - Restrict response to files created before the set
     * date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} config.sinceCreatedAt - Restrict response to files created since the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns {files: array, total_file_size: integer, total_items: integer, _links: object } An
     * array with the information of the `files` returned, `total_file_size` with the total size of
     * all File Manager files in bytes, `total_items` with the total count of the files
     * collection, and `_links` array of links for file manipulation through the Mailchimp API.
     */
    async getAllFiles(config) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.fileManager.files(config));
    },
    /**
     * Gets customers in an specified Ecommerce Store under the connected Mailchimp acccount.
     * @param {String} config.storeId - The unique ID of the Ecommerce Store you'd like to get
     * customers from.
     * @param {Integer} config.count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @param {Integer} config.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @returns {store_id: string, customers: array, total_items: integer, _links: object }
     * `store_id` with the unique ID of the Ecommerce Store being queried, an array with the
     * information of the `customers` returned, `total_items` with the total count of the customers
     * collection, and `_links` array of links for customer manipulation through the Mailchimp API.
     */
    async getAllStoreCustomers(storeId, config) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.ecommerce.getAllStoreCustomers(storeId, config));
    },
    /**
     * Get information about all stores in the Mailchimp account.
    * @param {Integer} config.count - For pagination, the number of records to return on each page.
    * Default value is 10. Maximum value is 1000.
     * @param {Integer} config.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @param {String} config.fields - A comma-separated list of fields to return. Reference
     * parameters sub-objects with dot notation..
     * @param {String} config.exclude_fields - A comma-separated list of fields to exclude.
     * Reference parameters of sub-objects with dot notation.
     * @returns {stores: array, total_file_size: integer, total_items: integer, _links: object } An
     * array with the information of the `stores` returned, `total_items` with the total count of
     * the stores collection, and `_links` array of link types and descriptions for the API schema
     * documents.
     */
    async getAllStores(config) {
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.ecommerce.stores(config));
    },
    /**
     * Gets orders in an specified Ecommerce Store, or orders under the connected Mailchimp
     * acccount.
     * @param {String} storeId - The unique ID of the Ecommerce Store you'd like to get
     * orders from.
     * @param {Integer} config.count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @param {Integer} config.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @param {String} config.campaignId - Restrict results to orders with this specific campaignId
     * value.
     * @param {String} config.outreachId - Restrict results to orders with a specific outreachId
     * value.
     * @param {String} config.customerId - Restrict results to orders made by the specific customer
     * with this unique ID.
     * @param {Boolean} config.hasOutreach - Restrict results to orders that have an outreach
     * attached.
     * For example, an email campaign or Facebook ad.
     * @returns {store_id: string, orders: array, total_items: integer, _links: object } `store_id`
     * with the unique ID of the Ecommerce Store if specified (not present otherwise), an array
     * with the information of the `orders` returned, `total_items` with the total count of the
     * orders collection, and `_links` array of links for order manipulation through the Mailchimp
     * API.
     */
    async getAllOrders(storeId = null, config) {
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
      const mailchimp = this.api();
      if (storeId === "") {
        return await this._withRetries(() =>
          mailchimp.ecommerce.getStoreOrders(storeId, config));
      }
      return await this._withRetries(() => mailchimp.ecommerce.orders(config));
    },
    /**
     * Gets details of a given campaign under the connected Mailchimp acccount.
     * @param {String} campaignId - The unique ID of the campaign you'd like to get details of.
     * @returns An object with all the details of a campaign. For details of a campaing object,
     * expand [Get Campaign Info](https://mailchimp.com/developer/marketing/api/campaigns/get-campaign-info/)
     * and see the sample response at the Mailchimp Marketing API documentation.
     */
    async getCampaignInfo(campaignId) {
      const mailchimp = this.api();
      return await this._withRetries(() => mailchimp.campaigns.get(campaignId));
    },
    /**
     * Gets information about all available segments for the specified Audience List in
     * the connected Mailchimp account.
     * @param {String} listId - The unique ID that identifies the Audience List you'd like to
     * watch for new or updated segments.
     * @param {Integer} config.count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @param {Integer} config.offset - For pagination, this the number of records from a collection
     * to skip. Default value is 0.
     * @param {Date} config.beforeCreatedAt - Restrict response to files created before the set
     * date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} config.sinceCreatedAt - Restrict response to files created since the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} config.beforeUpdatedAt - Restrict response to files updated before the set
     * date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @param {Date} config.sinceUpdatedAt - Restrict response to files updated since the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns {segments: array, list_id: integer, total_items: integer, _links: object } An
     * array with the information representing the list's `segments`, `list_id` for the id of the
     * Audience list, `total_items` with the total count of the segments
     * collection, and `_links` array of links for segment manipulation through the Mailchimp API.
     */
    async getAudienceSegments(
      listId,
      config,
    ) {
      if (config.sinceCreatedAt && config.beforeCreatedAt) {
        delete config.sinceUpdatedAt;
        delete config.beforeUpdatedAt;
      } else {
        delete config.sinceCreatedAt;
        delete config.beforeCreatedAt;
      }
      const mailchimp = this.api();
      return await this._withRetries(() =>
        mailchimp.lists.listSegments(listId, config));
    },
  },
};
