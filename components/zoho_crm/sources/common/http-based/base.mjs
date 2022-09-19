import {
  randomBytes, randomInt,
} from "crypto";
import zohoCrm from "../../../zoho_crm.app.mjs";

// Zoho CRM webhooks subscriptions have an expiration date of up to 1 day. This
// event source renews the subscription every 12 hours by default. More info can
// be found in the developer docs:
// https://www.zoho.com/crm/developer/docs/api/v2/notifications/enable.html
const hookRenewalPeriod = 60 * 60 * 12;

/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description,
  pipedream/required-properties-type */
export default {
  dedupe: "unique",
  props: {
    zohoCrm,
    db: "$.service.db",
    http: "$.interface.http",
    timer: {
      type: "$.interface.timer",
      label: "Subscription Renewal Timer",
      description: "Zoho CRM webhooks subscriptions have an expiration date of up to 1 day. This event source renews the subscription every 12 hours by default.",
      default: {
        intervalSeconds: hookRenewalPeriod,
      },
    },
  },
  hooks: {
    async activate() {
      const token = this._generateToken();
      const channelId = this._getRandomChannelId();
      const channelExpiry = this._getChannelNextExpiryDate();
      const events = this.getEvents();
      const hookOpts = {
        token,
        channelId,
        notifyUrl: this.http.endpoint,
        channelExpiry,
        events,
      };

      await this.zohoCrm.createHook(hookOpts);

      console.log(`
        Created webhook notification for channel ID: ${channelId}
      `);

      this._setToken(token);
      this._setChannelId(channelId);
    },
    async deactivate() {
      const channelId = this._getChannelId();
      await this.zohoCrm.deleteHook(channelId);

      console.log(`
        Deleted webhook notification for channel ID: ${channelId}
      `);

      this._setToken(null);
      this._setChannelId(null);
    },
  },
  methods: {
    _getToken() {
      return this.db.get("token");
    },
    _setToken(token) {
      this.db.set("token", token);
    },
    _getChannelId() {
      return this.db.get("channelId");
    },
    _setChannelId(channelId) {
      this.db.set("channelId", channelId);
    },
    _generateToken() {
      // The max size of a verification token is 50 chars:
      // https://www.zoho.com/crm/developer/docs/api/v2/notifications/enable.html
      const tokenSize = 49;
      return randomBytes(tokenSize)
        .toString("base64")
        .slice(0, tokenSize);
    },
    _getChannelNextExpiryDate() {
      const currentTimestamp = Date.now();
      const nextTimestamp = currentTimestamp + hookRenewalPeriod * 1000;
      const nextExpiryDate = new Date(nextTimestamp);
      return (
        nextExpiryDate
          .toISOString()
          // The API does not accept date ISO strings that include milliseconds
          .replace(/\.\d{3}Z$/, "Z")
      );
    },
    _getRandomChannelId() {
      // The max range that `crypto.randomInt` supports is 2 ** 48:
      // https://nodejs.org/api/crypto.html#crypto_crypto_randomint_min_max_callback
      return randomInt(1, 2 ** 48);
    },
    _isEventRelevant(event) {
      const { channel_id: eventChannelId } = event.body;
      const channelId = this._getChannelId();
      return eventChannelId === channelId.toString();
    },
    _isValidSource(event) {
      const { token: eventToken } = event.body;
      const token = this._getToken();
      return eventToken === token;
    },
    _renewHookSubscription() {
      const channelId = this._getChannelId();
      const channelExpiry = this._getChannelNextExpiryDate();
      const events = this.getEvents();
      const token = this._getToken();
      const renewOpts = {
        channelId,
        channelExpiry,
        events,
        token,
      };
      return this.zohoCrm.renewHookSubscription(renewOpts);
    },
    /**
     * Utility function that determines whether a module supports all the event
     * types to which this event source reacts.
     *
     * @param {object} module A Zoho CRM module object, as specified in their
     * API docs: https://www.zoho.com/crm/developer/docs/api/v2/module-meta.html
     * @returns {boolean} `true` if the module supports every operation related
     * to this event source, `false` otherwise.
     */
    areEventsSupportedByModule(module) {
      return !this.getSupportedOps()
        .some(({ flagName }) => !module[flagName]);
    },
    /**
     * Retrieves a list of resources from the Zoho CRM API based on a list of
     * ID's supplied as a parameter. The attributes of this function's argument
     * are a subset of the attributes present in the `body` of a Zoho CRM
     * webhook event, so this function can be easily called by a webhook handler
     * like this:
     * @example
     * async function run(event) {
     *   const { body } = event;
     *   const resources = await retrieveResources(body);
     * }
     *
     * @param {object}    opts Options for API resource retrieval
     * @param {string[]}  opts.ids The list of ID's of the resources to retrieve
     * @param {string}    opts.operation The operation that is being processed
     * during the current execution. Acceptable values are `create`, `delete`,
     * and `edit`. For `delete` operations, this function does not make any API
     * calls and, returns `undefined`;
     * @param {string}    opts.resource_uri
     * @returns {Promise<object[]>} The list of resources retrieved from the
     * API, as a promise.
     */
    async retrieveResources(opts) {
      const {
        ids,
        operation,
        resource_uri: uri,
      } = opts;
      if (operation === "delete") {
        // We won't attempt to retrieve resources that no longer exist
        // Return list of objects with `id`s, as the resources
        return ids.map((id) => ([
          {
            id,
          },
        ]));
      }

      const apiCalls = ids
        .map((id) => `${uri}/${id}`)
        .map(this.zohoCrm.genericApiGetCall);
      const responses = await Promise.all(apiCalls);
      return responses.map(({ data }) => data);
    },
    /**
     * This function returns the list of webhook events that the component
     * listens to. This corresponds to the `events` parameter that must be
     * specified when creating a webhook in Zoho CRM, as per the docs:
     * https://www.zoho.com/crm/developer/docs/api/v2/notifications/enable.html
     *
     * The function must be customised accordingly by each component based on
     * the specific event source requirements.
     *
     * For example, an event source that listens to new or updated _solutions_
     * would look like this:
     * @example
     * function getEvents() {
     *   return [
     *     "Solutions.create",
     *     "Solutions.edit",
     *   ];
     * }
     *
     * @returns {string[]} The list of webhook events that this event source
     * will listen to.
     */
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    /**
     * This function provides information about the types of CRUD operations
     * that the event source listens to.
     *
     * For example, an event source that reacts to the creation or edition of a
     * resource would return a list of size 2, with each entry corresponding to
     * each of the event types previously mentioned.
     *
     * The type of each entry in the returned list must be an object containing
     * the following attributes:
     * - `op`: The operation code. Acceptable values are `create`, `delete` or
     *   `edit`.
     * - `flagName`: The name of the attribute in a Zoho CRM's module object
     *   that signals whether the operation is supported. Acceptable values are
     *   `creatable`, `deletable` and `editable`, for creation, deletion and
     *   edition operations, respectively.
     * - `labelPostfix`: A user-friendly description of the operation.
     *
     * For convenience, the `crud-operations` module exports functions that
     * provide object for CRUD operations, so for example an event source that
     * reacts to creation or edition events can implement this function in the
     * following way:
     * @example
     * import { createOpData, editOpData } from "./crud-operations";
     * function getEvents() {
     *   return [
     *     createOpData(),
     *     editOpData(),
     *   ];
     * }
     *
     * @returns {object[]} The list of CRUD operations that this event source
     * reacts to
     */
    getSupportedOps() {
      throw new Error("getSupportedOps is not implemented");
    },
    generateMeta({
      event, resource,
    }) {
      const { body } = event;
      const {
        module,
        operation,
      } = body;
      const {
        id: resourceId,
        Created_Time: creationTime,
        Modified_Time: editionTime,
      } = resource;
      const id = `${editionTime}-${resourceId}`;
      const summary = `${module} ${operation}`;
      const ts = Math.max(Date.parse(creationTime), Date.parse(editionTime));
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent(event) {
      const { body } = event;
      const resourcesData = await this.retrieveResources(body);
      resourcesData.forEach((resourceData) => {
        // The Zoho CRM API always returns an array of objects when querying for
        // records, even if the query is for a single record (e.g. GET
        // /contacts/{id}). See the docs for more info:
        // https://www.zoho.com/crm/developer/docs/api/v2/modules-api.html
        const resource = resourceData.shift();
        const meta = this.generateMeta({
          event,
          resource,
        });
        this.$emit(resource, meta);
      });
    },
  },
  async run(event) {
    if (event.timestamp) {
      return this._renewHookSubscription();
    }

    if (!this._isEventRelevant(event)) {
      console.log("Skipping irrelevant event");
      return;
    }

    if (!this._isValidSource(event)) {
      console.log("Skipping event from unrecognized source");
      return;
    }

    return this.processEvent(event);
  },
};
