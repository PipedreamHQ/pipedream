import alegra from "../../alegra.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "alegra-create-contact",
  name: "Create Contact",
  description: "Adds a new contact to Alegra. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    alegra,
    name: {
      propDefinition: [
        "alegra",
        "name",
      ],
    },
    identification: {
      propDefinition: [
        "alegra",
        "identification",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        "alegra",
        "address",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        "alegra",
        "city",
      ],
      optional: true,
    },
    phonePrimary: {
      propDefinition: [
        "alegra",
        "phonePrimary",
      ],
      optional: true,
    },
    phoneSecondary: {
      propDefinition: [
        "alegra",
        "phoneSecondary",
      ],
      optional: true,
    },
    mobile: {
      propDefinition: [
        "alegra",
        "mobile",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        "alegra",
        "email",
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        "alegra",
        "type",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        "alegra",
        "status",
      ],
      optional: true,
    },
    fax: {
      propDefinition: [
        "alegra",
        "fax",
      ],
      optional: true,
    },
    debtToPay: {
      propDefinition: [
        "alegra",
        "debtToPay",
      ],
      optional: true,
    },
    accountReceivable: {
      propDefinition: [
        "alegra",
        "accountReceivable",
      ],
      optional: true,
    },
    internalContacts: {
      propDefinition: [
        "alegra",
        "internalContacts",
      ],
      optional: true,
    },
    ignoreRepeated: {
      propDefinition: [
        "alegra",
        "ignoreRepeated",
      ],
      optional: true,
    },
    statementAttached: {
      propDefinition: [
        "alegra",
        "statementAttached",
      ],
      optional: true,
    },
    seller: {
      propDefinition: [
        "alegra",
        "sellerContact",
      ],
      optional: true,
    },
    priceList: {
      propDefinition: [
        "alegra",
        "priceListContact",
      ],
      optional: true,
    },
    term: {
      propDefinition: [
        "alegra",
        "termContact",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.alegra.createContact();
    $.export("$summary", `Created contact with ID ${response.id}`);
    return response;
  },
};
