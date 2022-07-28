import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import retry from "async-retry";
import sendgrid from "@sendgrid/client";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendgrid",
  propDefinitions: {
    listIds: {
      type: "string[]",
      label: "List Ids",
      description: "A string array of List IDs where the contact will be added. Example:  `[\"49eeb4d9-0065-4f6a-a7d8-dfd039b77e0f\",\"89876b28-a90e-41d1-b73b-e4a6ce2354ba\"]`",
      optional: true,
      async options() {
        const lists = await this.getAllContactLists();
        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    contactIds: {
      type: "string[]",
      label: "Contact ID's",
      description: "An array of contact IDs to delete",
      optional: true,
      async options() {
        const contacts = await this.listContacts();
        return contacts.map(({
          id, first_name: firstName, last_name: lastName,
        }) => ({
          label: (firstName && lastName)
            ? `${firstName} ${lastName}`
            : id,
          value: id,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "An email template ID. A template that contains a subject and content — either text or html — will override any subject and content values specified at the personalizations or message level.",
      optional: true,
      async options() {
        const templates = await this.listTemplates();

        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    contactEmail: {
      type: "string",
      label: "Email",
      description: "The contact's email address",
      async options() {
        const contacts = await this.listContacts();
        return contacts
          .filter((contact) => contact.email)
          .map((contact) => contact.email);
      },
    },
    globalSuppressionEmail: {
      type: "string",
      label: "Email",
      description: "The email address you want to remove from the global suppressions group",
      async options() {
        const emails = await this.listGlobalSuppressions();
        return emails.map((email) => email.email);
      },
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "The 'From' email address used to deliver the message. This address should be a verified sender in your Twilio SendGrid account.",
      async options() {
        const senders = await this.getVerifiedSenders();
        return senders.map((sender) => sender.from_email);
      },
    },
    deleteAll: {
      type: "boolean",
      label: "Delete All",
      description: "Indicates if you want to delete all blocked email addresses. This can not be used with the `emails` parameter.",
      default: false,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "A string array of the specific blocked email addresses that you want to delete. This can not be used with the `deleteAll` parameter. Example: `[\"email1@example.com\",\"email2@example.com\"]`",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the specific block",
    },
    startTime: {
      type: "integer",
      label: "Start Time",
      description: "Refers start of the time range in unix timestamp when a bounce was created (inclusive)",
      optional: true,
    },
    endTime: {
      type: "integer",
      label: "End Time",
      description: "Refers end of the time range in unix timestamp when a bounce was created (inclusive)",
      optional: true,
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "A name or title associated with the sending email address",
      optional: true,
    },
    replyToEmail: {
      type: "string",
      label: "Reply To Email",
      description: "The email address where any replies or bounces will be returned",
      optional: true,
    },
    replyToName: {
      type: "string",
      label: "Reply To Name",
      description: "A name or title associated with the `replyToEmail` address",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The global or `message level` subject of your email",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the email in `text/html`",
    },
    attachments: {
      type: "string",
      label: "Attachments",
      description: "An array of objects where you can specify any attachments you want to include. The fields `content` and `filename` are required. `content` must be base64 encoded. Alternatively, provide a string that will `JSON.parse` to an array of attachments objects. Example: `[{content:\"aGV5\",type:\"text/plain\",filename:\"sample.txt\"}]`",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "An object containing key/value pairs of header names and the value to substitute for them. The key/value pairs must be strings. You must ensure these are properly encoded if they contain unicode characters. These headers cannot be one of the reserved headers.",
      optional: true,
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "A string array of category names for this message. Each category name may not exceed 255 characters. Example: `[\"category1\",\"category2\"]`",
      optional: true,
    },
    customArgs: {
      type: "string",
      label: "Custom Args",
      description: "Values that are specific to the entire send that will be carried along with the email and its activity data. Key/value pairs must be strings. Substitutions will not be made on custom arguments, so any string that is entered into this parameter will be assumed to be the custom argument that you would like to be used. This parameter is overridden by `custom_args` set at the personalizations level. Total `custom_args` size may not exceed 10,000 bytes.",
      optional: true,
    },
    sendAt: {
      type: "integer",
      label: "Send At",
      description: "A unix timestamp allowing you to specify when you want your email to be delivered. This may be overridden by the `send_at` parameter set at the personalizations level. Delivery cannot be scheduled more than 72 hours in advance. If you have the flexibility, it's better to schedule mail for off-peak times. Most emails are scheduled and sent at the top of the hour or half hour. Scheduling email to avoid peak times — for example, scheduling at 10:53 — can result in lower deferral rates due to the reduced traffic during off-peak times.",
      optional: true,
    },
    asm: {
      type: "object",
      label: "ASM",
      description: "Advanced Suppression Manager. An object allowing you to specify how to handle unsubscribes",
      optional: true,
    },
    ipPoolName: {
      type: "string",
      label: "IP Pool Name",
      description: "The IP Pool that you would like to send this email from",
      optional: true,
    },
    mailSettings: {
      type: "object",
      label: "Mail Settings",
      description: "A collection of different mail settings that you can use to specify how you would like this email to be handled",
      optional: true,
    },
    trackingSettings: {
      type: "object",
      label: "Tracking Settings",
      description: "Settings to determine how you would like to track the metrics of how your recipients interact with your email",
      optional: true,
    },
  },
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
      sendgrid.setApiKey(this._authToken());
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
    _makeRequestHeader() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return headers;
    },
    async _makeRequest(customConfig, $) {
      return this._withRetries(() => axios($ ?? this, customConfig));
    },
    async _makeClientRequest(customConfig) {
      return this._withRetries(() => this.api().request(customConfig));
    },
    _isRetriableStatusCode(statusCode) {
      const retriableStatusCodes = [
        408,
        429,
        500,
      ];
      return retriableStatusCodes.includes(statusCode);
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
          const statusCode = get(err, "code");
          if (statusCode === 403) {
            throw new ConfigurationError("The SendGrid API Key for this account does not have permission for this action. Enter the data manually, or update permissions.");
          }
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
      const config = {
        url: this._webhookSettingsUrl(),
        method: "GET",
        headers: this._makeRequestHeader(),
      };
      return this._makeRequest(config);
    },
    async setWebhookSettings(webhookSettings) {
      const config = {
        url: this._webhookSettingsUrl(),
        method: "PATCH",
        headers: this._makeRequestHeader(),
        data: webhookSettings,
      };
      return this._makeRequest(config);
    },
    async _setSignedWebhook(enabled) {
      const config = {
        url: this._setSignedWebhookUrl(),
        method: "PATCH",
        headers: this._makeRequestHeader(),
        data: {
          enabled,
        },
      };
      return this._makeRequest(config);
    },
    async enableSignedWebhook() {
      const data = await this._setSignedWebhook(true);
      return data.public_key;
    },
    async disableSignedWebhook() {
      return this._setSignedWebhook(false);
    },
    /**
     * Adds an email to global suppressions
     *
     * @param {array}  recipientEmails the email addresses to be added to the global
     * suppressions group.
     * @returns {recipient_emails: array} the email addresses that are globally suppressed.
     */
    async addEmailToGlobalSuppression(recipientEmails) {
      const config = {
        method: "POST",
        url: "/v3/asm/suppressions/global",
        body: {
          recipient_emails: recipientEmails,
        },
      };
      const { data } = await this._makeClientRequest(config);
      return data;
    },
    /**
     * Adds and/or updates a contact
     *
     * @param {array}  opts.contacts one or more contacts objects to add or update. An email field
     * is required for each contact object. See the contact object description at:
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
      const { data } = await this._makeClientRequest(config);
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
      const { data } = await this._makeClientRequest(config);
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
      const { data } = await this._makeClientRequest(config);
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
      const { data } = await this._makeClientRequest(config);
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
      const { data } = await this._makeClientRequest(config);
      return data;
    },
    /**
     * Removes an email address from the associated account's global suppressions group.
     *
     * @param {string}  email the email address to remove from the global suppressions group.
     * @returns this endpoint replies with HTTP 204 code "No content".
     */
    async deleteGlobalSuppression(email) {
      const config = {
        method: "DELETE",
        url: `/v3/asm/suppressions/global/${email}`,
      };
      const { data } = await this._makeClientRequest(config);
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
      const { data } = await this._makeClientRequest(config);
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
      const config = {
        url: `/v3/suppression/blocks/${email}`,
      };
      return (await this._makeClientRequest(config))[1];
    },
    /**
     * Gets a global suppression
     *
     * @param {string}  email the email address of the global suppression to retrieve.
     * @returns {recipient_email: string} the email address that is globally suppressed. This will
     * be an empty object if the email address you included in your call is not globally suppressed.
     */
    async getGlobalSuppression(email) {
      const config = {
        url: `/v3/asm/suppressions/global/${email}`,
      };
      return (await this._makeClientRequest(config))[1];
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
      const config = {
        url: "v3/suppression/bounces",
        qs: {
          start_time: startTime,
          end_time: endTime,
        },
      };
      return (await this._makeClientRequest(config))[1];
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
    async getAllContactLists(maxItems = 1000) {
      const pageSize = Math.min(maxItems, 1000);
      const contactLists = [];
      let url = `/v3/marketing/lists?page_size=${pageSize}`;
      const config = {
        url,
      };
      do {
        const data = (await this._makeClientRequest(config))[1];
        contactLists.push(...data.result);
        if (!data._metadata.next) {
          break;
        }
        url = data._metadata.next.replace("https://api.sendgrid.com", "");
      } while (contactLists.length < maxItems);
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
     * was created at SendGrid, `email` for the email address that was added to the block list,
     * `reason` with the reason for the block, and the `status` of the block.
     */
    async listBlocks(startTime, endTime, maxItems) {
      const listItemsEndpoint = "/v3/suppression/blocks";
      return this.listItems(listItemsEndpoint, startTime, endTime, maxItems);
    },
    /**
     * Lists all items of the requested account entity, blocks or global suppressions.
     *
     * @param {integer}  startTime start of the time range in unix timestamp when an item was
     * created (inclusive).
     * @param {integer}  endTime end of the time range in unix timestamp when an item was
     * created (inclusive).
     * @param {integer}  numberOfBlocks the number of items (blocks or global suppressions)
     * to return.
     * @returns {{created: number, email: string, reason: string, status: string}: array} an array
     * with details of each item returned: `created` for unix timestamp for when the item record
     * was created at SendGrid, `email` for the email address that was added to the item list,
     * `reason` with the reason for the item, and the `status` of the item.
     */
    async listItems(listItemsEndpoint, startTime, endTime, maxItems = 100) {
      const pageSize = Math.min(maxItems, 100);
      const items = [];
      let url = `${listItemsEndpoint}?limit=${pageSize}`;
      let config = {
        method: "GET",
        url,
        start_time: startTime,
        end_time: endTime,
      };
      let lastIteration = false;
      do {
        const data = (await this._makeClientRequest(config));
        items.push(...data[1]);
        if (lastIteration) {
          break;
        }
        const links = data[0].headers.link.split(",");
        url = "";
        links.forEach((link) => {
          let next = "";
          let last = "";
          if (link.indexOf("next") > -1) {
            const idx = link.indexOf(";");
            next = link.substring(0, idx).replace("<", "")
              .replace(">", "");
            url = next;
          }
          if (link.indexOf("last") > -1) {
            const idx = link.indexOf(";");
            last = link.substring(0, idx).replace("<", "")
              .replace(">", "");
          }
          lastIteration = next === last;
        });
        config.url = url;
      } while (items.length < maxItems);
      return items.slice(0, maxItems);
    },
    /**
     * Lists all email addresses that are globally suppressed.
     *
     * @param {integer}  startTime start of the time range in unix timestamp when a global
     * suppression was created (inclusive).
     * @param {integer}  endTime end of the time range in unix timestamp when  a global
     * suppression was created (inclusive).
     * @param {integer}  numberOfSuppressions the number of global suppressions to return.
     * @returns {{created: number, email: string}: array} an array
     * with details of each global suppression returned: `created` for unix timestamp for when
     * the recipient was added to the global suppression list, `email` for the email address of
     * the recipient who is globally suppressed.
     */
    async listGlobalSuppressions(startTime, endTime, maxItems) {
      const listItemsEndpoint = "/v3/suppression/unsubscribes";
      return this.listItems(listItemsEndpoint, startTime, endTime, maxItems);
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
      return this._makeClientRequest(config);
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
      return (await this._makeClientRequest(config))[1];
    },
    async listContacts() {
      const config = {
        method: "GET",
        url: "/v3/marketing/contacts",
      };
      const { result } = (await this._makeClientRequest(config))[1];
      return result;
    },
    async listTemplates() {
      const config = {
        method: "GET",
        url: "/v3/templates?generations=dynamic",
      };

      const { templates } = (await this._makeClientRequest(config))[1];
      return templates;
    },
    /**
     * Sends an email to the specified recipients.
     *
     * See details on the Send Mail request configurationand return values at the API docs:
     * https://docs.sendgrid.com/api-reference/mail-send/mail-send
     */
    async sendEmail(requestData) {
      const config = {
        method: "POST",
        url: "/v3/mail/send",
        body: requestData,
      };
      return this._makeClientRequest(config);
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
      return this._makeClientRequest(config);
    },
    async getVerifiedSenders() {
      const config = {
        method: "GET",
        url: "/v3/verified_senders",
      };
      const { results } = (await this._makeClientRequest(config))[1];
      return results;
    },
  },
};
