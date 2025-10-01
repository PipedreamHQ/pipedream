import esputnik from "../../esputnik.app.mjs";

export default {
  key: "esputnik-update-contact",
  name: "Update Contact",
  description: "Update an existing contact in eSputnik. [See the docs here](https://esputnik.com/api/methods.html#/v1/contact/{id}-PUT)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    esputnik,
    contact: {
      propDefinition: [
        esputnik,
        "contact",
      ],
    },
    firstName: {
      propDefinition: [
        esputnik,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        esputnik,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        esputnik,
        "email",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        esputnik,
        "address",
      ],
    },
    town: {
      propDefinition: [
        esputnik,
        "town",
      ],
    },
    region: {
      propDefinition: [
        esputnik,
        "region",
      ],
    },
    postcode: {
      propDefinition: [
        esputnik,
        "postcode",
      ],
    },
  },
  async run({ $ }) {
    const contact = await this.esputnik.getContact({
      contactId: this.contact,
      $,
    });
    const contactEmail = (contact.channels.find((channel) => channel.type == "email"))?.value;
    const data = {
      firstName: this.firstName || contact?.firstName,
      lastName: this.lastName || contact?.lastName,
      address: {
        address: this.address || contact?.address?.address,
        town: this.town || contact?.address?.town,
        region: this.region || contact?.address?.region,
        postcode: this.postcode || contact?.address?.postcode,
      },
      channels: {
        type: "email",
        value: this.email || contactEmail,
      },
    };
    await this.esputnik.updateContact({
      contactId: this.contact,
      data,
      $,
    });
    $.export("$summary", `Successfully updated contact with ID ${contact.id}`);
    // nothing to return
  },
};
