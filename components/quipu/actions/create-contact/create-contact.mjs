import app from "../../quipu.app.mjs";

export default {
  key: "quipu-create-contact",
  name: "Creating a contact",
  description: "Creates a new contact. [See the docs](http://quipuapp.github.io/api-v1-docs/#creating-a-contact).",
  version: "0.0.16",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
    },
    taxId: {
      type: "string",
      label: "Tax Id (CIF/NIF)",
      description: "The tax id of the contact",
    },
    zipCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the contact",
    },
    countryCode: {
      type: "string",
      label: "Country",
      description: "The country code of the contact, ISO 3166-2 format of e.g: `US`, `ES`, `PT`",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
      optional: true,
    },
    town: {
      type: "string",
      label: "Town",
      description: "The town of the contact",
      optional: true,
    },
    clientNumber: {
      type: "integer",
      label: "Client Number",
      description: "The client number of the contact",
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
    $.export("$summary", `Successfully created contact "${contact.id}"`);
    return contact;
  },
};
