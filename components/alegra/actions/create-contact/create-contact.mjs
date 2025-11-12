import alegra from "../../alegra.app.mjs";
import {
  STATUS_OPTIONS,
  TYPE_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "alegra-create-contact",
  name: "Create Contact",
  description: "Adds a new contact to Alegra. [See the documentation](https://developer.alegra.com/reference/post_contacts).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    alegra,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contact",
    },
    identification: {
      type: "string",
      label: "Identification",
      description: "Identification of the contact",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the contact",
      optional: true,
    },
    phonePrimary: {
      type: "string",
      label: "Primary Phone",
      description: "Primary phone number of the contact",
      optional: true,
    },
    phoneSecondary: {
      type: "string",
      label: "Secondary Phone",
      description: "Secondary phone number of the contact",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "Mobile phone number of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the contact",
      options: TYPE_OPTIONS,
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the contact",
      options: STATUS_OPTIONS,
      optional: true,
    },
    fax: {
      type: "string",
      label: "Fax",
      description: "Fax number of the contact",
      optional: true,
    },
    debtToPay: {
      propDefinition: [
        alegra,
        "debtToPay",
      ],
      optional: true,
    },
    accountReceivable: {
      propDefinition: [
        alegra,
        "debtToPay",
      ],
      label: "Account Receivable",
      description: "Id of the account receivable associated with the contact",
      optional: true,
    },
    internalContacts: {
      type: "string[]",
      label: "Internal Contacts",
      description: "A list of objects of internal contacts related to the contact. **Example: [ { name: \"John Doe\", email: \"john@email.com\"}]**. [See the documentation](https://developer.alegra.com/reference/post_contacts) for further information.",
      optional: true,
    },
    ignoreRepeated: {
      type: "boolean",
      label: "Ignore Repeated",
      description: "Ignore repeated contacts",
      optional: true,
    },
    statementAttached: {
      type: "boolean",
      label: "Statement Attached",
      description: "Indicates whether to include a statement for the contact",
      optional: true,
    },
    seller: {
      propDefinition: [
        alegra,
        "seller",
      ],
      optional: true,
    },
    priceList: {
      propDefinition: [
        alegra,
        "priceList",
      ],
      optional: true,
    },
    term: {
      propDefinition: [
        alegra,
        "term",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      alegra,
      city,
      address,
      debtToPay,
      accountReceivable,
      internalContacts,
      statementAttached,
      ...data
    } = this;

    const response = await alegra.createContact({
      $,
      data: {
        ...data,
        address: {
          city,
          address,
        },
        accounting: {
          debtToPay,
          accountReceivable,
        },
        internalContacts: parseObject(internalContacts),
        statementAttached: statementAttached
          ? "yes"
          : "no",
      },
    });
    $.export("$summary", `Created contact with ID ${response.id}`);
    return response;
  },
};
