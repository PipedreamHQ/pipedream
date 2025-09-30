import thanksIo from "../../thanks_io.app.mjs";

export default {
  key: "thanks_io-add-recipient",
  name: "Add Recipient",
  description: "Add a recipient to a mailing list. [See the docs here](https://api-docs.thanks.io/#531c9124-66a9-459a-95c7-fb3d11aec6f8)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    thanksIo,
    subAccount: {
      propDefinition: [
        thanksIo,
        "subAccount",
      ],
    },
    mailingList: {
      propDefinition: [
        thanksIo,
        "mailingList",
        (c) => ({
          subAccount: c.subAccount,
        }),
      ],
      description: "The mailing list the recipient will be added to",
    },
    name: {
      propDefinition: [
        thanksIo,
        "name",
      ],
    },
    address: {
      propDefinition: [
        thanksIo,
        "address",
      ],
    },
    address2: {
      propDefinition: [
        thanksIo,
        "address2",
      ],
    },
    city: {
      propDefinition: [
        thanksIo,
        "city",
      ],
    },
    province: {
      propDefinition: [
        thanksIo,
        "province",
      ],
    },
    postalCode: {
      propDefinition: [
        thanksIo,
        "postalCode",
      ],
    },
    country: {
      propDefinition: [
        thanksIo,
        "country",
      ],
    },
    email: {
      propDefinition: [
        thanksIo,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        thanksIo,
        "phone",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.thanksIo.addRecipient({
      $,
      data: {
        mailing_list: this.mailingList,
        name: this.name,
        address: this.address,
        address2: this.address2,
        city: this.city,
        province: this.province,
        postal_code: this.postalCode,
        country: this.country,
        email: this.email,
        phone: this.phone,
      },
    });
    if (resp?.errors) {
      throw new Error(resp.errors);
    }
    $.export("$summary", "Successfully added recipient");
    return resp;
  },
};
