import gorgias from "../../gorgias.app.mjs";
import channels from "../../common/customer-channels.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  pick,
  pickBy,
} from "lodash-es";

export default {
  key: "gorgias-update-customer",
  name: "Update Customer",
  description: "Update a customer. [See the docs](https://developers.gorgias.com/reference/put_api-customers-id-)",
  version: "0.0.1",
  type: "action",
  props: {
    gorgias,
    customerId: {
      propDefinition: [
        gorgias,
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
        gorgias,
        "channel",
      ],
      description: "The channel used to send the message. Defaults to `email`. Will be set as the preferred (primary) channel to contact this customer.",
      options: channels,
      default: "",
    },
    channelAddress: {
      propDefinition: [
        gorgias,
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

    const response = await this.gorgias.updateCustomer({
      id: this.customerId,
      data,
    });
    $.export("$summary", `Succesfully updated customer ${this.customerId}`);
    return response;
  },
};
