import channels from "../../common/customer-channels.mjs";
import gorgias_oauth from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-create-customer",
  name: "Create Customer",
  description: "Create a new customer. [See the docs](https://developers.gorgias.com/reference/post_api-customers)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gorgias_oauth,
    name: {
      type: "string",
      label: "Full Name",
      description: "Full name of the customer",
    },
    channelType: {
      propDefinition: [
        gorgias_oauth,
        "channel",
      ],
      description: "The channel used to send the message. Defaults to `email`. Will be set as the preferred (primary) channel to contact this customer.",
      options: channels,
      optional: false,
    },
    channelAddress: {
      propDefinition: [
        gorgias_oauth,
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
        gorgias_oauth,
        "data",
      ],
    },
    externalId: {
      propDefinition: [
        gorgias_oauth,
        "externalId",
      ],
    },
    language: {
      propDefinition: [
        gorgias_oauth,
        "language",
      ],
    },
    timezone: {
      propDefinition: [
        gorgias_oauth,
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

    const response = await this.gorgias_oauth.createCustomer({
      $,
      data,
    });
    $.export("$summary", `Succesfully created customer ${response.id}`);
    return response;
  },
};
