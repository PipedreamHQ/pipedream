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
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The type of object for which to monitor events",
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          // The list of allowed SObject types is static and exhaustively
          // provided through a single method call
          return {
            options: []
          };
        }

        const eventType = this.getEventType();
        const supportedObjectTypes = this.salesforce.listAllowedSObjectTypes(eventType);
        const options = supportedObjectTypes.map(i => ({
          label: i.label,
          value: i.name,
        }));
        return {
          options,
        };
      },
    },
  },
  hooks: {
    async activate() {
      // Retrieve metadata about the SObject specified by the user
      const nameField = await this.salesforce.getNameFieldForObjectType(this.objectType);
      this.db.set("nameField", nameField);

      // Create the webhook in the Salesforce platform
      const secretToken = uuidv4();
      const webhookData = await this.salesforce.createWebhook(
        this.http.endpoint,
        this.objectType,
        this.getEventType(),
        secretToken,
      );
      this.db.set("secretToken", secretToken);
      this.db.set("webhookData", webhookData);
    },
    async deactivate() {
      // Create the webhook from the Salesforce platform
      const webhookData = this.db.get("webhookData");
      await this.salesforce.deleteWebhook(webhookData);
    },
  },
  methods: {
    _isValidSource(event) {
      const {
        "x-webhook-token": webhookToken,
      } = event.headers;
      const secretToken = this.db.get("secretToken");
      return webhookToken === secretToken;
    },
    processEvent(event) {
      const { body } = event;
      const meta = this.generateMeta(event);
      this.$emit(body, meta);
    },
    generateMeta() {
      throw new Error('generateMeta is not implemented');
    },
    getEventType() {
      throw new Error('getEventType is not implemented');
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
