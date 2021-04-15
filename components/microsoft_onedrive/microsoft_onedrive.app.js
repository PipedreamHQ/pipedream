const retry = require("async-retry");
const axios = require("axios");
const get = require("lodash/get");

module.exports = {
  type: "app",
  app: "microsoft_onedrive",
  methods: {
    _apiUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _subscriptionsEndpoint(id) {
      const baseUrl = this._apiUrl();
      const url = `${baseUrl}/subscriptions`;
      return id
        ? `${url}/${id}`
        : url;
    },
    _driveEndpoint() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/me/drive/root`;
    },
    _driveDeltaEndpoint() {
      const baseUrl = this._driveEndpoint();
      return `${baseUrl}/delta`;
    },
    _driveItemsEndpoint(itemId) {
      const baseUrl = this._driveEndpoint();
      const url = `${baseUrl}/items`;
      return itemId
        ? `${url}/${itemId}`
        : url;
    },
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    _withRetries(
      apiCall,
      isRequestRetriable = this._isStatusCodeRetriable.bind(this),
    ) {
      const retryOpts = {
        retries: 5,
        factor: 2,
        minTimeout: 2000, // In milliseconds
      };
      return retry(async (bail, retryCount) => {
        try {
          return await apiCall();
        } catch (err) {
          console.log("lalala");
          if (!isRequestRetriable(err)) {
            const statusCode = get(err, [
              "response",
              "status",
            ]);
            const errData = get(err, [
              "response",
              "data",
            ], {});
            return bail(new Error(`
              Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(errData, null, 2)}
            `));
          }

          console.error(`
            [Attempt #${retryCount}] Temporary error: ${err.message}
          `);
          throw err;
        }
      }, retryOpts);
    },
    _isStatusCodeRetriable(responseErr) {
      const statusCode = get(responseErr, [
        "response",
        "status",
      ]);
      return [
        401,
        429,
        502,
      ].includes(statusCode);
    },
    _isHookRequestRetriable(responseErr) {
      // Sometimes an API call to create a webhook/subscription fails because
      // our component was unable to quickly validate the subscription. In those
      // cases, we want to retry the request since at this point the webhook is
      // not created but the request itself is well formed.
      //
      // See the docs for more information on how webhooks are validated upon
      // creation: https://bit.ly/3fzc3Tr
      const errPattern = /endpoint must respond .*? to validation request/i;
      const errMsg = get(responseErr, [
        "response",
        "data",
        "error",
        "message",
      ], "");
      return (
        errPattern.test(errMsg) ||
        this._isStatusCodeRetriable(responseErr)
      );
    },
    /**
     * This method creates a [OneDrive webhook](https://bit.ly/2PxfQ9j) to
     * monitor a specific resource, defaulted to the authenticated user's drive.
     *
     * @param {Object}  opts an object containing the different options for the
     * hook creation
     * @param {string}  opts.notificationUrl the target URL of the webhook
     * @param {string}  opts.expirationDateTime the timestamp of the hook
     * subscription expiration, in ISO-8601 format
     * @param {string}  [opts.resource="/me/drive/root"] the resource to which
     * the webhook will subscribe for events
     * @returns the ID of the created webhook
     */
    async createHook({
      notificationUrl,
      expirationDateTime,
      resource = "/me/drive/root",
    }) {
      const url = this._subscriptionsEndpoint();
      const requestData = {
        notificationUrl,
        resource,
        expirationDateTime,
        changeType: "updated",
      };
      const requestConfig = this._makeRequestConfig();
      const { data: { id: hookId } = {} } = await this._withRetries(
        () => axios.post(url, requestData, requestConfig),
        this._isHookRequestRetriable.bind(this),
      );
      return hookId;
    },
    /**
     * This method performs an update to a [OneDrive
     * webhook](https://bit.ly/2PxfQ9j). An example of such operation is to
     * extend the expiration time of a webhook subscription.
     *
     * @param {string}  id the ID of the webhook to update
     * @param {Object}  opts the fields to update in the webhook
     * @param {string}  opts.expirationDateTime the new expiration date of the
     * webhook subscription
     */
    async updateHook(id, { expirationDateTime }) {
      const url = this._subscriptionsEndpoint(id);
      const requestData = {
        expirationDateTime,
      };
      const requestConfig = this._makeRequestConfig();
      await this._withRetries(
        () => axios.patch(url, requestData, requestConfig),
        this._isHookRequestRetriable.bind(this),
      );
    },
    /**
     * This method deletes an existing [OneDrive
     * webhook](https://bit.ly/2PxfQ9j)
     *
     * @param {string}  id the ID of the webhook to delete
     */
    async deleteHook(id) {
      const url = this._subscriptionsEndpoint(id);
      const requestConfig = this._makeRequestConfig();
      await this._withRetries(
        () => axios.delete(url, requestConfig),
      );
    },
    /**
     * This method retrieves a [OneDrive Delta Link](https://bit.ly/3fNawcs) for
     * the authenticated user's drive
     *
     * @param {Object}  opts an object containing the different options to
     * customize the retrieved Delta Link
     * @param {number}  [opts.pageSize=10] the size of the page that a call to
     * the Delta Link will retrieve (see the `$top` parameter in the [Delta Link
     * docs](https://bit.ly/3sRzRpn))
     * @returns a [OneDrive Delta Link](https://bit.ly/3fNawcs)
     */
    async getDeltaLink({ pageSize }) {
      const url = this._driveDeltaEndpoint();
      const $top = pageSize
        ? Math.max(pageSize, 1)
        : undefined;
      const requestConfig = {
        ...this._makeRequestConfig(),
        params: {
          $top,
        },
      };
      const { data } = await this._withRetries(
        () => axios.get(url, requestConfig),
      );
      return data["@odata.deltaLink"] || data["@odata.nextLink"];
    },
    /**
     * This method retrieves the [latest OneDrive Delta
     * Link](https://bit.ly/3wB5d5O) for the authenticated user's drive
     *
     * @returns the [latest OneDrive Delta Link](https://bit.ly/3wB5d5O)
     */
    getLatestDeltaLink() {
      const params = {
        token: "latest",
      };
      return this.getDeltaLink(params);
    },
    /**
     * This generator method scans the latest updated items in a OneDrive drive
     * based on the provided Delta Link. It yields drive items until the updated
     * items collection is exhausted, after which it finally returns the Delta
     * Link to use in future scans.
     *
     * @param {string}  deltaLink the [OneDrive Delta
     * Link](https://bit.ly/3fNawcs) from where to start scanning the drive's
     * items
     * @yields the next updated item in the drive
     * @returns the Delta Link to use in the next drive scan
     */
    async *scanDeltaItems(deltaLink) {
      const requestConfig = this._makeRequestConfig();
      let url = deltaLink;
      while (true) {
        // See the docs for more information on the format of the delta API
        // response: https://bit.ly/31I0wZP
        const { data } = await this._withRetries(
          () => axios.get(url, requestConfig),
        );
        const {
          "@odata.nextLink": nextLink,
          "@odata.deltaLink": nextDeltaLink = deltaLink,
          "value": items,
        } = data;
        for (const item of items) {
          yield item;
        }

        if (items.length === 0) {
          return nextDeltaLink;
        }

        url = nextLink || nextDeltaLink;
      }
    },
  },
};
