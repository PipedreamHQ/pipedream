const axios = require("axios");
const get = require("lodash/get");
const retry = require("async-retry");
const sendgrid = require("@sendgrid/client");

module.exports = {
  type: "app",
  app: "sendgrid",
  methods: {
    _authToken() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.sendgrid.com/v3";
    },
    api() {
      sendgrid.setDefaultHeader({
        "Content-Type": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      });
      sendgrid.setApiKey(this.$auth.api_key);
      return sendgrid;
    },
    _emailValidationsUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/validations/email`;
    },
    _webhookSettingsUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/user/webhooks/event/settings`;
    },
    _setSignedWebhookUrl() {
      const baseUrl = this._webhookSettingsUrl();
      return `${baseUrl}/signed`;
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    async _getAllItems(params) {
      const {
        url,
        query,
      } = params;
      const requestData = {
        query,
      };
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.post(url, requestData, requestConfig);
      return data;
    },
    _isRetriableStatusCode(statusCode) {
      [
        408,
        429,
        500,
      ].includes(statusCode);
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
              ${JSON.stringify(err.response, null, 2)}
            `);
          }
          console.warn(`Temporary error: ${err.message}`);
          throw err;
        }
      }, retryOpts);
    },
    async getWebhookSettings() {
      const url = this._webhookSettingsUrl();
      const requestConfig = this._makeRequestConfig();
      return this._withRetries(() => axios.get(url, requestConfig));
    },
    async setWebhookSettings(webhookSettings) {
      const url = this._webhookSettingsUrl();
      const requestConfig = this._makeRequestConfig();
      return this._withRetries(() =>
        axios.patch(url, webhookSettings, requestConfig));
    },
    async _setSignedWebhook(enabled) {
      const url = this._setSignedWebhookUrl();
      const requestData = {
        enabled,
      };
      const requestConfig = this._makeRequestConfig();
      return this._withRetries(() =>
        axios.patch(url, requestData, requestConfig));
    },
    async enableSignedWebhook() {
      const { data } = await this._setSignedWebhook(true);
      return data.public_key;
    },
    async disableSignedWebhook() {
      return this._setSignedWebhook(false);
    },
    /**
     * Adds an email to global supressions
     *
     * @param {array}  recipientEmails the email addresses to be added to the global
     * suppressions group.
     * @returns {recipient_emails: array} the email addresses that are globally suppressed.
     */
    async addEmailToGlobalSupression(recipientEmails) {
      const config = {
        method: "POST",
        url: "/v3/asm/suppressions/global",
        body: {
          recipient_emails: recipientEmails,
        },
      };
      const { data } = await this._withRetries(() =>
        this.api().request(config));
      return data;
    },
    /**
     * Adds an email to global supressions
     * @param {array} opts.list_ids an array of List ID strings that this contact will be added to.
     * @param {array}  opts.contacts one or more contacts objects for upsert. An email field is
     * required for each contact object. See the contact object description at:
     * https://docs.sendgrid.com/api-reference/contacts/add-or-update-a-contact
     * @returns {job_id: string } indicates that the contacts are queued for processing. Check the
     * job status with the "Import Contacts Status" endpoint. Check the API docs at:
     * https://docs.sendgrid.com/api-reference/contacts/import-contacts-status
     */
    async addOrUpdateContacts(opts) {
      const config = {
        method: "PUT",
        url: "/v3/marketing/contacts",
        body: {
          ...opts,
        },
      };
      const { data } = await this._withRetries(() =>
        this.api().request(config));
      return data;
    },
    /**
     * Creates a new contact list.
     *
     * @param {string}  name the name for the list.
     * @returns {id: string, name: string, contact_count: integer} object with the id of the
     * created list, the name given to the list, and contact_count with the number of contacts
     * currently stored on the list.
     */
    async createContactList(name) {
      const config = {
        method: "POST",
        url: "/v3/marketing/lists",
        body: {
          name,
        },
      };
      const { data } = await this._withRetries(() =>
        this.api().request(config));
      return data;
    },
    /**
     * Deletes all email addresses on on the associated account blocks list
     *
     * @param {boolean}  deleteAll Indicates if all blocked email addresses shoudld be deleted.
     * This can not be used with the `emails` parameter.
     * @param {array}  emails the specific blocked email addresses to delete.
     * @returns This endpoint replies with HTTP 204 code "No content".
     */
    async deleteBlocks(deleteAll, emails) {
      const config = {
        method: "DELETE",
        url: "/v3/suppression/blocks",
        body: {
          delete_all: deleteAll ?
            deleteAll :
            undefined,
          emails: emails ?
            emails :
            undefined,
        },
      };
      const { data } = await this._withRetries(() => this.api().request(config));
      return data;
    },
    /**
     * Deletes all email addresses on the associated account bounces list.
     *
     * @param {boolean}  deleteAll Indicates if all email addresses in the bounces list should be
     * deleted.
     * This can not be used with the `emails` parameter.
     * @param {array}  emails the specific email addresses to be deleted from the bounces list.
     * @returns this endpoint replies with HTTP 204 code "No content".
     */
    async deleteBounces(deleteAll, emails) {
      const config = {
        method: "DELETE",
        url: "/v3/suppression/bounces",
        body: {
          delete_all: deleteAll ?
            deleteAll :
            undefined,
          emails: emails ?
            emails :
            undefined,
        },
      };
      const { data } = await this._withRetries(() => this.api().request(config));
      return data;
    },
    /**
     * Deletes one or more contacts.
     *
     * @param {boolean}  deleteAllContacts Indicates if all delete contacts should be deleted.
     * This can not be used with the `ids` parameter.
     * @param {array}  ids the specific email addresses to be deleted from the bounces list.
     * @returns {job_id: string } the id of deletion job indicating request has been accepted
     * and is being processed. Contact deletion jobs are processed asynchronously.
     */
    async deleteContacts(deleteAllContacts, ids) {
      const config = {
        method: "DELETE",
        url: "/v3/marketing/contacts",
        qs: {
          ids: ids ?
            ids.join(",") :
            undefined,
          delete_all_contacts: deleteAllContacts ?
            deleteAllContacts.toString() :
            undefined,
        },
      };
      const { data } = await this._withRetries(() => this.api().request(config));
      return data;
    },
    /**
     * Removes an email address from the associated account's global suppressions group.
     *
     * @param {string}  email the email address to remove from the global suppressions group.
     * @returns this endpoint replies with HTTP 204 code "No content".
     */
    async deleteGlobalSupression(email) {
      const config = {
        method: "DELETE",
        url: `/v3/asm/suppressions/global/${email}`,
      };
      const { data } = await this._withRetries(() =>
        this.api().request(config));
      return data;
    },
    /**
     * Deletes a specific contact list.
     *
     * @param {string}  id id of the list to be deleted.
     * @param {boolean}  deleteContacts indicates if all contacts on the list are also to be
     * deleted.
     * @returns {job_id: string } the id of deletion job indicating request has been accepted
     * and is being processed. Contact deletion jobs are processed asynchronously.
     */
    async deleteList(id, deleteContacts) {
      const config = {
        method: "DELETE",
        url: `/v3/marketing/lists/${id}`,
        body: {
          delete_contacts: deleteContacts,
        },
      };
      const { data } = await this._withRetries(() => this.api().request(config));
      return data;
    },
    /**
     * Gets a specific block
     *
     * @param {string}  email the email address of the specific block.
     * @returns {created: integer, email: string, reason: string, status: string } an object
     * with: `created`, the unix timestamp indicating when the email address was added to the
     * blocks list. `email` with the email address added of the block list, `reason`, an
     * explanation for the reason of the block, and `status` with the status of the block.
     */
    async getBlock(email) {
      return (await this._withRetries(() => this.api().request({
        url: `/v3/suppression/blocks/${email}`,
      })))[1];
    },
    /**
     * Gets a global supression
     *
     * @param {string}  email the email address of the global suppression to retrieve.
     * @returns {recipient_email: string} the email address that is globally suppressed. This will
     * be an empty object if the email address you included in your call is not globally suppressed.
     */
    async getGlobalSupression(email) {
      return (await this._withRetries(() => this.api().request({
        url: `/v3/asm/suppressions/global/${email}`,
      })))[1];
    },
    /**
     * Get all the associated account's bounces.
     *
     * @param {integer}  startTime start of the time range in unix timestamp when a bounce was
     * created (inclusive).
     * @param {integer}  endTime end of the time range in unix timestamp when a bounce was
     * created (inclusive).
     * @returns {{created: number, email: string, reason: string, status: string}: array} an array
     * with details of each bounce returned: `created` for unix timestamp for when the bounce record
     * was created at SendGrid, `email` for the email address that was added to the bounce list,
     * `reason` with the reason for the bounce  (typicallya bounce code, an enhanced code, and a
     * description), and `status` for the enhanced SMTP bounce response.
     */
    async getAllBounces(startTime, endTime) {
      return (await this._withRetries(() => this.api().request({
        url: "v3/suppression/bounces",
        qs: {
          start_time: startTime,
          end_time: endTime,
        },
      })))[1];
    },
    /**
     * Get all the associated account's contact lists.
     *
     * @param {integer}  numberOfLists the number of contact lists to return.
     * @returns {{_metadata: object, contact_count: integer, id: string, name: string}: array} an
     * array with details of each contact list returned: `_metadata` with a `self` object containing
     * a link to the contat list, a `contact_count` with the count of contacts in the list, an `id`
     * as a unique identifier to the contat list, and the `name` of the list.
     */
    async getAllContactLists(maxItems) {
      const pageSize = Math.min(maxItems, 1000);
      const contactLists = [];
      let url = `/v3/marketing/lists?page_size=${pageSize}`;
      do {
        const data  = (await this._withRetries(() => this.api().request({
          url,
        })))[1];
        contactLists.push(...data.result);
        if (!data._metadata.next)
        {
          break;
        }
        url = data._metadata.next.replace("https://api.sendgrid.com", "");
      } while (true && contactLists.length < maxItems);
      return contactLists.slice(0, maxItems);
    },
    /**
     * Lists all email addresses that are currently the associated account blocks list.
     *
     * @param {integer}  startTime start of the time range in unix timestamp when a block was
     * created (inclusive).
     * @param {integer}  endTime end of the time range in unix timestamp when a block was
     * created (inclusive).
     * @param {integer}  numberOfBlocks the number of blocks to return.
     * @returns {{created: number, email: string, reason: string, status: string}: array} an array
     * with details of each block returned: `created` for unix timestamp for when the block record
     * was created at SendGrid, `email` for the email address that was added to the block  list,
     * `reason` with the reason for the block, and the `status` of the block.
     */
    async listBlocks(startTime, endTime, maxItems) {
      const pageSize = Math.min(maxItems, 100);
      const blocks = [];
      let url = `/v3/suppression/blocks?limit=${pageSize}`;
      let config = {
        method: "GET",
        url,
        start_time: startTime,
        end_time: endTime,
      };
      let lastIteration = false;
      do {
        const data  = (await this._withRetries(() => this.api().request(config)));
        blocks.push(...data[1]);
        if (lastIteration) {
          break;
        }
        const links = data[0].headers.link.split(",");
        url = "";
        links.forEach( (link) => {
          let next = "";
          let last = "";
          if ( link.indexOf("next") > -1) {
            const idx = link.indexOf(";");
            next = link.substring(0, idx).replace("<", "")
              .replace(">", "");
            url = next;
          }
          if ( link.indexOf("last") > -1) {
            const idx = link.indexOf(";");
            last = link.substring(0, idx).replace("<", "")
              .replace(">", "");
          }
          lastIteration = next === last;
        });
        config.url = url;
      } while (blocks.length < maxItems);
      return blocks.slice(0, maxItems);
    },
    /**
     * Lists all email addresses that are globally suppressed.
     *
     * @param {integer}  startTime start of the time range in unix timestamp when a global
     * supression was created (inclusive).
     * @param {integer}  endTime end of the time range in unix timestamp when  a global
     * supression was created (inclusive).
     * @param {integer}  numberOfSupressions the number of global supressions to return.
     * @returns {{created: number, email: string}: array} an array
     * with details of each global supression returned: `created` for unix timestamp for when
     * the recipient was added to the global suppression list, `email` for the email address of
     * the recipient who is globally suppressed.
     */
    async listGlobalSupressions(startTime, endTime, maxItems) {
      const pageSize = Math.min(maxItems, 100);
      const globalSupressions = [];
      let url = `/v3/suppression/unsubscribes?limit=${pageSize}`;
      let config = {
        method: "GET",
        url,
        start_time: startTime,
        end_time: endTime,
      };
      let lastIteration = false;
      do {
        const data  = (await this._withRetries(() => this.api().request(config)));
        globalSupressions.push(...data[1]);
        if (lastIteration) {
          break;
        }
        const links = data[0].headers.link.split(",");
        url = "";
        links.forEach( (link) => {
          let next = "";
          let last = "";
          if ( link.indexOf("next") > -1) {
            const idx = link.indexOf(";");
            next = link.substring(0, idx).replace("<", "")
              .replace(">", "");
            url = next;
          }
          if ( link.indexOf("last") > -1) {
            const idx = link.indexOf(";");
            last = link.substring(0, idx).replace("<", "")
              .replace(">", "");
          }
          const nextArr = [];
          nextArr.push(next);
          if (nextArr.includes(last)) {
            lastIteration = true;
          }
        });
        config.url = url;
      } while (globalSupressions.length < maxItems);
      return globalSupressions.slice(0, maxItems);
    },
    /**
     * Removes one or more contact from the specified list.
     *
     * @param {boolean}  id unique id of the List where the contact to remove off is located.
     * @param {array}  contactIds an string array of contact ids to be removed off the list.
     * @returns {job_id: string } the id of deletion job indicating request has been accepted
     * and is being processed. Contact deletion jobs are processed asynchronously.
     */
    async removeContactFromList(id, contactIds) {
      const config = {
        method: "DELETE",
        url: `/v3/marketing/lists/${id}/contacts`,
        qs: {
          contact_ids: contactIds.join(","),
        },
      };
      return await this._withRetries(() => this.api().request(config));
    },
    /**
     * Searches contacts in the associated account with a SGQL query.
     *
     * @param {string}  query the query field; accepts a valid SGQL for searching for a contact.
     * @returns {result: array, _metadata: object, contact_count: number } a `result` array with all
     * the contacts objects matching the query, `_metadata` object with a link to the search object,
     * and `contact_count` with the total number of contacts matched. See details on the contact
     * objects at the API docs: https://docs.sendgrid.com/api-reference/contacts/search-contacts
     */
    async searchContacts(query) {
      const config = {
        method: "POST",
        url: "/v3/marketing/contacts/search",
        body: {
          query,
        },
      };
      return (await this._withRetries(() => this.api().request(config)))[1];
    },
    async sendEmail(requestData) {
      const config = {
        method: "POST",
        url: "/v3/mail/send",
        body: requestData,
      };
      return await this._withRetries(() => this.api().request(config));
    },
    /**
     * Validates an email address.
     *
     * @param {string}  email the email to validate.
     * @param {string}  source optional indicator of the email address's source.
     * @returns {{ email: string, verdict: string, score: string, local: string, host: string
     * suggestion: string, checks: string, source: string, ip_address: string }: object } an
     * object with details of the validation result: `email`, the email being validated, `verdict`
     * a generic classification of whether or not the email address is valid, `score` a numeric
     * representation of the email validity, `local`, the local part of the email address, `host`,
     * the domain of the email address, `suggestion`, a suggested correction in the event of
     * domain name typos (e.g., gmial.com), the `checks` object with granular checks for email
     * address validity, `source`, the source of the validation, as per the API request, the IP
     * address associated with this email.
     */
    async validateEmail(body) {
      const config = {
        method: "POST",
        url: "/v3/validations/email",
        body,
      };
      return await this._withRetries(() => this.api().request(config));
    },
  },
};
