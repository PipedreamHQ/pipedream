import { STAGE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import whautomate from "../../whautomate.app.mjs";

export default {
  key: "whautomate-create-contact",
  name: "Create Contact",
  description: "Create a new contact associated with a WhatsApp number. [See the documentation](https://help.whautomate.com/product-guides/whautomate-rest-api/contacts#/v1-contacts-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    whautomate,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The WhatsApp phone number of the contact. Format: +15555555555",
    },
    locationId: {
      propDefinition: [
        whautomate,
        "locationId",
      ],
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "The Contact Stage",
      optional: true,
      options: STAGE_OPTIONS,
    },
    tags: {
      propDefinition: [
        whautomate,
        "contactTags",
      ],
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "The contact custom fields.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "The contact notes.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      whautomate,
      locationId,
      tags,
      customFields,
      ...data
    } = this;

    const response = await whautomate.createContact({
      $,
      data: {
        ...data,
        location: {
          id: locationId,
        },
        tags: parseObject(tags),
        customFields: parseObject(customFields),
      },
    });

    $.export("$summary", `Successfully created contact with ID ${response.id}`);
    return response;
  },
};
