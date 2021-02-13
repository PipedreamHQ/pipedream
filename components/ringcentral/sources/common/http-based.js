const template = require("lodash/template");
const { v4: uuid } = require("uuid");

const base = require("./base");
const notificationTypes = require("./notification-types");

module.exports = {
  ...base,
  dedupe: "unique",
  props: {
    ...base.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    ...base.hooks,
    async activate() {
      const verificationToken = this._getVerificationToken();
      this.db.set("verificationToken", verificationToken);

      const opts = {
        address: this.http.endpoint,
        eventFilters: this._getEventFilters(),
        verificationToken,
      };
      const {
        id: webhookId,
      } = await this.ringcentral.createHook(opts);
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.ringcentral.deleteHook(webhookId);

      this.db.set("verificationToken", null);
    },
  },
  methods: {
    ...base.methods,
    _getPropValues() {
      return Object.entries(this)
        .filter(([_, value]) => value != null)
        .reduce((accum, [prop, value]) => ({
          ...accum,
          [prop]: value,
        }), {});
    },
    _getEventFilters() {
      const eventKeys = this.getSupportedNotificationTypes();
      const propValues = this._getPropValues();
      return notificationTypes
        .filter(({ key }) => eventKeys.has(key))
        .map(({ filter }) => template(filter))
        .map((templateFn) => templateFn(propValues));
    },
    _getVerificationToken() {
      return uuid().replace(/-/g, "");
    },
    /**
     * Provides the set of notification types to which an HTTP-based event
     * source subscribes. This should be a subset of the `key` properties
     * available in the `notification-types` module.
     *
     * @return {Set}  The set of supported notification type keys
     */
    getSupportedNotificationTypes() {
      throw new Error("getSupportedNotificationTypes is not implemented");
    },
    /**
     * Validate that the incoming HTTP event comes from the expected source, and
     * reply with a `200` status code and the proper validation token header, as
     * described here:
     * https://community.ringcentral.com/questions/1306/validation-token-is-not-returned-when-creating-a-s.html
     *
     * In case the event comes from an unrecognized source, reply with a `404`
     * status code.
     *
     * The result of this method indicates whether the incoming event was valid
     * or not.
     *
     * @param {object}  event The HTTP event that triggers this event source
     * @return {boolean}  The outcome of the validation check (`true` for valid
     * events, `false` otherwise)
     */
    validateEvent(event) {
      const {
        "validation-token": validationToken,
        "verification-token": verificationToken,
      } = event.headers;

      const expectedVerificationToken = this.db.get("verificationToken") || verificationToken;
      if (verificationToken !== expectedVerificationToken) {
        this.http.respond({ status: 404 });
        return false;
      }

      this.http.respond({
        status: 200,
        headers: {
          "validation-token": validationToken,
        },
      });
      return true;
    },
    /**
     * Determines if the incoming event is relevant to this particular event
     * source, so that it's either processed or skipped in case it's relevant or
     * not, respectively.
     *
     * @param {object}  event The HTTP event that triggers this event source
     * @return {boolean}  Whether the incoming event is relevant to this event
     * source or not
     */
    isEventRelevant(event) {
      return true;
    },
    processEvent(event) {
      const { body } = event;
      if (!body) {
        console.log("Empty event payload. Skipping...");
        return;
      }

      if (!this.isEventRelevant(event)) {
        console.log("Event is irrelevant. Skipping...")
        return;
      }

      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
  },
  async run(event) {
    const isValidEvent = this.validateEvent(event);
    if (!isValidEvent) {
      console.log("Invalid event. Skipping...");
      return;
    }

    return this.processEvent(event);
  },
};
