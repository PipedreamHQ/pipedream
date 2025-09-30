import app from "../../quipu.app.mjs";

export default {
  key: "quipu-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the docs](http://quipuapp.github.io/api-v1-docs/#creating-a-contact).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Contact full name.",
    },
    taxId: {
      type: "string",
      label: "Tax ID (CIF/NIF)",
      description: "Contact tax id, (CIF/NIF).",
    },
    zipCode: {
      type: "string",
      label: "Postal Code",
      description: "Address postal code.",
    },
    countryCode: {
      type: "string",
      label: "Country",
      description: "Address country code, ISO 3166-2 format of e.g: `US`, `ES`, `PT`.",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Contact's phone number.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Contact's email address.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Contact's address.",
      optional: true,
    },
    town: {
      type: "string",
      label: "Town",
      description: "Contact's town.",
      optional: true,
    },
    clientNumber: {
      type: "integer",
      label: "Client Number",
      description: "Contact's client number.",
      optional: true,
    },
    supplierNumber: {
      type: "string",
      label: "Supplier Number",
      description: "The supplier number of the contact",
      optional: true,
    },
    isSupplierOfDirectGoods: {
      type: "boolean",
      label: "Is Supplier of Direct Goods",
      description: "Is the contact supplier of direct goods?",
      optional: true,
    },
    bankAccountNumber: {
      type: "string",
      label: "Bank Account Number",
      description: "The bank account number of the contact",
      optional: true,
    },
    bankAccountSwift: {
      type: "string",
      label: "Bank Account Swift",
      description: "The bank account swift of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const attributes = {
      "name": this.name,
      "tax_id": this.taxId,
      "phone": this.phone,
      "email": this.email,
      "address": this.address,
      "town": this.town,
      "zip_code": this.zipCode,
      "country_code": this.countryCode,
      "client_number": this.clientNumber,
      "supplier_number": this.supplierNumber,
      "is_supplier_of_direct_goods": this.isSupplierOfDirectGoods,
      "bank_account_number": this.bankAccountNumber,
      "bank_account_swift_bic": this.bankAccountSwift,
    };
    const contact = await this.app.createContact($, attributes);
    $.export("$summary", `Successfully created contact with ID "${contact.id}"`);
    return contact;
  },
};
