import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-get-contact",
  name: "Get Contact",
  description: "Gets details of a contact.",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    contactIdentifier: {
      type: "string",
      description: "Xero identifier of the contact to get. Possible values: \n* **ContactID** - The Xero identifier for a contact e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **ContactNumber** -  A custom identifier specified from another system e.g. a CRM system has a contact number of CUST100",
      label: "Contact Identifier",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.getContactById({
        $,
        tenantId: this.tenantId,
        contactIdentifier: this.contactIdentifier,
      });

      $.export("$summary", `Contact retrieved successfully: ${this.contactIdentifier}`);
      return response;
    } catch (e) {
      $.export("$summary", `No contact found with identifier: ${this.contactIdentifier}`);
      return {};
    }
  },
};
