import salesforceWebhooks from "salesforce-webhooks";

const { SalesforceClient } = salesforceWebhooks;

export default {
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
  _isValidSource(event) {
    const webhookToken = event.headers["x-webhook-token"];
    const secretToken = this._getSecretToken();
    return webhookToken === secretToken;
  },
  processWebhookEvent(event) {
    const { body } = event;
    const meta = this.generateWebhookMeta(event);
    this.$emit(body, meta);
  },
  generateWebhookMeta() {
    throw new Error("generateWebhookMeta is not implemented");
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
};
