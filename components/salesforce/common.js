const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");

const salesforce = require("./salesforce.app");

module.exports = {
  dedupe: "unique",
  props: {
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    salesforce,
    objectType: { propDefinition: [salesforce, "objectType"] },
  },
  hooks: {
    async activate() {
      // Retrieve base API URL's for this account
      const apiUrls = await this.salesforce.getApiUrls();
      this.db.set("apiUrls", apiUrls);

      // Enable this Salesforce account to make HTTP
      // calls to this event source's endpoint.
      // API docs: https://sforce.co/3jAeV0G
      const { metadata: metadataApiUrl } = apiUrls;
      const remoteSiteName = this._getRemoteSiteName();
      const { endpoint: endpointUrl } = this.http;
      await this.salesforce.createRemoteSite(metadataApiUrl, remoteSiteName, endpointUrl);
      this.db.set("remoteSiteName", remoteSiteName);

      // Create a custom Apex class to handle the HTTP
      // request logic of the webhook.
      const secretToken = uuidv4();
      const webhookName = this._getWebhookName();
      const webhookBody = this.getWebhookBody(webhookName, secretToken);
      const { id: webhookId } = await this.salesforce.createApexClass(webhookName, webhookBody);
      this.db.set("secretToken", secretToken);
      this.db.set("webhookId", webhookId);

      // Create a custom Apex trigger to listen to
      // the relevant events and dispatch the webhook
      // call(s) accordingly.
      const triggerName = this._getTriggerName();
      const triggerBody = this.getTriggerBody(triggerName, webhookName);
      const objectType = this.getObjectType();
      const { id: triggerId } =
        await this.salesforce.createApexTrigger(triggerName, triggerBody, objectType);
      this.db.set("triggerId", triggerId);
    },
    async deactivate() {
      const triggerId = this.db.get("triggerId");
      await this.salesforce.deleteApexTrigger(triggerId);

      const webhookId = this.db.get("webhookId");
      await this.salesforce.deleteApexClass(webhookId);

      const { metadata: metadataApiUrl } = this.db.get("apiUrls");
      const remoteSiteName = this.db.get("remoteSiteName");
      await this.salesforce.deleteRemoteSite(metadataApiUrl, remoteSiteName);
    },
  },
  methods: {
    _getRemoteSiteName() {
      const eventSourceName = this.getEventSourceName();
      return this.standardizeName(eventSourceName);
    },
    _getTriggerName() {
      return this.standardizeName("trigger");
    },
    _getWebhookName() {
      return this.standardizeName("webhook");
    },
    _isValidSource(event) {
      const {
        "x-webhook-token": webhookToken,
      } = event.headers;
      const secretToken = this.db.get("secretToken");
      return webhookToken === secretToken;
    },
    standardizeName(rawName) {
      const options = {
        replacement: "_",
        remove: /[()-]/g,
        lower: true,
      };
      const id = uuidv4();
      const enrichedRawName = `pd_${rawName}_${id}`;
      return slugify(enrichedRawName, options).substring(0, 40);
    },
    processEvent(event) {
      const { body } = event;
      const meta = this.generateMeta(event);
      this.$emit(body, meta);
    },
    generateMeta() {
      throw new Error('generateMeta is not implemented');
    },
    getEventSourceName() {
      throw new Error('getEventSourceName is not implemented');
    },
    getEventTypes() {
      throw new Error('getEventTypes is not implemented');
    },
    getObjectType() {
      throw new Error('getObjectType is not implemented');
    },
    getTriggerBody() {
      throw new Error('getTriggerBody is not implemented');
    },
    getWebhookBody(webhookName, secretToken) {
      return `
        public abstract class ${webhookName} {

          public static String jsonContent(final Map<String, Object> eventContent) {
              final Map<String, Object> content = new Map<String, Object>(eventContent);
              content.put('UserId', UserInfo.getUserId());
              return JSON.serialize(content);
          }

          @future(callout=true)
          public static void callout(final String url, final String content) {
              final HttpRequest request = new HttpRequest();
              request.setEndpoint(url);
              request.setMethod('POST');
              request.setHeader('Content-Type', 'application/json');
              request.setHeader('X-Webhook-Token', '${secretToken}');
              request.setBody(content);

              final Http http = new Http();
              http.send(request);
          }

        }
      `;
    },
  },
  async run(event) {
    if (!this._isValidSource(event)) {
      this.http.respond({
        statusCode: 404,
      });
      return;
    }

    this.http.respond({
      statusCode: 200,
    });

    await this.processEvent(event);
  },
};
