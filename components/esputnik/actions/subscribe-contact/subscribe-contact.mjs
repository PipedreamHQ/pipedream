import esputnik from "../../esputnik.app.mjs";

export default {
  key: "esputnik-subscribe-contact",
  name: "Subscribe Contact",
  description: "Create a new unverified contact in eSputnik. For use with double opt-in implementation. User will need to verify the email to confirm their subscription. [See the docs here](https://esputnik.com/api/methods.html#/v1/contact/subscribe-POST)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
  },
  async run({ $ }) {
    const contact = {
      firstName: this.firstName,
      lastName: this.lastName,
      address: {
        address: this.address,
        town: this.town,
        region: this.region,
        postcode: this.postcode,
      },
      channels: {
        type: "email",
        value: this.email,
      },
    };
    const resp = await this.esputnik.subscribeContact({
      data: {
        contact,
      },
    });
    const summary = resp.emailStatus === "ALREADY_SUBSCRIBED"
      ? `Contact with ID ${resp.id} already subscribed`
      : `Unverified contact added with ID ${resp.id}`;
    $.export("$summary", summary);
    return resp;
  },
};
