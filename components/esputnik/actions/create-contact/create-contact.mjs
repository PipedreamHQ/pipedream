import esputnik from "../../esputnik.app.mjs";

export default {
  key: "esputnik-create-contact",
  name: "Create Contact",
  description: "Create a new contact in eSputnik. [See the docs here](https://esputnik.com/api/methods.html#/v1/contact-POST)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    esputnik,
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
    segments: {
      propDefinition: [
        esputnik,
        "segment",
      ],
      type: "string[]",
      description: "Select the segments to add contact to",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      channels: {
        type: "email",
        value: this.email,
      },
      address: {
        address: this.address,
        town: this.town,
        region: this.region,
        postcode: this.postcode,
      },
    };
    if (this?.segments?.length > 0) {
      data.groups = this.segments.map((segment) => ({
        id: segment,
      }));
    }
    const resp = await this.esputnik.createContact({
      data,
      $,
    });
    $.export("$summary", `Successfully created contact with ID ${resp.id}`);
    return resp;
  },
};
