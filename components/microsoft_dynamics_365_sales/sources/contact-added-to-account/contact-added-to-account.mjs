import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-contact-added-to-account",
  name: "Contact Added to Account",
  description: "Emit new event when a contact is added to an account.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    accountId: {
      propDefinition: [
        common.props.microsoftDynamics365Sales,
        "accountId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.microsoftDynamics365Sales.listAccounts;
    },
    getArgs() {
      return {
        params: {
          "$filter": `accountid eq ${this.accountId}`,
          "$expand": "contact_customer_accounts",
        },
      };
    },
    getTsField() {
      return "modifiedon";
    },
    getRelevantResults(results) {
      const relevantResults = [];
      const account = results[0];
      account.contact_customer_accounts.forEach((contact) => {
        relevantResults.push({
          ...contact,
          addedToAccountOn: account.modifiedon,
        });
      });
      return relevantResults;
    },
    generateMeta(contact) {
      const ts = Date.parse(contact.addedToAccountOn);
      return {
        id: `${contact.contactid}${ts}`,
        summary: `Contact Added to Account: ${contact.fullname}`,
        ts,
      };
    },
  },
};
