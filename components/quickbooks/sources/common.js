const quickbooks = require("../quickbooks.app");
const { createHmac } = require("crypto");
const {
  WEBHOOK_ENTITIES,
  WEBHOOK_OPERATIONS,
  SUPPORTED_WEBHOOK_OPERATIONS,
} = require("../constants");

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
    companyId(event) {
      return event.body.eventNotifications[0].realmId;
    },
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
    verifyWebhookRequest(event) {
      const token = this.webhookVerifierToken;
      const payload = event.bodyRaw;
      const header = event.headers["intuit-signature"];
      const hash = createHmac("sha256", token).update(payload)
        .digest("hex");
      const convertedHeader = Buffer.from(header, "base64").toString("hex");
      return hash === convertedHeader;
    },
    isValidSource(event) {
      const isWebhookValid = this.verifyWebhookRequest(event);
      if (!isWebhookValid) {
        console.log(`Error: Webhook did not pass verification. Try reentering the verifier token, 
        making sure it's from the correct section on the Intuit Developer Dashboard.`);
        return false;
      }

      const webhookCompanyId = this.companyId(event);
      const connectedCompanyId = this.quickbooks.companyId();
      if (webhookCompanyId !== connectedCompanyId) {
        console.log(`Error: Cannot retrieve record details for incoming webhook. The QuickBooks company id 
        of the incoming event (${webhookCompanyId}) does not match the company id of the account 
        currently connected to this source in Pipedream (${connectedCompanyId}).`);
        return false;
      }
      return true;
    },
    getEntities() {
      return WEBHOOK_ENTITIES;
    },
    getOperations() {
      return WEBHOOK_OPERATIONS;
    },
    isEntityRelevant(entity) {
      const {
        name,
        operation,
      } = entity;
      const relevantEntities = this.getEntities();
      const relevantOperations = this.getOperations();

      // only emit events that match the entity names and operations indicated by the user
      // but if the props are left empty, emit all events rather than filtering them all out
      // (it would a hassle for the user to select every option if they wanted to emit everything)
      if (relevantEntities?.length > 0 && !relevantEntities.includes(name)) {
        console.log(`Skipping '${operation} ${name}' event. (Accepted entities: ${relevantEntities.join(", ")})`);
        return false;
      }
      if (!relevantOperations?.length > 0 && !relevantOperations.includes(operation)) {
        console.log(`Skipping '${operation} ${name}' event. (Accepted operations: ${relevantOperations.join(", ")})`);
        return false;
      }
      return true;
    },
    async generateEvent(entity, event) {
      const eventDetails = {
        ...entity,
        companyId: this.companyId(event),
      };

      // Unless the record has been deleted, use the id received in the webhook
      // to get the full record data from QuickBooks
      const recordDetails = entity.operation === "Delete"
        ? {}
        : await this.quickbooks.getRecordDetails(entity.name, entity.id);

      return {
        eventDetails,
        recordDetails,
      };
    },
    generateMeta(event) {
      const {
        name,
        id,
        operation,
        lastUpdated,
      } = event.eventDetails;
      const summary = `${name} ${id} ${this.toPastTense(operation)}`;
      const ts = lastUpdated
        ? Date.parse(lastUpdated)
        : Date.now();
      const eventId = [
        name,
        id,
        operation,
        ts,
      ].join("-");
      return {
        id: eventId,
        summary,
        ts,
      };
    },
    async processEvent(event) {
      const { entities } = event.body.eventNotifications[0].dataChangeEvent;

      const events = await Promise.all(entities
        .filter(this.isEntityRelevant)
        .map(async (entity) => {
          // Generate events asynchronously to fetch multiple records from the API at the same time
          return await this.generateEvent(entity, event);
        }));

      events.forEach((event) => {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      });
    },

  },
  async run(event) {
    if (!this.isValidSource(event)) {
      console.log("Skipping event from unrecognized source.");
      return;
    }

    this.http.respond({
      status: 200,
    });

    return this.processEvent(event);
  },
};
