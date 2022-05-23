import gorgias from "../../gorgias.app.mjs";
import channels from "../../common/customer-channels.mjs";

export default {
  key: "gorgias-create-customer",
  name: "Create Customer",
  description: "Create a new customer. [See the docs](https://developers.gorgias.com/reference/post_api-customers)",
  version: "0.0.1",
  type: "action",
  props: {
    gorgias,
    name: {
      type: "string",
      label: "Full Name",
      description: "Full name of the customer",
    },
    channelType: {
      propDefinition: [
        gorgias,
        "channel",
      ],
      description: "The channel used to send the message. Defaults to `email`. Will be set as the preferred (primary) channel to contact this customer.",
      options: channels,
      optional: false,
    },
    channelAddress: {
      propDefinition: [
        gorgias,
        "address",
      ],
      label: "Channel Address",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Primary email address of the customer",
      optional: true,
    },
    data: {
      propDefinition: [
        gorgias,
        "data",
      ],
    },
    externalId: {
      propDefinition: [
        gorgias,
        "externalId",
      ],
    },
    language: {
      propDefinition: [
        gorgias,
        "language",
      ],
    },
    timezone: {
      propDefinition: [
        gorgias,
        "timezone",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      email: this.email,
      data: this.data,
      external_id: this.externalId,
      language: this.language,
      timezone: this.timezone,
      channels: [
        {
          type: this.channelType,
          address: this.channelAddress,
          preferred: true,
        },
      ],
    };

    const response = await this.gorgias.createCustomer({
      $,
      data,
    });
    $.export("$summary", `Succesfully created customer ${response.id}`);
    return response;
  },
};
