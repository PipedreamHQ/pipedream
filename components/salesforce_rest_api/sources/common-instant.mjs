import { v4 as uuidv4 } from "uuid";
import salesforce from "../salesforce_rest_api.app.mjs";
import salesforceWebhooks from "salesforce-webhooks";

const { SalesforceClient } = salesforceWebhooks;

export default {
  dedupe: "unique",
  props: {
    salesforce,
    db: "$.service.db",
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    objectType: {
      label: "Object Type",
      description: "The type of object for which to monitor events",
      propDefinition: [
        salesforce,
        "objectType",
      ],
    },
  },
  hooks: {
    async activate() {
      // Retrieve metadata about the SObject specified by the user
      const nameField = await this.salesforce.getNameFieldForObjectType(this.objectType);
      this.setNameField(nameField);

      // Create the webhook in the Salesforce platform
      const secretToken = uuidv4();
      let webhookData;
      try {
        webhookData = await this.createWebhook({
          endpointUrl: this.http.endpoint,
          sObjectType: this.objectType,
          event: this.getEventType(),
          secretToken,
          fieldsToCheck: this.getFieldsToCheck(),
          fieldsToCheckMode: this.getFieldsToCheckMode(),
          skipValidation: true, // neccessary for custom objects
        });
      } catch (err) {
        console.log("Create webhook error:", err);
        throw err;
      }
      this._setSecretToken(secretToken);
      this._setWebhookData(webhookData);
    },
    async deactivate() {
      // Create the webhook from the Salesforce platform
      const webhookData = this._getWebhookData();
      await this.deleteWebhook(webhookData);
    },
  },
  methods: {
    getClient() {
      const { salesforce } = this;
      return new SalesforceClient({
        apiVersion: salesforce._apiVersion(),
        authToken: salesforce._authToken(),
        instance: salesforce._subdomain(),
      });
    },
    createWebhook(args = {}) {
      const client = this.getClient();
      return client.createWebhook(args);
    },
    deleteWebhook(args = {}) {
      const client = this.getClient();
      return client.deleteWebhook(args);
    },
    _getSecretToken() {
      return this.db.get("secretToken");
    },
    _setSecretToken(secretToken) {
      this.db.set("secretToken", secretToken);
    },
    _getWebhookData() {
      return this.db.get("webhookData");
    },
    _setWebhookData(webhookData) {
      this.db.set("webhookData", webhookData);
    },
    getNameField() {
      return this.db.get("nameField");
    },
    setNameField(nameField) {
      this.db.set("nameField", nameField);
    },
    _isValidSource(event) {
      const webhookToken = event.headers["x-webhook-token"];
      const secretToken = this._getSecretToken();
      return webhookToken === secretToken;
    },
    processEvent(event) {
      const { body } = event;
      const meta = this.generateMeta(event);
      this.$emit(body, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    /**
     * This method returns the fields in the SObject type (e.g. Account, Lead, etc.) that the event
     * source should listen for updates to. This base implementation returns `undefined`, to not
     * necessitate any specific fields to be updated.
     *
     * @returns the fields in the SObject type for which to receive updates
     */
    getFieldsToCheck() {
      return undefined;
    },
    /**
     * This method returns whether the event source should listen for updates where `all` the fields
     * in the SObject are updated, or when `any` of them are. This base implementation returns
     * `undefined` to use to client's default `fieldToCheckMode` (`any`).
     *
     * @returns whether the webhook should receive events when `all` the fields to check are
     * updated, or when `any` of them are
     */
    getFieldsToCheckMode() {
      return undefined;
    },
  },
  async run(event) {
    if (!this._isValidSource(event)) {
      this.http.respond({
        statusCode: 404,
      });
      console.log("Skipping event from unrecognized source");
      return;
    }

    this.http.respond({
      statusCode: 200,
    });

    await this.processEvent(event);
  },
};
