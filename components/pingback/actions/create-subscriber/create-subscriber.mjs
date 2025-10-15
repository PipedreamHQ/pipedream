import {
  parseCustomFields,
  parseObject,
} from "../../common/utils.mjs";
import pingback from "../../pingback.app.mjs";

export default {
  name: "Create Subscriber",
  description: "Create a new subscriber [See the documentation](https://developer.pingback.com/docs/api/create-subscriber)",
  key: "pingback-create-subscriber",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    segmentationLists: {
      propDefinition: [
        pingback,
        "segmentationLists",
      ],
    },
  },
  async run({ $ }) {
    const data  = {
      email: this.email,
      phone: this.phone,
      name: this.name,
      status: this.status,
      segmentationLists: parseObject(this.segmentationLists),
    };

    data.customFields = parseCustomFields(this.customFields);

    const response = await this.pingback.createSubscriber({
      $,
      data,
    });

    $.export("$summary", `Subscriber created successfully with ID: ${response.data.data.id}`);
    return response;
  },
};
