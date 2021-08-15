const quickbooks = require("../quickbooks.app");
const { createHmac } = require("crypto");

//https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks/entities-and-operations-supported
const supportedWebhookOptions = {
  Account: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  Bill: [
    "Create",
    "Update",
    "Delete",
  ],
  BillPayment: [
    "Create",
    "Update",
    "Delete",
    "Void",
  ],
  Budget: [
    "Create",
    "Update",
  ],
  Class: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  CreditMemo: [
    "Create",
    "Update",
    "Delete",
    "Void",
    "Emailed",
  ],
  Currency: [
    "Create",
    "Update",
  ],
  Customer: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  Department: [
    "Create",
    "Update",
    "Merge",
  ],
  Deposit: [
    "Create",
    "Update",
    "Delete",
  ],
  Employee: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  Estimate: [
    "Create",
    "Update",
    "Delete",
    "Emailed",
  ],
  Invoice: [
    "Create",
    "Update",
    "Delete",
    "Void",
    "Emailed",
  ],
  Item: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  JournalCode: [
    "Create",
    "Update",
  ],
  JournalEntry: [
    "Create",
    "Update",
    "Delete",
  ],
  Payment: [
    "Create",
    "Update",
    "Delete",
    "Void",
    "Emailed",
  ],
  PaymentMethod: [
    "Create",
    "Update",
    "Merge",
  ],
  Preferences: [
    "Update",
  ],
  Purchase: [
    "Create",
    "Update",
    "Delete",
    "Void",
  ],
  PurchaseOrder: [
    "Create",
    "Update",
    "Delete",
    "Emailed",
  ],
  RefundReceipt: [
    "Create",
    "Update",
    "Delete",
    "Void",
    "Emailed",
  ],
  SalesReceipt: [
    "Create",
    "Update",
    "Delete",
    "Void",
    "Emailed",
  ],
  TaxAgency: [
    "Create",
    "Update",
  ],
  Term: [
    "Create",
    "Update",
  ],
  TimeActivity: [
    "Create",
    "Update",
    "Delete",
  ],
  Transfer: [
    "Create",
    "Update",
    "Delete",
    "Void",
  ],
  Vendor: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  VendorCredit: [
    "Create",
    "Update",
    "Delete",
  ],
};

module.exports = {
  props: {
    quickbooks,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    getSupportedOperations(entityName) {
      return supportedWebhookOptions[entityName];
    },

    getOperationsDescription(operations) {
      return this.toReadableList(this.toPastTense(operations));
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

    toReadableList(array) {
      // converts an array to a readable list like this:
      // ['Created', 'Updated', 'Merged'] => 'Created, Updated, or Merged'
      const list = array.join(", ");
      const indexAfterLastComma = list.lastIndexOf(",") + 1;
      if (indexAfterLastComma === 0) {
        //no commas were found so just return the list
        return list;
      } else {
        //add an 'or' after the last comma
        return list.slice(0, indexAfterLastComma) + " or" + list.slice(indexAfterLastComma);
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

    async validateAndEmit(event, entity) {
      // individual source modules can redefine this method to specify criteria
      // for which events to emit
      await this.emitEvent(event, entity);
    },

    async emitEvent(eventReceived, entity) {
      const token = this.webhook_verifier_token;
      const payload = eventReceived.bodyRaw;
      const header = eventReceived.headers["intuit-signature"];
      const isWebhookValid = this.verifyWebhookRequest(token, payload, header);
      if (!isWebhookValid) {
        const message = `Error: Webhook did not pass verification. Try reentering the verifier token, 
        making sure it's from the correct section on the Intuit Developer Dashboard.`;
        console.log(message);
        throw new Error(message);
      } else {
        const summary = `${entity.name} ${entity.id} ${this.toPastTense(entity.operation)}`;
        const webhookCompanyId = eventReceived.body.eventNotifications[0].realmId;
        const connectedCompanyId = this.quickbooks.$auth.company_id;
        if (webhookCompanyId !== connectedCompanyId) {
          const message = `Error: Cannot retrieve record details for ${summary}. The QuickBooks company id 
          of the incoming event (${webhookCompanyId}) does not match the company id of the account 
          currently connected to this source in Pipedream (${connectedCompanyId}).`;
          console.log(message);
          throw new Error(message);
        } else {
          entity.realmId = webhookCompanyId;
          const eventToEmit = {
            event_notification: entity,
            record_details: {},
          };
          // Unless the record has been deleted, use the id received in the webhook
          // to get the full record data
          if (entity.operation !== "Delete") {
            eventToEmit.record_details = await this.quickbooks
              .getRecordDetails(entity.name, entity.id);
          }
          this.$emit(eventToEmit, {
            summary,
          });
        }
      }
    },

    verifyWebhookRequest(token, payload, header) {
      const hash = createHmac("sha256", token).update(payload)
        .digest("hex");
      const convertedHeader = Buffer.from(header, "base64").toString("hex");
      // console.log('Payload: ', payload)
      // console.log('Hash: ', hash)
      // console.log('Header: ', converted_header)
      return hash === convertedHeader;
    },
  },
  async run(event) {
    const { entities } = event.body.eventNotifications[0].dataChangeEvent;
    this.sendHttpResponse(event, entities);
    await Promise.all(entities.map((entity) => this.validateAndEmit(event, entity)));
  },
};
