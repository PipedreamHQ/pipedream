import invoice_ninja from "../../invoice_ninja.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "invoice_ninja-create-client",
  name: "Create Client",
  description: "Creates a new client in Invoice Ninja. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    invoice_ninja,
    contacts: {
      propDefinition: [
        invoice_ninja,
        "contacts",
      ],
    },
    countryId: {
      propDefinition: [
        invoice_ninja,
        "countryId",
      ],
    },
    name: {
      propDefinition: [
        invoice_ninja,
        "name",
      ],
      optional: true,
    },
    website: {
      propDefinition: [
        invoice_ninja,
        "website",
      ],
      optional: true,
    },
    privateNotes: {
      propDefinition: [
        invoice_ninja,
        "privateNotes",
      ],
      optional: true,
    },
    industryId: {
      propDefinition: [
        invoice_ninja,
        "industryId",
      ],
      optional: true,
    },
    sizeId: {
      propDefinition: [
        invoice_ninja,
        "sizeId",
      ],
      optional: true,
    },
    address1: {
      propDefinition: [
        invoice_ninja,
        "address1",
      ],
      optional: true,
    },
    address2: {
      propDefinition: [
        invoice_ninja,
        "address2",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        invoice_ninja,
        "city",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        invoice_ninja,
        "state",
      ],
      optional: true,
    },
    postalCode: {
      propDefinition: [
        invoice_ninja,
        "postalCode",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        invoice_ninja,
        "phone",
      ],
      optional: true,
    },
    vatNumber: {
      propDefinition: [
        invoice_ninja,
        "vatNumber",
      ],
      optional: true,
    },
    idNumber: {
      propDefinition: [
        invoice_ninja,
        "idNumber",
      ],
      optional: true,
    },
    groupSettingsId: {
      propDefinition: [
        invoice_ninja,
        "groupSettingsId",
      ],
      optional: true,
    },
    classification: {
      propDefinition: [
        invoice_ninja,
        "classification",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const client = await this.invoice_ninja.createNewClient({
      contacts: this.contacts.map(JSON.parse),
      country_id: this.countryId,
      name: this.name,
      website: this.website,
      private_notes: this.privateNotes,
      industry_id: this.industryId,
      size_id: this.sizeId,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      state: this.state,
      postal_code: this.postalCode,
      phone: this.phone,
      vat_number: this.vatNumber,
      id_number: this.idNumber,
      group_settings_id: this.groupSettingsId,
      classification: this.classification,
    });
    $.export("$summary", `Created client ${client.name}`);
    return client;
  },
};
