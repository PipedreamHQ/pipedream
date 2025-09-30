import { parseCustomFields } from "../../common/utils.mjs";
import pingback from "../../pingback.app.mjs";

export default {
  name: "Update Subscriber",
  description: "Update a specific subscriber by email [See the documentation](https://developer.pingback.com/docs/api/update-subscriber)",
  key: "pingback-update-subscriber",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pingback,
    email: {
      propDefinition: [
        pingback,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        pingback,
        "phone",
      ],
    },
    name: {
      propDefinition: [
        pingback,
        "name",
      ],
    },
    status: {
      propDefinition: [
        pingback,
        "status",
      ],
    },
    customFields: {
      propDefinition: [
        pingback,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      phone: this.phone,
      name: this.name,
      status: this.status,
    };

    data.customFields = parseCustomFields(this.customFields);

    const response = await this.pingback.updateSubscriber({
      $,
      email: this.email,
      data,
    });

    $.export("$summary", `Subscriber updated successfully with ID: ${response.data.data.id}`);
    return response;
  },
};
