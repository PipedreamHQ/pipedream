import { ConfigurationError } from "@pipedream/platform";
import {
  pick,
  pickBy,
} from "lodash-es";
import channels from "../../common/customer-channels.mjs";
import gorgias_oauth from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-update-customer",
  name: "Update Customer",
  description: "Update a customer. [See the docs](https://developers.gorgias.com/reference/put_api-customers-id-)",
  version: "0.0.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gorgias_oauth,
    customerId: {
      propDefinition: [
        gorgias_oauth,
        "customerId",
      ],
    },
    name: {
      type: "string",
      label: "Full Name",
      description: "Full name of the customer",
      optional: true,
    },
    channelType: {
      propDefinition: [
        gorgias_oauth,
        "channel",
      ],
      description: "The channel used to send the message. Defaults to `email`. Will be set as the preferred (primary) channel to contact this customer.",
      options: channels,
      default: "",
    },
    channelAddress: {
      propDefinition: [
        gorgias_oauth,
        "address",
      ],
      label: "Channel Address",
      optional: true,
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
    const data = pickBy(pick(this, [
      "name",
      "email",
      "data",
      "language",
      "timezone",
    ]));

    data.external_id = this.externalId;
    if (this.channelType || this.channelAddress) {
      if (this.channelType && this.channelAddress) {
        data.channels = [
          {
            type: this.channelType,
            address: this.channelAddress,
            preferred: true,
          },
        ];
      } else {
        throw new ConfigurationError("Both `Channel` and `Channel Address` must be sent together");
      }
    }

    const response = await this.gorgias_oauth.updateCustomer({
      id: this.customerId,
      data,
    });
    $.export("$summary", `Succesfully updated customer ${this.customerId}`);
    return response;
  },
};
