import app from "../../_4dem.app.mjs";

export default {
  key: "_4dem-create-sender",
  name: "Create Sender",
  description: "Create an email sender. You will need to confirm the email address used during creation. [See the documentation](https://api.4dem.it/#/operations/senders.email.store)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    nominative: {
      propDefinition: [
        app,
        "nominative",
      ],
    },
    ivaFCode: {
      propDefinition: [
        app,
        "ivaFCode",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    province: {
      propDefinition: [
        app,
        "province",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    cap: {
      propDefinition: [
        app,
        "cap",
      ],
    },
    telephone: {
      propDefinition: [
        app,
        "telephone",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createSender({
      $,
      data: {
        name: this.name,
        email: this.email,
        csa_data: {
          nominative: this.nominative,
          ivaFCode: this.ivaFCode,
          address: this.address,
          city: this.city,
          province: this.province,
          country: this.country,
          cap: this.cap,
          telephone: this.telephone,
        },
      },
    });

    $.export("$summary", "Successfully created the sender, now it's necessary to confirm it with the code sent to the provided email");

    return response;
  },
};
