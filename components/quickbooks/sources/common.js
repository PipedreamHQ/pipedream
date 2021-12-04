const quickbooks = require("../quickbooks.app");
const { createHmac } = require("crypto");
const { SUPPORTED_WEBHOOK_OPERATIONS } = require("../constants");

module.exports = {
  props: {
    quickbooks,
    http: {
      type: "$.interface.http",
      customResponse: true,
      label: "HTTP",
      description: "",
    },
    webhookVerifierToken: {
      propDefinition: [
        quickbooks,
        "webhookVerifierToken",
      ],
    },
  },
  methods: {
    getSupportedOperations(entityName) {
      return SUPPORTED_WEBHOOK_OPERATIONS[entityName];
    },
    toPastTense(operations) {
      const pastTenseVersion = {
        Create: "Created",
        Update: "Updated",
        Merge: "Merged",
        Delete: "Deleted",
        Void: "Voided",
        Emailed: "Emailed",
      };
      if (Array.isArray(operations)) {
        return operations.map((operation) => pastTenseVersion[operation]);
      } else {
        return pastTenseVersion[operations];
      }
    },
    sendHttpResponse(event, entities) {
      this.http.respond({
        status: 200,
        body: entities,
        headers: {
          "Content-Type": event.headers["Content-Type"],
        },
      });
    },
    isValidSource(event, webhookCompanyId) {
      const isWebhookValid = this.verifyWebhookRequest(event);
      if (!isWebhookValid) {
        console.log(`Error: Webhook did not pass verification. Try reentering the verifier token, 
        making sure it's from the correct section on the Intuit Developer Dashboard.`);
        return false;
      }

      const connectedCompanyId = this.quickbooks.companyId();
      if (webhookCompanyId !== connectedCompanyId) {
        console.log(`Error: Cannot retrieve record details for incoming webhook. The QuickBooks company id 
        of the incoming event (${webhookCompanyId}) does not match the company id of the account 
        currently connected to this source in Pipedream (${connectedCompanyId}).`);
        return false;
      }
      return true;
    },
    verifyWebhookRequest(event) {
      const token = this.webhookVerifierToken;
      const payload = event.bodyRaw;
      const header = event.headers["intuit-signature"];
      const hash = createHmac("sha256", token).update(payload)
        .digest("hex");
      const convertedHeader = Buffer.from(header, "base64").toString("hex");
      // console.log('Payload: ', payload)
      // console.log('Hash: ', hash)
      // console.log('Header: ', converted_header)
      return hash === convertedHeader;
    },
    async validateAndEmit(entity) {
      // individual source modules can redefine this method to specify criteria
      // for which events to emit
      await this.processEvent(entity);
    },
    async processEvent(entity) {
      const {name, id, operation} = entity
      const eventToEmit = {
        event_notification: entity,
        record_details: {},
      };
      // Unless the record has been deleted, use the id received in the webhook
      // to get the full record data
      if (entity.operation !== "Delete") {
        eventToEmit.record_details = await this.quickbooks
          .getRecordDetails(name, id);
      }
      const summary = `${name} ${id} ${this.toPastTense(operation)}`;
      const ts = entity?.lastUpdated
        ? Date.parse(entity.lastUpdated)
        : Date.now();
      const event_id = [
        name,
        id,
        operation,
        ts,
      ].join("-");
      console.log(event_id)
      this.$emit(eventToEmit, {
        id: event_id,
        summary,
        ts,
      });
    },
  },
  async run(event) {
    const { entities } = event.body.eventNotifications[0].dataChangeEvent;
    this.sendHttpResponse(event, entities);

    const webhookCompanyId = event.body.eventNotifications[0].realmId;
    if (!this.isValidSource(event, webhookCompanyId)) {
      console.log("Skipping event from unrecognized source.");
    } else {
      await Promise.all(entities.map((entity) => {
        entity.realmId = webhookCompanyId;
        return this.validateAndEmit(entity);
      }));
    }
  },
};
