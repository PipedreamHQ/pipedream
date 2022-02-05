const mailchimp = require("@mailchimp/mailchimp_marketing");
const get = require("lodash/get");
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
        const audienceListResults =  await this.getMailchimpAudienceLists(count,
          offset,
          undefined,
          undefined);
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
        const campaignsResults =  await this.getMailchimpCampaigns(count,
          offset,
          undefined,
          undefined,
          undefined);
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
        const count = 1000;
        const offset = 1000 * page;
        const storeResults =  await this.getAllStores(count,
          offset);
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
        const cfg = {
          count: count,
          offset: offset,
        };
        const segmentsResults =  await this.getAllAudienceSegments(
          opts.listId,
          cfg,
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
      return "us20";
    },
    _initMailchimpClient() {
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
          const statusCode = get(err, [
            "response",
            "status",
          ]);
          if (!this._isRetriableStatusCode(statusCode)) {
            bail(`
              Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(err.response)}
            `);
          }
          console.warn(`Temporary error: ${err.message}`);
          throw err;
        }
      }, retryOpts);
    },
    _statusIsSent(status) {
      return [
        "status",
      ].includes(status);
    },
    /**
     * Create a webhook on the specified Audience List.
     * @params {String} listId - The unique ID that identifies the Audience List you would like to
     * create a webhook on.
     * @params {String} webhookUrl - URL listening for the webhook event.
     * @returns {_links: array, events: object, id: string, list_id: string, sources: object, url:
     * string} Object with array of links for the webhook manipulation through the Mailchimp API,
     * an object with flags of the Mailchimp Marketing indicates the events being watched for, an
     * unique ID of the webhoom, the unique ID which identifies the Audience List where the webhoook
     * was created, a `sources` object indicating whether the sources for the event are an admin
     * user, an audience subscriber, or via the API, the URL registered for the webhook event.
     */
    async createWebhook(listId, webhookUrl, events, sources) {
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() =>
        mailchimp.lists.createListWebhook(listId, {
          url: webhookUrl,
          events,
          sources,
        }));
    },
    /**
     * Deletes a webhook on the specified Audience List.
     * @params {String} server - The server prefix used to access the connected Maichimp account.
     * @params {String} listId - The unique ID that identifies the Audience List containing the
     * webhook to delete.
     * @params {String} webhookId - The unique ID of the webhook you'd like to delete.
     * @returns {} - This method returns an empty object.
     */
    async deleteWebhook(server, listId, webhookId) {
      const mailchimp = this._initMailchimpClient(server);
      return await this._withRetries(() =>
        mailchimp.lists.deleteListWebhook(listId, webhookId));
    },
    /**
     * Gets the audience lists under the connected Mailchimp acccount.
     * @params {Integer} count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @params {Integer} offset - For pagination, this the number of records from a collection to
     * skip. Default value is 0.
     * @params {Date} beforeDateCreated - Restrict response to audience lists created before the
     * set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @params {Date} sinceDateCreated - Restrict response to audience lists created since the set
     * date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns {lists: array, total_items: integer, constraints: object, _links: object } An
     * array with the information of the audience `lists` returned, `total_items` with the total
     * count of the audience list collection, `constraints` object with possible limitations when
     * quering this endpoint, and `_links` array of links for audience list manipulation through
     * the Mailchimp API.
     */
    async getMailchimpAudienceLists(
      count,
      offset,
      beforeDateCreated,
      sinceDateCreated,
    ) {
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() =>
        mailchimp.lists.getAllLists({
          count,
          offset,
          beforeDateCreated,
          sinceDateCreated,
          sortField: "date_created",
          sortDir: "DESC",
        }));
    },
    /**
     * Gets the marketing campaigns under the connected Mailchimp acccount.
     * @params {Integer} count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @params {Integer} offset - For pagination, this the number of records from a collection to
     * skip. Default value is 0.
     * @params {Date} beforeDate - Restrict response to marketing campaigns created or sent before
     * the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @params {Date} sinceDate - Restrict response to marketing campaigns created or sent since the
     * set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns {campaigns: array, total_items: integer, constraints: object, _links: object } An
     * array with the information of the `campaigns` returned, `total_items` with the total count
     * of the campaigns collection, `constraints` object with possible limitations when quering
     * this endpoint, and `_links` array of links for campaigns manipulation through the Mailchimp
     * API.
     */
    async getMailchimpCampaigns(
      count,
      offset,
      status,
      beforeDate,
      sinceDate,
    ) {
      let opts = {
        count,
        offset,
        status,
        sortDir: "DESC",
      };
      if (this._statusIsSent(status)) {
        opts.beforeSendTime = beforeDate;
        opts.sinceSendTime = sinceDate;
        opts.sortField = "send_time";
      } else {
        opts.beforeCreateTime = beforeDate;
        opts.sinceCreateTime = sinceDate;
        opts.sortField = "create_time";
      }
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() => mailchimp.campaigns.list(opts));
    },
    /**
     * Gets the subscribers added to a given audience list segment or tag under the connected
     * Mailchimp acccount.
     * @params {String} listId - The unique ID that identifies the Audience List associated to the
     * segment or tag to look for subscribers.
     * @params {String} segmentId - The unique ID that identifies the Audience List segment or tag
     * to look for subscribers.
     * @params {Integer} count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @params {Integer} offset - For pagination, this the number of records from a collection to
     * skip. Default value is 0.
     * @params {Boolean} includeTransactional - Include transactional members in response.
     * @returns {members: array, total_items: integer, _links: object } An array with the
     * subscribers information  (`members`) returned, `total_items` with the total count of the
     * subscribers collection, and `_links` array of links for segment or tag subscribers
     * manipulation through the Mailchimp API.
     */
    async getSegmentMembersList(
      listId,
      segmentId,
      count,
      offset,
      includeTransactional,
    ) {
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() =>
        mailchimp.lists.getSegmentMembersList(listId, segmentId, {
          count,
          offset,
          includeTransactional,
          includeUnsubscribed: false,
        }));
    },
    /**
     * Gets segments and tags of the specified Audience List under the connected Mailchimp acccount.
     * @params {String} listId - The unique ID for the Audience list.
     * @params {Integer} count - For pagination, the number of records to return.
     * Default value is 10. Maximum value is 1000
     * @params {Integer} offset - For pagination, this the number of records from a collection to
     * skip. Default value is 0.
     * @params {String} type - Limit results based on segment type.
     * @params {Date} since_created_at - Restrict response to segments created before the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @params {Date} before_created_at - Restrict response to segments  created since the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @params {Boolean} include_transactional - Include transactional members in  response.
     * @params {Boolean} includeCleaned - Include cleaned members in  response.
     * @params {Boolean} includeTransactional - Include transactional members in  response.
     * @params {Boolean} includeUnsubscribed - Include unsubscribed members in  response.
     * @params {Date} before_updated_at - Restrict response to segments updated before the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @params {Date} since_updated_at - Restrict response to segments  updated since the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns {store_id: string, customers: array, total_items: integer, _links: object }
     * `store_id` with the unique ID of the Ecommerce Store being queried, an array with the
     * information of the `customers` returned, `total_items` with the total count of the customers
     * collection, and `_links` array of links for customer manipulation through the Mailchimp API.
     */
    async getAllAudienceSegments(listId, cfg) {
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() =>
        mailchimp.lists.listSegments(listId, cfg));
    },
    /**
     * Gets a list with information about Facebook ads (outreach).
     * @params {String} config.fields - A comma-separated list of fields
     * to return. Reference parameters sub-objects with dot notation.
     * @params {String} config.exclude_fields - A comma-separated list of
     * fields to exclude. Reference parameters of sub-objects with dot notation.
     * @params {Integer} config.count - For pagination, the number of records to return
     * on each page.
     * Default value is 10. Maximum value is 1000.
     * @params {Integer} config.offset - For pagination, this the number of records
     * from a collection to skip. Default value is 0.
     * @params {String} config.sort_field - Returns files sorted by the specified
     * field. Possible values: "created_at", "updated_at", or "end_time".
     * @params {String} config.sort_dir - Determines the order direction for
     * sorted results. Possible values: "ASC" or "DESC".
     * @returns {facebook_ads: array, total_items: integer, _links: object }
     * An array with the information of the `facebook_ads` returned, `total_items`
     * with the total count of the facebook_ads (the outreach) collection,
     * and `_links` a list of link types and descriptions for the API schema documents.
     */
    async getAllFacebookAds(config) {
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() =>
        mailchimp.facebookAds.list(config));
    },
    /**
     * Gets files in the File Manager under the connected Mailchimp acccount.
    * @params {Integer} count - For pagination, the number of records to return on each page.
    * Default value is 10. Maximum value is 1000.
     * @params {Integer} offset - For pagination, this the number of records from a collection to
     * skip. Default value is 0.
     * @params {String} type - The file type for the File Manager file, can be "image" or "file".
     * Don't specify for both types.
     * @params {Boolean} includeTransactional - Include transactional members in response.
     * @params {Date} beforeCreatedAt - Restrict response to files created before the set date. Uses
     * ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @params {Date} sinceCreatedAt - Restrict response to files created since the set date. Uses
     * ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns {files: array, total_file_size: integer, total_items: integer, _links: object } An
     * array with the information of the `files` returned, `total_file_size` with the total size of
     * all File Manager files in bytes, `total_items` with the total count of the files
     * collection, and `_links` array of links for file manipulation through the Mailchimp API.
     */
    async getAllFiles(
      count,
      offset,
      type = null,
      beforeCreatedAt,
      sinceCreatedAt,
    ) {
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() =>
        mailchimp.fileManager.files({
          count,
          offset,
          type,
          beforeCreatedAt,
          sinceCreatedAt,
        }));
    },
    /**
     * Gets customers in an specified Ecommerce Store under the connected Mailchimp acccount.
     * @params {String} storeId - The unique ID of the Ecommerce Store you'd like to get
     * customers from.
     * @params {Integer} count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @params {Integer} offset - For pagination, this the number of records from a collection to
     * skip. Default value is 0.
     * @returns {store_id: string, customers: array, total_items: integer, _links: object }
     * `store_id` with the unique ID of the Ecommerce Store being queried, an array with the
     * information of the `customers` returned, `total_items` with the total count of the customers
     * collection, and `_links` array of links for customer manipulation through the Mailchimp API.
     */
    async getAllStoreCustomers(storeId, count, offset) {
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() =>
        mailchimp.ecommerce.getAllStoreCustomers(storeId, {
          count,
          offset,
        }));
    },
    /**
     * Get information about all stores in the Mailchimp account.
    * @params {Integer} count - For pagination, the number of records to return on each page.
    * Default value is 10. Maximum value is 1000.
     * @params {Integer} offset - For pagination, this the number of records from a collection to
     * skip. Default value is 0.
     * @params {String} fields - A comma-separated list of fields to return. Reference parameters
     * sub-objects with dot notation..
     * @params {String} exclude_fields - A comma-separated list of fields to exclude. Reference
     * parameters of sub-objects with dot notation.
     * @returns {stores: array, total_file_size: integer, total_items: integer, _links: object } An
     * array with the information of the `stores` returned, `total_items` with the total count of
     * the stores collection, and `_links` array of link types and descriptions for the API schema
     * documents.
     */
    async getAllStores(
      count,
      offset,
      fields = undefined,
      excludeFields = undefined,
    ) {
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() =>
        mailchimp.ecommerce.stores({
          count,
          offset,
          fields,
          exclude_fields: excludeFields,
        }));
    },
    /**
     * Gets orders in an specified Ecommerce Store, or orders under the connected Mailchimp
     * acccount.
     * @params {String} storeId - The unique ID of the Ecommerce Store you'd like to get orders
     * from.
     * @params {Integer} count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @params {Integer} offset - For pagination, this the number of records from a collection to
     * skip. Default value is 0.
     * @params {String} campaignId - Restrict results to orders with this specific campaignId value.
     * @params {String} outreachId - Restrict results to orders with a specific outreachId value.
     * @params {String} customerId - Restrict results to orders made by the specific customer with
     * this unique ID.
     * @params {Boolean} hasOutreach - Restrict results to orders that have an outreach attached.
     * For example, an email campaign or Facebook ad.
     * @returns {store_id: string, orders: array, total_items: integer, _links: object } `store_id`
     * with the unique ID of the Ecommerce Store if specified (not present otherwise), an array
     * with the information of the `orders` returned, `total_items` with the total count of the
     * orders collection, and `_links` array of links for order manipulation through the Mailchimp
     * API.
     */
    async getAllOrders(
      storeId = null,
      count,
      offset,
      campaignId,
      outreachId,
      customerId,
      hasOutreach,
    ) {
      const opts = {
        count,
        offset,
        campaignId: campaignId === ""
          ? null
          : campaignId,
        outreachId: outreachId === ""
          ? null
          : outreachId,
        customerId: customerId === ""
          ? null
          : customerId,
        hasOutreach: [
          "Both",
        ].includes(hasOutreach)
          ? null
          : hasOutreach,
      };
      const mailchimp = this._initMailchimpClient();
      if (storeId === "") {
        return await this._withRetries(() =>
          mailchimp.ecommerce.getStoreOrders(storeId, opts));
      }
      return await this._withRetries(() => mailchimp.ecommerce.orders(opts));
    },
    /**
     * Gets details of a given campaign under the connected Mailchimp acccount.
     * @params {String} campaignId - The unique ID of the campaign you'd like to get details of.
     * @returns An object with all the details of a campaign.
     */
    async getMailchimpCampaignInfo(campaignId) {
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() => mailchimp.campaigns.get(campaignId));
    },
    /**
     * Gets information about all available segments for the specified Audience List in
     * the connected Mailchimp account.
     * @params {String} listId - The unique ID that identifies the Audience List you'd like to
     * watch for new or updated segments.
     * @params {Integer} count - For pagination, the number of records to return on each page.
     * Default value is 10. Maximum value is 1000.
     * @params {Integer} offset - For pagination, this the number of records from a collection to
     * skip. Default value is 0.
     * @params {Date} beforeCreatedAt - Restrict response to files created before the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @params {Date} sinceCreatedAt - Restrict response to files created since the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @params {Date} beforeUpdatedAt - Restrict response to files updated before the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @params {Date} sinceUpdatedAt - Restrict response to files updated since the set date.
     * Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
     * @returns {segments: array, list_id: integer, total_items: integer, _links: object } An
     * array with the information representing the list's `segments`, `list_id` for the id of the
     * Audience list, `total_items` with the total count of the segments
     * collection, and `_links` array of links for segment manipulation through the Mailchimp API.
     */
    async getAudienceSegments(
      listId,
      count,
      offset,
      sinceCreatedAt,
      beforeCreatedAt,
      sinceUpdatedAt,
      beforeUpdatedAt,
    ) {
      let opts = {
        count,
        offset,
      };
      if (sinceCreatedAt && beforeCreatedAt) {
        opts.sinceCreatedAt = sinceCreatedAt;
        opts.beforeCreatedAt = beforeCreatedAt;
      } else {
        opts.sinceUpdatedAt = sinceUpdatedAt;
        opts.beforeUpdatedAt = beforeUpdatedAt;
      }
      const mailchimp = this._initMailchimpClient();
      return await this._withRetries(() =>
        mailchimp.lists.listSegments(listId, opts));
    },
  },
};
