import template from "lodash.template";
import { v4 as uuid } from "uuid";
import base from "./base.mjs";
import notificationTypes from "./notification-types.mjs";

export default {
  ...base,
  dedupe: "unique",
  props: {
    ...base.props,
    http: {
      label: "HTTP",
      description: "HTTP based source",
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    ...base.hooks,
    async activate() {
      const verificationToken = this._getVerificationToken();
      this.db.set("verificationToken", verificationToken);

      const { id: webhookId } = await this.ringcentral.createHook({
        data: {
          eventFilters: this._getEventFilters(),
          deliveryMode: {
            transportType: "WebHook",
            address: this.http.endpoint,
            verificationToken,
            // 10 years in seconds (max the API supports - https://developers.ringcentral.com/api-reference/Subscriptions/createSubscription)
            // years * days * hours * minutes * seconds
            expiresIn: 10 * 365 * 24 * 60 * 60,
          },
        },
      });
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
    _getEventFilters() {
      const eventKeys = this.getSupportedNotificationTypes();
      const propValues = this.getPropValues();
      const {
        extensionId,
        ...otherPropValues
      } = propValues;
      return notificationTypes
        .filter(({ key }) => eventKeys.has(key))
        .reduce((reduction, { filter }) => {
          if (!Array.isArray(extensionId)) {
            const eventFilter = template(filter)(propValues);
            return reduction.concat(eventFilter);
          }
          const eventFilters =
            extensionId?.map((extensionId) => {
              const eventFilter = template(filter)({
                ...otherPropValues,
                extensionId,
              });
              return eventFilter;
            });
          return reduction.concat(eventFilters);
        }, []);
    },
    _getVerificationToken() {
      return uuid().replace(/-/g, "");
    },
    getPropValues() {
      throw new Error("getPropValues is not implemented");
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
        this.http.respond({
          status: 404,
        });
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
    isEventRelevant() {
      return true;
    },
    processEvent(event) {
      const { body } = event;

      if (!body) {
        console.log("Empty event payload. Skipping...");
        return;
      }

      if (!this.isEventRelevant(event)) {
        console.log("Event is irrelevant. Skipping...");
        return;
      }

      if (this.emitEvent) {
        return this.emitEvent(event);
      }

      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
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
