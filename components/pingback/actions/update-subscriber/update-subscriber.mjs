import { defineAction } from "@pipedream/types";
import { parseObject } from "../../common/utils.mjs";
import pingback from "../../pingback.app.mjs";

export default defineAction({
  name: "Update Subscriber",
  description: "Update a specific subscriber by email [See the documentation](https://developer.pingback.com/docs/api/update-subscriber)",
  key: "pingback-update-subscriber",
  version: "0.0.1",
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
    const response = await this.pingback.updateSubscriber({
      $,
      email: this.email,
      data: {
        phone: this.phone,
        name: this.name,
        status: this.status,
        customFields: Object.entries(parseObject(this.customFields))?.map(([
          key,
          value,
        ]) => ({
          label: key,
          value,
        })),
      },
    });

    $.export("$summary", `Subscriber updated successfully with ID: ${response.data.data.id}`);
    return response;
  },
});
